#!/usr/bin/env python
# -*- coding: utf-8 -*-
import requests

def check_question_images():
    """質問の画像状況を確認"""
    print("=== 質問の画像状況確認 ===")
    url = 'http://localhost:8000/api/questions/'
    response = requests.get(url)
    if response.status_code == 200:
        questions = response.json()
        print('最新の質問の画像状況:')
        for q in questions[:5]:
            image_status = q.get('image', None)
            print(f'ID: {q["id"]}, タイトル: {q["title"]}')
            print(f'  画像: {image_status if image_status else "なし"}')
            print()
    else:
        print(f'Error: {response.text}')

if __name__ == '__main__':
    check_question_images()
