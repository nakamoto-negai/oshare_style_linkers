#!/usr/bin/env python
"""
商品に外部画像URLを設定するスクリプト
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
    print("=== 商品外部画像URLの設定 ===")
    
    # 各商品に外部画像URLを設定
    items = Item.objects.all()
    
    for item in items:
        # placeholderサービスの画像URLをmain_image_urlに設定
        item.main_image_url = f'https://picsum.photos/400/400?random={item.id}'
        item.save()
        print(f"商品 '{item.name}' の外部画像URL設定: {item.main_image_url}")
    
    print(f"\n{items.count()}件の商品に外部画像URLを設定しました。")

if __name__ == '__main__':
    main()
