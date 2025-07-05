#!/usr/bin/env python
# -*- coding: utf-8 -*-
import requests
import tempfile
import os
from PIL import Image

def test_frontend_question_creation():
    """フロントエンド質問投稿のテスト（FormData）"""
    url = 'http://localhost:8000/api/questions/'
    
    print("=== FormDataでの質問投稿テスト ===")
    
    # テスト用画像を作成
    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_file:
        img = Image.new('RGB', (100, 100), color='red')
        img.save(tmp_file, 'JPEG')
        tmp_file_path = tmp_file.name
    
    try:
        # FormDataを使用して投稿
        with open(tmp_file_path, 'rb') as f:
            files = {
                'image': ('test.jpg', f, 'image/jpeg'),
            }
            
            data = {
                'title': 'フロントエンドからの画像付き質問',
                'content': 'これはフロントエンドから画像付きで投稿されたテスト質問です。',
                'category': 'styling',
                'reward_points': '30'
            }
            
            response = requests.post(url, data=data, files=files)
            
            if response.status_code == 201:
                created_question = response.json()
                print(f"FormData質問投稿成功!")
                print(f"  ID: {created_question['id']}")
                print(f"  タイトル: {created_question['title']}")
                print(f"  画像: {created_question['image']}")
                print(f"  作成日: {created_question['created_at']}")
            else:
                print(f"エラー: {response.status_code} - {response.text}")
                
    finally:
        # テスト用画像を削除
        if os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)

    print("\n=== FormData（画像なし）での質問投稿テスト ===")
    
    data = {
        'title': 'フロントエンドからの画像なし質問',
        'content': 'これはフロントエンドから画像なしで投稿されたテスト質問です。',
        'category': 'coordination',
        'reward_points': '20'
    }
    
    response = requests.post(url, data=data)
    
    if response.status_code == 201:
        created_question = response.json()
        print(f"FormData質問投稿成功（画像なし）!")
        print(f"  ID: {created_question['id']}")
        print(f"  タイトル: {created_question['title']}")
        print(f"  作成日: {created_question['created_at']}")
    else:
        print(f"エラー: {response.status_code} - {response.text}")

if __name__ == '__main__':
    test_frontend_question_creation()
