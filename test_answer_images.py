#!/usr/bin/env python
# -*- coding: utf-8 -*-
import requests
import tempfile
import os
from PIL import Image

def test_answer_with_image():
    """画像付き回答投稿のテスト"""
    print("=== 画像付き回答投稿テスト ===")
    
    # テスト用画像を作成
    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_file:
        img = Image.new('RGB', (100, 100), color='blue')
        img.save(tmp_file, 'JPEG')
        tmp_file_path = tmp_file.name
    
    try:
        url = 'http://localhost:8000/api/answers/create/'
        
        # FormDataを使用して画像付きで投稿
        with open(tmp_file_path, 'rb') as f:
            files = {
                'image': ('answer_test.jpg', f, 'image/jpeg'),
            }
            
            data = {
                'content': '画像付きの回答です。この回答には画像が添付されています。とても詳しく説明しています。',
                'question': '21'
            }
            
            response = requests.post(url, data=data, files=files)
            
            if response.status_code == 201:
                created_answer = response.json()
                print(f"画像付き回答投稿成功!")
                print(f"  ID: {created_answer['id']}")
                print(f"  画像: {created_answer.get('image', 'なし')}")
                print(f"  内容: {created_answer['content']}")
            else:
                print(f"エラー: {response.status_code} - {response.text}")
                
    finally:
        # テスト用画像を削除
        if os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)

    print("\n=== 画像なし回答投稿テスト ===")
    
    # 画像なしでの投稿
    data = {
        'content': '画像なしの回答です。この回答は画像がありませんが、十分詳しく説明されています。',
        'question': 21
    }
    
    response = requests.post(url, data=data)
    
    if response.status_code == 201:
        created_answer = response.json()
        print(f"画像なし回答投稿成功!")
        print(f"  ID: {created_answer['id']}")
        print(f"  画像: {created_answer.get('image', 'なし')}")
        print(f"  内容: {created_answer['content']}")
    else:
        print(f"エラー: {response.status_code} - {response.text}")

if __name__ == '__main__':
    test_answer_with_image()
