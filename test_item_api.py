#!/usr/bin/env python
"""
商品API接続テストスクリプト
"""
import os
import sys
import django

# Django設定を読み込み
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
django.setup()

from items.models import Item, Brand, Category

def main():
    print("=== 商品データテスト ===")
    
    # 商品数の確認
    item_count = Item.objects.count()
    brand_count = Brand.objects.count()
    category_count = Category.objects.count()
    
    print(f"商品数: {item_count}")
    print(f"ブランド数: {brand_count}")
    print(f"カテゴリ数: {category_count}")
    
    # 利用可能な商品の一覧
    available_items = Item.objects.filter(is_available=True)[:10]
    print(f"\n利用可能な商品 (最初の10件):")
    for item in available_items:
        print(f"- ID: {item.id}, 名前: {item.name}, ブランド: {item.brand.name if item.brand else 'なし'}")
        print(f"  価格: ¥{item.price}, 画像: {item.main_image}")
    
    # 検索テスト
    search_results = Item.objects.filter(
        is_available=True,
        name__icontains='シャツ'
    )[:5]
    print(f"\n'シャツ'で検索 ({search_results.count()}件):")
    for item in search_results:
        print(f"- {item.name} (¥{item.price})")

if __name__ == '__main__':
    main()
