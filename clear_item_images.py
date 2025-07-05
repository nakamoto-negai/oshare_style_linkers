#!/usr/bin/env python
"""
商品画像URLをクリアするスクリプト
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
    print("=== 商品画像URLのクリア ===")
    
    # 全商品の画像をクリア
    items = Item.objects.all()
    
    for item in items:
        if item.main_image:
            print(f"商品 '{item.name}' の画像をクリア: {item.main_image}")
            item.main_image = None
            item.save()
    
    print(f"\n{items.count()}件の商品画像をクリアしました。")

if __name__ == '__main__':
    main()
