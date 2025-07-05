from rest_framework import serializers
from django.contrib.auth import get_user_model
from decimal import Decimal
from .models import (
    PaymentMethod, Coupon, Order, OrderItem, 
    CouponUsage, ShoppingCart, Payment
)
from items.models import Item
from api.serializers import ItemListSerializer

User = get_user_model()

class PaymentMethodSerializer(serializers.ModelSerializer):
    """決済方法シリアライザー"""
    
    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'name', 'payment_type', 'is_active', 
            'processing_fee_rate', 'description', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class CouponSerializer(serializers.ModelSerializer):
    """クーポンシリアライザー"""
    is_valid = serializers.SerializerMethodField()
    usage_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Coupon
        fields = [
            'id', 'code', 'name', 'discount_type', 'discount_value',
            'minimum_order_amount', 'maximum_discount_amount', 'usage_limit',
            'usage_count', 'valid_from', 'valid_until', 'is_active',
            'is_valid', 'description', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'is_valid', 'usage_count']
    
    def get_is_valid(self, obj):
        """クーポンが有効かどうかを返す"""
        return obj.is_valid()
    
    def get_usage_count(self, obj):
        """クーポンの使用回数を返す"""
        return obj.couponusage_set.count()

class CouponValidationSerializer(serializers.Serializer):
    """クーポン有効性検証用シリアライザー"""
    code = serializers.CharField(max_length=50)
    order_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    def validate_code(self, value):
        """クーポンコードの存在確認"""
        try:
            coupon = Coupon.objects.get(code=value, is_active=True)
            if not coupon.is_valid():
                raise serializers.ValidationError("このクーポンは無効です。")
            return value
        except Coupon.DoesNotExist:
            raise serializers.ValidationError("無効なクーポンコードです。")

class OrderItemSerializer(serializers.ModelSerializer):
    """注文商品明細シリアライザー"""
    item_details = ItemListSerializer(source='item', read_only=True)
    total_amount = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'item', 'item_details', 'quantity', 'unit_price', 'total_amount'
        ]
        read_only_fields = ['id', 'total_amount']
    
    def get_total_amount(self, obj):
        """商品の合計金額を返す"""
        return obj.quantity * obj.unit_price

class OrderSerializer(serializers.ModelSerializer):
    """注文シリアライザー"""
    order_items = OrderItemSerializer(source='items', many=True, read_only=True)
    coupon_details = CouponSerializer(source='coupon', read_only=True)
    payment_method_details = PaymentMethodSerializer(source='payment_method', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'order_number', 'status', 'subtotal', 'coupon_discount',
            'total_amount', 'coupon', 'coupon_details', 'payment_method', 
            'payment_method_details', 'shipping_name', 'shipping_postal_code',
            'shipping_address', 'shipping_phone', 'notes', 'order_items', 
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'order_number', 'coupon_discount', 'total_amount', 
            'created_at', 'updated_at'
        ]

class OrderCreateSerializer(serializers.ModelSerializer):
    """注文作成用シリアライザー"""
    items = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField()
        ),
        write_only=True
    )
    coupon_code = serializers.CharField(max_length=50, required=False, allow_blank=True)
    
    class Meta:
        model = Order
        fields = [
            'payment_method', 'shipping_address', 'billing_address',
            'notes', 'items', 'coupon_code'
        ]
    
    def validate_items(self, value):
        """注文商品の検証"""
        if not value:
            raise serializers.ValidationError("商品が選択されていません。")
        
        validated_items = []
        for item_data in value:
            try:
                item_id = int(item_data.get('item_id'))
                quantity = int(item_data.get('quantity', 1))
                
                if quantity <= 0:
                    raise serializers.ValidationError("数量は1以上である必要があります。")
                
                item = Item.objects.get(id=item_id, is_available=True)
                
                if item.stock_quantity < quantity:
                    raise serializers.ValidationError(
                        f"商品「{item.name}」の在庫が不足しています。"
                    )
                
                validated_items.append({
                    'item': item,
                    'quantity': quantity,
                    'unit_price': item.price
                })
                
            except (ValueError, Item.DoesNotExist):
                raise serializers.ValidationError("無効な商品が含まれています。")
        
        return validated_items
    
    def validate_coupon_code(self, value):
        """クーポンコードの検証"""
        if value:
            try:
                coupon = Coupon.objects.get(code=value, is_active=True)
                if not coupon.is_valid():
                    raise serializers.ValidationError("このクーポンは無効です。")
                return coupon
            except Coupon.DoesNotExist:
                raise serializers.ValidationError("無効なクーポンコードです。")
        return None
    
    def create(self, validated_data):
        """注文を作成"""
        items_data = validated_data.pop('items')
        coupon = validated_data.pop('coupon_code', None)
        user = self.context['request'].user
        
        # 小計を計算
        subtotal = sum(
            item_data['quantity'] * item_data['unit_price'] 
            for item_data in items_data
        )
        
        # 注文を作成
        order = Order.objects.create(
            user=user,
            subtotal=subtotal,
            coupon=coupon,
            **validated_data
        )
        
        # 注文商品を作成
        for item_data in items_data:
            OrderItem.objects.create(
                order=order,
                item=item_data['item'],
                quantity=item_data['quantity'],
                unit_price=item_data['unit_price']
            )
            
            # 在庫を減らす
            item = item_data['item']
            item.stock_quantity -= item_data['quantity']
            item.save()
        
        # クーポン使用履歴を作成
        if coupon:
            CouponUsage.objects.create(
                coupon=coupon,
                user=user,
                order=order,
                discount_amount=order.coupon_discount
            )
        
        return order

class ShoppingCartSerializer(serializers.ModelSerializer):
    """ショッピングカートシリアライザー"""
    item_details = ItemListSerializer(source='item', read_only=True)
    total_amount = serializers.SerializerMethodField()
    
    class Meta:
        model = ShoppingCart
        fields = [
            'id', 'user', 'item', 'item_details', 'quantity', 
            'total_amount', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'total_amount', 'created_at', 'updated_at']
    
    def get_total_amount(self, obj):
        """カート商品の合計金額を返す"""
        return obj.quantity * obj.item.price

class ShoppingCartCreateSerializer(serializers.ModelSerializer):
    """ショッピングカート追加用シリアライザー"""
    
    class Meta:
        model = ShoppingCart
        fields = ['item', 'quantity']
    
    def validate_item(self, value):
        """商品の有効性を確認"""
        if not value.is_available:
            raise serializers.ValidationError("この商品は現在利用できません。")
        return value
    
    def validate_quantity(self, value):
        """数量の検証"""
        if value <= 0:
            raise serializers.ValidationError("数量は1以上である必要があります。")
        return value
    
    def create(self, validated_data):
        """カートに商品を追加（既存の場合は数量を更新）"""
        user = self.context['request'].user
        item = validated_data['item']
        quantity = validated_data['quantity']
        
        cart_item, created = ShoppingCart.objects.get_or_create(
            user=user,
            item=item,
            defaults={'quantity': quantity}
        )
        
        if not created:
            # 既存の場合は数量を追加
            cart_item.quantity += quantity
            cart_item.save()
        
        return cart_item

class PaymentSerializer(serializers.ModelSerializer):
    """決済履歴シリアライザー"""
    order_details = OrderSerializer(source='order', read_only=True)
    payment_method_details = PaymentMethodSerializer(source='payment_method', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'order_details', 'payment_method', 'payment_method_details',
            'amount', 'status', 'external_transaction_id', 'external_payment_id', 
            'processing_fee', 'payment_details', 'processed_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
