#!/usr/bin/env python
# -*- coding: utf-8 -*-
import requests

def test_answer_functionality():
    """回答機能のテスト"""
    print("=== 質問詳細取得（回答含む）テスト ===")
    url = 'http://localhost:8000/api/questions/21/'
    response = requests.get(url)
    print(f'Status: {response.status_code}')
    if response.status_code == 200:
        data = response.json()
        print(f'Question title: {data["title"]}')
        print(f'Answers count: {len(data.get("answers", []))}')
        for i, answer in enumerate(data.get('answers', [])):
            print(f'Answer {i+1}: {answer["content"]}')
            print(f'  User: {answer["user"]["username"]}')
            print(f'  Created: {answer["created_at"]}')
    else:
        print(f'Error: {response.text}')

    print("\n=== 回答投稿テスト ===")
    create_url = 'http://localhost:8000/api/answers/create/'
    answer_data = {
        'content': 'フロントエンドテスト用の回答です。この回答は10文字以上で投稿されています。',
        'question': 21
    }
    
    headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
    }
    
    response = requests.post(create_url, json=answer_data, headers=headers)
    print(f'Status: {response.status_code}')
    if response.status_code == 201:
        created_answer = response.json()
        print(f'Created answer ID: {created_answer["id"]}')
        print(f'Content: {created_answer["content"]}')
        print(f'Question ID: {created_answer["question"]}')
    else:
        print(f'Error: {response.text}')

if __name__ == '__main__':
    test_answer_functionality()
