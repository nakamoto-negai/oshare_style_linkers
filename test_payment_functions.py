#!/usr/bin/env python
"""
Django環境でのpayments機能テストスクリプト
"""
import os
import django
from decimal import Decimal

# Django設定
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
django.setup()

from django.contrib.auth import get_user_model
from payments.models import PaymentMethod, Coupon, Order, ShoppingCart
from items.models import Item

User = get_user_model()

def test_payment_methods():
    """決済方法のテスト"""
    print("=== 決済方法テスト ===")
    methods = PaymentMethod.objects.filter(is_active=True)
    print(f"有効な決済方法: {methods.count()}件")
    
    for method in methods:
        print(f"  - {method.name} ({method.payment_type}) 手数料: {method.processing_fee_rate * 100}%")
    print()

def test_coupons():
    """クーポンのテスト"""
    print("=== クーポンテスト ===")
    coupons = Coupon.objects.all()
    print(f"クーポン総数: {coupons.count()}件")
    
    # 有効なクーポンをテスト
    valid_coupons = [c for c in coupons if c.is_valid()]
    print(f"有効なクーポン: {len(valid_coupons)}件")
    
    for coupon in valid_coupons:
        print(f"  - {coupon.code}: {coupon.name}")
        print(f"    割引: {coupon.discount_value}{('円' if coupon.discount_type == 'fixed_amount' else '%')}")
        
        # 割引計算テスト
        test_amount = Decimal('5000')
        if test_amount >= coupon.minimum_order_amount:
            discount = coupon.calculate_discount(test_amount)
            print(f"    5000円の注文での割引額: {discount}円")
        print()

def test_items_stock():
    """商品在庫のテスト"""
    print("=== 商品在庫テスト ===")
    items = Item.objects.filter(is_available=True)
    print(f"販売中の商品: {items.count()}件")
    
    total_stock = sum(item.stock_quantity for item in items)
    print(f"総在庫数: {total_stock}個")
    
    print("\n商品別在庫:")
    for item in items[:5]:  # 上位5件を表示
        print(f"  - {item.name}: {item.stock_quantity}個 (価格: {item.price}円)")
    print()

def test_user_creation():
    """テストユーザーの作成/確認"""
    print("=== テストユーザー ===")
    
    test_username = "testuser"
    test_email = "test@example.com"
    
    user, created = User.objects.get_or_create(
        username=test_username,
        defaults={
            'email': test_email,
            'first_name': 'テスト',
            'last_name': 'ユーザー'
        }
    )
    
    if created:
        user.set_password("testpass123")
        user.save()
        print(f"✓ テストユーザー「{user.username}」を作成しました")
    else:
        print(f"✓ テストユーザー「{user.username}」は既に存在します")
    
    return user

def test_shopping_cart(user):
    """ショッピングカートのテスト"""
    print("=== ショッピングカートテスト ===")
    
    # 既存のカートをクリア
    ShoppingCart.objects.filter(user=user).delete()
    
    # 商品をカートに追加
    items = Item.objects.filter(is_available=True, stock_quantity__gt=0)[:3]
    
    cart_total = Decimal('0')
    for item in items:
        quantity = 2
        cart_item = ShoppingCart.objects.create(
            user=user,
            item=item,
            quantity=quantity
        )
        item_total = item.price * quantity
        cart_total += item_total
        print(f"✓ カートに追加: {item.name} x{quantity} = {item_total}円")
    
    print(f"カート合計: {cart_total}円")
    print()
    
    return cart_total

def test_order_creation(user, cart_total):
    """注文作成のテスト"""
    print("=== 注文作成テスト ===")
    
    # 決済方法を取得
    payment_method = PaymentMethod.objects.filter(is_active=True).first()
    if not payment_method:
        print("❌ 利用可能な決済方法がありません")
        return
    
    # クーポンを取得
    coupon = Coupon.objects.filter(
        is_active=True,
        minimum_order_amount__lte=cart_total
    ).first()
    
    # 注文を作成
    order = Order.objects.create(
        user=user,
        subtotal=cart_total,
        payment_method=payment_method,
        coupon=coupon,
        shipping_name="テスト 太郎",
        shipping_postal_code="123-4567",
        shipping_address="東京都渋谷区1-1-1",
        shipping_phone="03-1234-5678"
    )
    
    print(f"✓ 注文を作成しました: {order.order_number}")
    print(f"  小計: {order.subtotal}円")
    print(f"  クーポン割引: {order.coupon_discount}円" if hasattr(order, 'coupon_discount') else "  クーポン割引: 計算中...")
    print(f"  合計: {order.total_amount}円")
    print(f"  決済方法: {order.payment_method.name}")
    
    if order.coupon:
        print(f"  適用クーポン: {order.coupon.code}")
    
    print()
    return order

def main():
    print("🧪 Django決済システム機能テスト")
    print("=" * 50)
    print()
    
    try:
        # 基本データのテスト
        test_payment_methods()
        test_coupons()
        test_items_stock()
        
        # ユーザー操作のテスト
        user = test_user_creation()
        cart_total = test_shopping_cart(user)
        order = test_order_creation(user, cart_total)
        
        print("=" * 50)
        print("✅ 全てのテストが完了しました！")
        print()
        print("📊 テスト結果サマリー:")
        print(f"  - 決済方法: {PaymentMethod.objects.filter(is_active=True).count()}件")
        print(f"  - 有効クーポン: {len([c for c in Coupon.objects.all() if c.is_valid()])}件")
        print(f"  - 商品在庫: {sum(item.stock_quantity for item in Item.objects.filter(is_available=True))}個")
        print(f"  - 作成した注文: {order.order_number if 'order' in locals() else 'なし'}")
        
    except Exception as e:
        print(f"❌ テスト中にエラーが発生しました: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
