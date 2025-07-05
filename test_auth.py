#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
認証機能のテスト用スクリプト
"""
import requests
import json

def test_auth_functionality():
    """認証機能のテスト"""
    base_url = 'http://localhost:8000/api/accounts'
    
    print("=== 認証機能テスト ===")
    
    # 1. ユーザー登録テスト
    print("\n1. ユーザー登録テスト")
    register_data = {
        'username': 'testuser123',
        'email': 'testuser123@example.com',
        'password': 'testpassword123',
        'password_confirm': 'testpassword123',
        'first_name': 'テスト',
        'last_name': 'ユーザー'
    }
    
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    print(f"POSTリクエスト: {base_url}/register/")
    print(f"データ: {register_data}")
    
    register_response = requests.post(f'{base_url}/register/', json=register_data, headers=headers)
    print(f'Registration Status: {register_response.status_code}')
    print(f'Response Headers: {dict(register_response.headers)}')
    print(f'Response Content-Type: {register_response.headers.get("content-type")}')
    
    # レスポンスの内容を詳しく表示
    try:
        register_result = register_response.json()
        print(f'JSON Response: {register_result}')
        
        if register_response.status_code == 201:
            print(f'Registration Success: {register_result["message"]}')
            print(f'User: {register_result["user"]["username"]}')
            print(f'Token: {register_result["token"][:20]}...')
            token = register_result["token"]
        else:
            print(f'Registration Error: {register_result}')
            # 既存ユーザーでログインを試行
            print("\n2. 既存ユーザーでログインテスト")
            login_data = {
                'username': 'testuser123',
                'password': 'testpassword123'
            }
            
            login_response = requests.post(f'{base_url}/login/', json=login_data, headers=headers)
            print(f'Login Status: {login_response.status_code}')
            
            if login_response.status_code == 200:
                login_result = login_response.json()
                print(f'Login Success: {login_result["message"]}')
                print(f'User: {login_result["user"]["username"]}')
                print(f'Token: {login_result["token"][:20]}...')
                token = login_result["token"]
            else:
                print(f'Login Error: {login_response.text}')
                return
    except json.JSONDecodeError:
        print(f'JSONデコードエラー - レスポンス内容:')
        print(register_response.text[:500])  # 最初の500文字のみ表示
        return
    
    # 3. 現在のユーザー情報取得テスト
    print("\n3. 現在のユーザー情報取得テスト")
    auth_headers = {
        'Authorization': f'Token {token}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    me_response = requests.get(f'{base_url}/me/', headers=auth_headers)
    print(f'Current User Status: {me_response.status_code}')
    
    if me_response.status_code == 200:
        me_result = me_response.json()
        print(f'Current User: {me_result["user"]["username"]}')
        print(f'Email: {me_result["user"]["email"]}')
        print(f'Points: {me_result["user"]["points"]}')
    else:
        print(f'Current User Error: {me_response.text}')
    
    print("\n=== 認証機能テスト完了 ===")

if __name__ == '__main__':
    test_auth_functionality()
