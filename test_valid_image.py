#!/usr/bin/env python
import os
import django
from PIL import Image
import io

# Django設定の初期化
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
django.setup()

from answers.models import Question, Answer
from answers.serializers import AnswerCreateSerializer
from django.test import RequestFactory
from django.core.files.uploadedfile import SimpleUploadedFile

def create_valid_test_image():
    """有効なテスト画像を作成"""
    # PIL を使って小さなRGB画像を作成
    img = Image.new('RGB', (100, 100), color='red')
    
    # BytesIOに保存
    img_io = io.BytesIO()
    img.save(img_io, format='JPEG', quality=80)
    img_data = img_io.getvalue()
    
    return img_data

def test_with_valid_image():
    print("=== 有効な画像でのテスト ===")
    
    # 最新の質問を取得
    question = Question.objects.first()
    if not question:
        print("質問が見つかりません")
        return
    
    print(f"質問ID: {question.id}")
    
    # 有効な画像データを作成
    try:
        image_data = create_valid_test_image()
        print(f"有効な画像データ作成: {len(image_data)} bytes")
    except Exception as e:
        print(f"画像作成エラー: {e}")
        return
    
    # SimpleUploadedFileを作成
    image_file = SimpleUploadedFile(
        name='valid_test.jpg',
        content=image_data,
        content_type='image/jpeg'
    )
    
    # シリアライザーのテスト
    data = {
        'content': '有効な画像での回答テストです。十分な文字数で投稿しています。',
        'question': question.id,
        'image': image_file
    }
    
    # RequestFactoryでリクエストを作成
    factory = RequestFactory()
    request = factory.post('/api/answers/create/', data=data)
    
    # シリアライザーを使用
    serializer = AnswerCreateSerializer(data=data, context={'request': request})
    
    print(f"バリデーション結果: {serializer.is_valid()}")
    
    if not serializer.is_valid():
        print(f"エラー: {serializer.errors}")
        return
    
    print("バリデーションOK！")
    
    # 保存テスト
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user = User.objects.first()
        if not user:
            user = User.objects.create_user(
                username='test_user_valid',
                email='test_valid@example.com',
                first_name='有効テストユーザー'
            )
        
        answer = serializer.save(user=user)
        print(f"保存成功！")
        print(f"回答ID: {answer.id}")
        print(f"内容: {answer.content[:50]}...")
        print(f"画像フィールド: '{answer.image}'")
        
        if answer.image:
            print(f"画像パス: {answer.image.path}")
            print(f"画像URL: {answer.image.url}")
            print(f"ファイル存在: {os.path.exists(answer.image.path)}")
            if os.path.exists(answer.image.path):
                print(f"保存ファイルサイズ: {os.path.getsize(answer.image.path)} bytes")
        else:
            print("画像フィールドが空です！")
            
    except Exception as e:
        print(f"保存エラー: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_with_valid_image()
