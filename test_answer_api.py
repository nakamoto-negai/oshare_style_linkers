#!/usr/bin/env python
"""
回答APIレスポンステスト
"""
import os
import sys
import django
import json

# Django設定を読み込み
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
django.setup()

from answers.models import Question, Answer
from answers.serializers import AnswerSerializer
from django.test import RequestFactory

def main():
    print("=== 回答APIレスポンステスト ===")
    
    # 推奨商品が設定された回答を取得
    answer = Answer.objects.filter(recommended_products__isnull=False).first()
    
    if not answer:
        print("推奨商品付きの回答が見つかりません")
        return
    
    print(f"テスト回答ID: {answer.id}")
    print(f"推奨商品ID: {answer.recommended_products}")
    
    # RequestFactoryを使ってダミーリクエストを作成
    factory = RequestFactory()
    request = factory.get('/api/answers/')
    
    # シリアライザーでレスポンスを生成
    serializer = AnswerSerializer(answer, context={'request': request})
    response_data = serializer.data
    
    print("\n=== シリアライザーレスポンス ===")
    print(json.dumps(response_data, indent=2, ensure_ascii=False))
    
    # 推奨商品詳細の確認
    if 'recommended_products_details' in response_data:
        print(f"\n推奨商品詳細件数: {len(response_data['recommended_products_details'])}")
        for product in response_data['recommended_products_details']:
            print(f"- {product['name']} (¥{product['price']}) - {product['brand_name']}")

if __name__ == '__main__':
    main()
