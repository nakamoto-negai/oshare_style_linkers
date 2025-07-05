#!/usr/bin/env python
import os
import django
import requests
from pathlib import Path

# Django設定の初期化
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
django.setup()

from answers.models import Question, Answer

def test_image_upload():
    # 最新の質問を取得
    question = Question.objects.first()
    if not question:
        print("質問が見つかりません")
        return
    
    print(f"質問ID: {question.id}")
    print(f"質問タイトル: {question.title}")
    
    # テスト用画像作成
    test_image_path = "test_answer_image.jpg"
    with open(test_image_path, "wb") as f:
        # 小さなJPEG画像データ（1x1ピクセル）
        jpeg_data = bytes.fromhex('FFD8FFE000104A46494600010101006000600000FFD9')
        f.write(jpeg_data)
    
    print(f"テスト画像作成: {test_image_path}")
    print(f"ファイルサイズ: {os.path.getsize(test_image_path)} bytes")
    
    # API経由で回答投稿
    url = "http://127.0.0.1:8000/api/answers/create/"
    
    data = {
        'content': 'デバッグ用画像付き回答です。十分な文字数で投稿しています。',
        'question': str(question.id)
    }
    
    files = {
        'image': ('test_answer.jpg', open(test_image_path, 'rb'), 'image/jpeg')
    }
    
    print("\n=== API リクエスト送信 ===")
    print(f"URL: {url}")
    print(f"Data: {data}")
    print(f"Files: {list(files.keys())}")
    
    try:
        response = requests.post(url, data=data, files=files)
        print(f"\n=== レスポンス ===")
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
                print(f"内容: {answer.content}")
                print(f"画像フィールド: '{answer.image}'")
                if answer.image:
                    print(f"画像パス: {answer.image.path}")
                    print(f"画像URL: {answer.image.url}")
                    print(f"ファイル存在: {os.path.exists(answer.image.path)}")
                else:
                    print("画像フィールドが空です")
        else:
            print(f"エラーレスポンス: {response.text}")
            
    except Exception as e:
        print(f"エラー: {e}")
    
    finally:
        # ファイルクリーンアップ
        files['image'][1].close()
        if os.path.exists(test_image_path):
            os.remove(test_image_path)
            print(f"\nテスト画像削除: {test_image_path}")

if __name__ == "__main__":
    test_image_upload()
