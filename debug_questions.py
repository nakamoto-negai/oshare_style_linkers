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

def debug_questions():
    print("=== デバッグ: 質問データの確認 ===")
    
    # 全ユーザーを表示
    print("\n--- 全ユーザー ---")
    users = User.objects.all()
    for user in users:
        print(f"ID: {user.id}, Username: {user.username}, Email: {user.email}")
    
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
        for q in user_questions:
            print(f"  - {q.title} ({q.created_at})")
    
    # 全回答を表示
    print("\n--- 全回答 ---")
    answers = Answer.objects.all().order_by('-created_at')
    print(f"総回答数: {answers.count()}")
    
    for answer in answers:
        print(f"ID: {answer.id}")
        print(f"  内容: {answer.content[:50]}..." if len(answer.content) > 50 else f"  内容: {answer.content}")
        print(f"  質問: {answer.question.title}")
        print(f"  ユーザー: {answer.user.username} (ID: {answer.user.id})")
        print(f"  作成日: {answer.created_at}")
        print(f"  ベストアンサー: {answer.is_best_answer}")
        print()
    
    # 各ユーザーの回答数を表示
    print("\n--- ユーザー別回答数 ---")
    for user in users:
        user_answers = Answer.objects.filter(user=user)
        print(f"{user.username}: {user_answers.count()}件")
        for a in user_answers:
            print(f"  - 質問「{a.question.title}」への回答 ({a.created_at})")
    
    print("\n=== デバッグ終了 ===")

if __name__ == "__main__":
    debug_questions()
