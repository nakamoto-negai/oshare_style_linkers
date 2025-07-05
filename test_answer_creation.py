#!/usr/bin/env python
"""
回答作成テストスクリプト
"""
import os
import sys
import django

# Django設定を読み込み
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
django.setup()

from answers.models import Question, Answer
from django.contrib.auth import get_user_model

User = get_user_model()

def main():
    print("=== 回答作成テスト ===")
    
    # テスト用ユーザーと質問を取得
    user = User.objects.first()
    question = Question.objects.first()
    
    if not user or not question:
        print("ユーザーまたは質問が見つかりません")
        return
    
    print(f"ユーザー: {user.username}")
    print(f"質問: {question.title}")
    
    # 商品選択ありの回答を作成
    answer = Answer.objects.create(
        question=question,
        user=user,
        content="この商品がおすすめです！シンプルでどんなコーディネートにも合わせやすく、品質も良いです。",
        recommended_products=[1, 3]  # 商品ID 1と3を推奨
    )
    
    print(f"作成した回答ID: {answer.id}")
    print(f"推奨商品: {answer.recommended_products}")
    
    # 回答一覧を確認
    answers = Answer.objects.filter(question=question)
    print(f"\n質問 '{question.title}' の回答一覧:")
    for ans in answers:
        print(f"- 回答ID: {ans.id}, 内容: {ans.content[:50]}...")
        if ans.recommended_products:
            print(f"  推奨商品: {ans.recommended_products}")

if __name__ == '__main__':
    main()
