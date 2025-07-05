#!/usr/bin/env python
"""
商品データに画像を追加するスクリプト
"""
import os
import sys
import django

# Django設定を読み込み
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
django.setup()

from items.models import Item

def main():
    print("=== 商品画像の更新 ===")
    
    # 各商品にダミー画像URLを設定
    items = Item.objects.all()
    
    for item in items:
        # placeholderサービスの画像URLを設定
        item.main_image = f'https://picsum.photos/400/400?random={item.id}'
        item.save()
        print(f"商品 '{item.name}' の画像を更新: {item.main_image}")
    
    print(f"\n{items.count()}件の商品画像を更新しました。")

if __name__ == '__main__':
    main()
