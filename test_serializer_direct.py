#!/usr/bin/env python
import os
import django
import sys

# Django設定の初期化
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
django.setup()

from answers.models import Question, Answer
from answers.serializers import AnswerCreateSerializer
from django.test import RequestFactory
from django.core.files.uploadedfile import SimpleUploadedFile

def test_serializer_directly():
    print("=== Django Answer Serializer Direct Test ===")
    
    # 最新の質問を取得
    question = Question.objects.first()
    if not question:
        print("質問が見つかりません")
        return
    
    print(f"質問ID: {question.id}")
    print(f"質問タイトル: {question.title}")
    
    # テスト用画像データ作成
    jpeg_data = bytes.fromhex('FFD8FFE000104A46494600010101006000600000FFD9')
    image_file = SimpleUploadedFile(
        name='test_answer.jpg',
        content=jpeg_data,
        content_type='image/jpeg'
    )
    
    print(f"テスト画像サイズ: {len(jpeg_data)} bytes")
    print(f"画像ファイル名: {image_file.name}")
    print(f"画像Content-Type: {image_file.content_type}")
    
    # シリアライザーのテスト
    data = {
        'content': 'シリアライザー直接テスト用の回答です。十分な文字数で投稿しています。',
        'question': question.id,
        'image': image_file
    }
    
    print(f"\n=== シリアライザーテストデータ ===")
    for key, value in data.items():
        if key == 'image':
            print(f"{key}: {type(value)} - {value}")
        else:
            print(f"{key}: {value}")
    
    # RequestFactoryでリクエストを作成
    factory = RequestFactory()
    request = factory.post('/api/answers/create/', data=data)
    
    # シリアライザーを使用
    serializer = AnswerCreateSerializer(data=data, context={'request': request})
    
    print(f"\n=== バリデーション結果 ===")
    print(f"is_valid(): {serializer.is_valid()}")
    
    if not serializer.is_valid():
        print(f"エラー: {serializer.errors}")
        return
    
    print("バリデーションOK！")
    
    # 保存テスト
    print(f"\n=== 保存テスト ===")
    try:
        # ユーザーを取得（仮）
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user = User.objects.first()
        if not user:
            user = User.objects.create_user(
                username='test_user',
                email='test@example.com',
                first_name='テストユーザー'
            )
        
        answer = serializer.save(user=user)
        print(f"保存成功！")
        print(f"回答ID: {answer.id}")
        print(f"内容: {answer.content}")
        print(f"画像フィールド: '{answer.image}'")
        print(f"画像フィールドタイプ: {type(answer.image)}")
        
        if answer.image:
            print(f"画像パス: {answer.image.path}")
            print(f"画像URL: {answer.image.url}")
            print(f"ファイル存在: {os.path.exists(answer.image.path)}")
            if os.path.exists(answer.image.path):
                print(f"保存ファイルサイズ: {os.path.getsize(answer.image.path)} bytes")
        else:
            print("画像フィールドが空です！")
            
        # DBから直接確認
        print(f"\n=== DB再取得確認 ===")
        answer_from_db = Answer.objects.get(id=answer.id)
        print(f"DBから取得した画像フィールド: '{answer_from_db.image}'")
        
    except Exception as e:
        print(f"保存エラー: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_serializer_directly()
