#!/usr/bin/env python
"""
HTML form 形式での画像アップロードテスト
実際のブラウザと同じ形式でテストします
"""
import os
import django
import requests
from io import BytesIO
from PIL import Image

# Django設定の初期化
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
django.setup()

from answers.models import Question, Answer

def create_test_image():
    """有効なテスト画像を作成"""
    # 10x10の赤い画像を作成
    img = Image.new('RGB', (10, 10), color='red')
    
    # BytesIOに保存
    img_io = BytesIO()
    img.save(img_io, format='JPEG', quality=90)
    img_data = img_io.getvalue()
    
    print(f"テスト画像作成完了: {len(img_data)} bytes")
    return img_data

def test_html_form_upload():
    """HTML form 形式でのアップロードテスト"""
    print("=== HTML Form Upload Test ===")
    
    # 最新の質問を取得
    question = Question.objects.first()
    if not question:
        print("質問が見つかりません")
        return
    
    print(f"質問ID: {question.id}")
    print(f"質問タイトル: {question.title}")
    
    # 有効な画像データを作成
    image_data = create_test_image()
    
    # multipart/form-data 形式でPOST
    url = "http://127.0.0.1:8000/api/answers/create/"
    
    data = {
        'content': 'HTML Form形式でのテスト回答です。十分な文字数で投稿しています。',
        'question': str(question.id)
    }
    
    files = {
        'image': ('test_form.jpg', image_data, 'image/jpeg')
    }
    
    print(f"\n=== リクエスト情報 ===")
    print(f"URL: {url}")
    print(f"Data: {data}")
    print(f"Files: {list(files.keys())}")
    print(f"Image size: {len(image_data)} bytes")
    
    try:
        print("\n=== APIリクエスト送信 ===")
        response = requests.post(url, data=data, files=files)
        
        print(f"ステータスコード: {response.status_code}")
        print(f"レスポンスヘッダー: {dict(response.headers)}")
        
        if response.status_code == 201:
            response_data = response.json()
            print(f"レスポンスデータ: {response_data}")
            
            # DBから確認
            answer_id = response_data.get('id')
            if answer_id:
                answer = Answer.objects.get(id=answer_id)
                print(f"\n=== DB確認 ===")
                print(f"回答ID: {answer.id}")
                print(f"内容: {answer.content[:50]}...")
                print(f"画像フィールド: '{answer.image}'")
                
                if answer.image:
                    print(f"画像パス: {answer.image.path}")
                    print(f"画像URL: {answer.image.url}")
                    print(f"ファイル存在: {os.path.exists(answer.image.path)}")
                    if os.path.exists(answer.image.path):
                        print(f"保存ファイルサイズ: {os.path.getsize(answer.image.path)} bytes")
                    print("✅ 画像保存成功!")
                else:
                    print("❌ 画像フィールドが空です")
        else:
            print(f"❌ APIエラー: {response.text}")
            
    except Exception as e:
        print(f"❌ リクエストエラー: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_html_form_upload()
