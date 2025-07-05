#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import sys
import django

# Django設定
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
django.setup()

import requests

def test_questions_api():
    """質問APIのテスト"""
    url = 'http://localhost:8000/api/questions/'
    
    print("=== 質問一覧取得テスト ===")
    response = requests.get(url)
    if response.status_code == 200:
        questions = response.json()
        print(f"取得した質問数: {len(questions)}")
        print("最新の質問:")
        for q in questions[:3]:
            print(f"  ID: {q['id']}, タイトル: {q['title']}")
    else:
        print(f"エラー: {response.status_code} - {response.text}")
    
    print("\n=== 質問投稿テスト ===")
    test_data = {
        'title': 'フロントエンドテスト用質問',
        'content': 'これはフロントエンドとバックエンドの連携テスト用の質問です。',
        'category': 'other',
        'reward_points': 20
    }
    
    headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
    }
    
    response = requests.post(url, json=test_data, headers=headers)
    if response.status_code == 201:
        created_question = response.json()
        print(f"質問投稿成功!")
        print(f"  ID: {created_question['id']}")
        print(f"  タイトル: {created_question['title']}")
        print(f"  作成日: {created_question['created_at']}")
    else:
        print(f"エラー: {response.status_code} - {response.text}")

if __name__ == '__main__':
    test_questions_api()
