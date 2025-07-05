#!/usr/bin/env python
import os
import sys
import django

# Django設定を読み込み
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
django.setup()

from django.contrib.auth import get_user_model
from answers.models import Question, Answer

User = get_user_model()

def main():
    print("=== データベース状況確認 ===")
    
    # 全ユーザーを表示
    print("\n--- 全ユーザー ---")
    users = User.objects.all()
    for user in users:
        print(f"ID: {user.id}, Username: {user.username}, Email: {user.email}, Authenticated: {user.is_authenticated}")
    
    # 全質問を表示
    print("\n--- 全質問 ---")
    questions = Question.objects.all().order_by('-created_at')
    print(f"総質問数: {questions.count()}")
    
    for question in questions:
        print(f"ID: {question.id}")
        print(f"  タイトル: {question.title}")
        print(f"  ユーザー: {question.user.username} (ID: {question.user.id})")
        print(f"  作成日: {question.created_at}")
        print(f"  ステータス: {question.status}")
        print()
    
    # 各ユーザーの質問数を表示
    print("\n--- ユーザー別質問数 ---")
    for user in users:
        user_questions = Question.objects.filter(user=user)
        print(f"{user.username}: {user_questions.count()}件")
    
    print("\n=== テスト質問作成 ===")
    # テスト用に質問を作成
    if users.exists():
        test_user = users.first()
        test_question = Question.objects.create(
            title='テスト質問（デバッグ用）',
            content='これは問題を確認するために作成されたテスト質問です。',
            category='other',
            user=test_user
        )
        print(f"テスト質問を作成しました: ID {test_question.id}, User: {test_question.user.username}")
    
    print("\n=== デバッグ終了 ===")

if __name__ == "__main__":
    main()
