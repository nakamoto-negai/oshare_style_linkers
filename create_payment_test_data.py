#!/usr/bin/env python
"""
決済システムのテストデータを作成するスクリプト
"""
import os
import django
from datetime import datetime, timedelta
from decimal import Decimal

# Django設定
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
django.setup()

from django.contrib.auth import get_user_model
from payments.models import PaymentMethod, Coupon
from items.models import Item

User = get_user_model()

def create_payment_methods():
    """決済方法を作成"""
    payment_methods = [
        {
            'name': 'クレジットカード',
            'payment_type': 'credit_card',
            'processing_fee_rate': Decimal('0.0300'),  # 3%
            'description': 'Visa、MasterCard、JCB対応'
        },
        {
            'name': '銀行振込',
            'payment_type': 'bank_transfer',
            'processing_fee_rate': Decimal('0.0000'),
            'description': '振込手数料はお客様負担'
        },
        {
            'name': '代金引換',
            'payment_type': 'cod',
            'processing_fee_rate': Decimal('0.0000'),
            'description': '代引き手数料330円'
        },
        {
            'name': 'コンビニ決済',
            'payment_type': 'convenience_store',
            'processing_fee_rate': Decimal('0.0200'),  # 2%
            'description': 'セブンイレブン、ファミマ、ローソン対応'
        },
        {
            'name': 'PayPal',
            'payment_type': 'paypal',
            'processing_fee_rate': Decimal('0.0350'),  # 3.5%
            'description': 'PayPalアカウントで安心決済'
        }
    ]
    
    for method_data in payment_methods:
        payment_method, created = PaymentMethod.objects.get_or_create(
            payment_type=method_data['payment_type'],
            defaults=method_data
        )
        if created:
            print(f"✓ 決済方法「{payment_method.name}」を作成しました")
        else:
            print(f"- 決済方法「{payment_method.name}」は既に存在します")

def create_coupons():
    """クーポンを作成"""
    now = datetime.now()
    
    coupons = [
        {
            'code': 'WELCOME10',
            'name': '新規会員10%割引',
            'discount_type': 'percentage',
            'discount_value': Decimal('10.00'),
            'minimum_order_amount': Decimal('3000'),
            'maximum_discount_amount': Decimal('1000'),
            'usage_limit': 100,
            'valid_from': now,
            'valid_until': now + timedelta(days=30),
            'description': '新規会員限定の10%割引クーポン'
        },
        {
            'code': 'SAVE500',
            'name': '500円割引',
            'discount_type': 'fixed_amount',
            'discount_value': Decimal('500'),
            'minimum_order_amount': Decimal('2000'),
            'maximum_discount_amount': Decimal('500'),
            'usage_limit': 50,
            'valid_from': now,
            'valid_until': now + timedelta(days=14),
            'description': '2000円以上のお買い物で500円割引'
        },
        {
            'code': 'SUMMER20',
            'name': 'サマーセール20%OFF',
            'discount_type': 'percentage',
            'discount_value': Decimal('20.00'),
            'minimum_order_amount': Decimal('5000'),
            'maximum_discount_amount': Decimal('3000'),
            'usage_limit': 200,
            'valid_from': now,
            'valid_until': now + timedelta(days=60),
            'description': '夏の特別セール20%割引'
        },
        {
            'code': 'FREESHIP',
            'name': '送料無料',
            'discount_type': 'fixed_amount',
            'discount_value': Decimal('800'),
            'minimum_order_amount': Decimal('1000'),
            'maximum_discount_amount': Decimal('800'),
            'usage_limit': 1000,
            'valid_from': now,
            'valid_until': now + timedelta(days=90),
            'description': '1000円以上で送料無料'
        },
        {
            'code': 'EXPIRED',
            'name': '期限切れクーポン',
            'discount_type': 'percentage',
            'discount_value': Decimal('15.00'),
            'minimum_order_amount': Decimal('1000'),
            'maximum_discount_amount': Decimal('1500'),
            'usage_limit': 10,
            'valid_from': now - timedelta(days=30),
            'valid_until': now - timedelta(days=1),  # 昨日まで
            'description': 'テスト用の期限切れクーポン'
        }
    ]
    
    for coupon_data in coupons:
        coupon, created = Coupon.objects.get_or_create(
            code=coupon_data['code'],
            defaults=coupon_data
        )
        if created:
            print(f"✓ クーポン「{coupon.code}」を作成しました")
        else:
            print(f"- クーポン「{coupon.code}」は既に存在します")

def add_stock_to_items():
    """商品に在庫数を追加"""
    items = Item.objects.all()
    
    for item in items:
        if not hasattr(item, 'stock_quantity') or item.stock_quantity == 0:
            # 価格に応じて在庫数を設定
            if item.price >= Decimal('10000'):
                stock = 5  # 高価格商品は少なめ
            elif item.price >= Decimal('5000'):
                stock = 15  # 中価格商品は中程度
            else:
                stock = 30  # 低価格商品は多め
            
            item.stock_quantity = stock
            item.save()
            print(f"✓ 商品「{item.name}」の在庫を{stock}個に設定しました")

def main():
    print("=== 決済システムのテストデータ作成 ===\n")
    
    try:
        print("1. 決済方法の作成...")
        create_payment_methods()
        print()
        
        print("2. クーポンの作成...")
        create_coupons()
        print()
        
        print("3. 商品在庫の設定...")
        add_stock_to_items()
        print()
        
        print("✅ テストデータの作成が完了しました！")
        print("\n作成されたデータ:")
        print(f"- 決済方法: {PaymentMethod.objects.count()}件")
        print(f"- クーポン: {Coupon.objects.count()}件")
        print(f"- 在庫設定済み商品: {Item.objects.filter(stock_quantity__gt=0).count()}件")
        
    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")

if __name__ == "__main__":
    main()
