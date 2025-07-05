#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
ベストアンサー機能のテスト用サンプルデータ作成
"""
import os
import sys
import django

# Django settings を設定
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
django.setup()

from django.contrib.auth import get_user_model
from answers.models import Question, Answer

User = get_user_model()

def create_test_data():
    """テスト用のデータを作成"""
    print("=== ベストアンサー機能テスト用データ作成 ===")
    
    # テストユーザー作成
    questioner, created = User.objects.get_or_create(
        username='questioner',
        defaults={
            'email': 'questioner@example.com',
            'first_name': '質問者',
            'points': 100
        }
    )
    if created:
        print(f"質問者ユーザー作成: {questioner.username}")
    
    answerer1, created = User.objects.get_or_create(
        username='answerer1',
        defaults={
            'email': 'answerer1@example.com', 
            'first_name': '回答者1',
            'points': 50
        }
    )
    if created:
        print(f"回答者1ユーザー作成: {answerer1.username}")
    
    answerer2, created = User.objects.get_or_create(
        username='answerer2',
        defaults={
            'email': 'answerer2@example.com',
            'first_name': '回答者2', 
            'points': 30
        }
    )
    if created:
        print(f"回答者2ユーザー作成: {answerer2.username}")
    
    # テスト質問作成
    question, created = Question.objects.get_or_create(
        title='ベストアンサー機能テスト用質問',
        defaults={
            'user': questioner,
            'content': '''この質問はベストアンサー機能をテストするためのものです。
            
複数の回答から一つをベストアンサーとして選択できるかテストします。
            
どの回答が一番役に立ちそうでしょうか？''',
            'category': 'styling',
            'status': 'open',
            'reward_points': 20
        }
    )
    if created:
        print(f"テスト質問作成: {question.title}")
    
    # テスト回答作成
    answer1, created = Answer.objects.get_or_create(
        question=question,
        user=answerer1,
        defaults={
            'content': '''とても参考になる回答です！

**おすすめのスタイリング方法：**
1. 基本的なコーディネート術
2. 色合わせのコツ
3. 季節感の取り入れ方

この方法で解決できると思います。'''
        }
    )
    if created:
        print(f"テスト回答1作成: {answer1.content[:30]}...")
    
    answer2, created = Answer.objects.get_or_create(
        question=question,
        user=answerer2,
        defaults={
            'content': '''私の経験からお答えします。

**実際に試してみた結果：**
- 方法A: 効果的でした
- 方法B: まあまあでした
- 方法C: おすすめしません

詳しく説明しますと...'''
        }
    )
    if created:
        print(f"テスト回答2作成: {answer2.content[:30]}...")
    
    print(f"\n=== 作成完了 ===")
    print(f"質問ID: {question.id}")
    print(f"回答1 ID: {answer1.id}")
    print(f"回答2 ID: {answer2.id}")
    print(f"質問URL: http://localhost:8000/api/questions/{question.id}/")
    print(f"ベストアンサー設定URL1: http://localhost:8000/api/accounts/answers/{answer1.id}/best/")
    print(f"ベストアンサー設定URL2: http://localhost:8000/api/accounts/answers/{answer2.id}/best/")
    print(f"フロントエンド質問詳細: http://localhost:3000/qa/{question.id}")

if __name__ == '__main__':
    create_test_data()
