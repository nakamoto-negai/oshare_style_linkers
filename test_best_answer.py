#!/usr/bin/env python
# -*- coding: utf-8 -*-
import requests
import json

def test_best_answer_functionality():
    """ベストアンサー機能のテスト"""
    
    print("=== ベストアンサー機能テスト ===")
    
    # 1. 質問詳細を取得して回答を確認
    question_id = 21
    question_url = f'http://localhost:8000/api/questions/{question_id}/'
    
    print(f"1. 質問詳細取得: {question_url}")
    response = requests.get(question_url)
    print(f'Status: {response.status_code}')
    
    if response.status_code != 200:
        print(f'Error: {response.text}')
        return
    
    question_data = response.json()
    print(f'Question title: {question_data["title"]}')
    print(f'Question user: {question_data["user"]["username"]}')
    print(f'Question status: {question_data["status"]}')
    print(f'Answers count: {len(question_data.get("answers", []))}')
    
    # 回答一覧を表示
    answers = question_data.get('answers', [])
    if not answers:
        print("回答がありません。先に回答を作成してください。")
        return
    
    print("\n=== 回答一覧 ===")
    for i, answer in enumerate(answers):
        print(f'Answer {i+1} (ID: {answer["id"]}):')
        print(f'  Content: {answer["content"][:50]}...')
        print(f'  User: {answer["user"]["username"]}')
        print(f'  Is Best Answer: {answer["is_best_answer"]}')
        print(f'  Created: {answer["created_at"]}')
    
    # 2. ベストアンサー設定テスト
    if answers:
        answer_id = answers[0]["id"]
        best_answer_url = f'http://localhost:8000/api/accounts/answers/{answer_id}/best/'
        
        print(f"\n2. ベストアンサー設定テスト: {best_answer_url}")
        
        headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json'
        }
        
        response = requests.post(best_answer_url, json={}, headers=headers)
        print(f'Status: {response.status_code}')
        
        if response.status_code == 200:
            result = response.json()
            print(f'Success: {result.get("success")}')
            print(f'Message: {result.get("message")}')
            
            # 3. 結果確認
            print("\n3. 結果確認")
            response = requests.get(question_url)
            if response.status_code == 200:
                updated_data = response.json()
                for answer in updated_data.get('answers', []):
                    if answer['id'] == answer_id:
                        print(f'Answer {answer_id} is_best_answer: {answer["is_best_answer"]}')
                        break
        else:
            print(f'Error: {response.text}')
            print(f'Response headers: {dict(response.headers)}')
    
    print("\n=== テスト完了 ===")

if __name__ == '__main__':
    test_best_answer_functionality()
