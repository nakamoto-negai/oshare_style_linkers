#!/usr/bin/env python
"""
商品APIテストスクリプト
"""
import os
import sys
import django
import json

# Django設定を読み込み
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
django.setup()

from items.models import Item
from api.serializers import ItemListSerializer
from django.test import RequestFactory

def main():
    print("=== 商品APIテスト ===")
    
    # 商品を取得
    items = Item.objects.filter(is_available=True)[:3]
    
    if not items:
        print("利用可能な商品が見つかりません")
        return
    
    # RequestFactoryを使ってダミーリクエストを作成
    factory = RequestFactory()
    request = factory.get('/api/items/')
    
    # シリアライザーでレスポンスを生成
    serializer = ItemListSerializer(items, many=True, context={'request': request})
    response_data = serializer.data
    
    print("\n=== 商品APIレスポンス ===")
    print(json.dumps(response_data, indent=2, ensure_ascii=False))
    
    # 画像URLの確認
    for item_data in response_data:
        print(f"\n商品: {item_data['name']}")
        print(f"  画像URL: {item_data.get('image_url', 'なし')}")

if __name__ == '__main__':
    main()
