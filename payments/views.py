from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db import transaction
from decimal import Decimal

from .models import (
    PaymentMethod, Coupon, Order, OrderItem, 
    CouponUsage, ShoppingCart, Payment
)
from .serializers import (
    PaymentMethodSerializer, CouponSerializer, CouponValidationSerializer,
    OrderSerializer, OrderCreateSerializer, OrderItemSerializer,
    ShoppingCartSerializer, ShoppingCartCreateSerializer,
    PaymentSerializer
)

User = get_user_model()

class PaymentMethodListView(generics.ListAPIView):
    """決済方法一覧取得API"""
    queryset = PaymentMethod.objects.filter(is_active=True)
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.AllowAny]

class CouponListView(generics.ListAPIView):
    """クーポン一覧取得API（管理者用）"""
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def validate_coupon(request):
    """クーポン有効性検証API"""
    serializer = CouponValidationSerializer(data=request.data)
    if serializer.is_valid():
        code = serializer.validated_data['code']
        order_amount = serializer.validated_data['order_amount']
        
        try:
            coupon = Coupon.objects.get(code=code, is_active=True)
            
            if not coupon.is_valid():
                return Response(
                    {'error': 'このクーポンは無効です。'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 最小注文金額チェック
            if order_amount < coupon.minimum_order_amount:
                return Response(
                    {
                        'error': f'このクーポンは{coupon.minimum_order_amount}円以上のご注文で利用できます。'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 割引額を計算
            discount_amount = coupon.calculate_discount(order_amount)
            
            return Response({
                'valid': True,
                'coupon': CouponSerializer(coupon).data,
                'discount_amount': discount_amount,
                'final_amount': order_amount - discount_amount
            })
            
        except Coupon.DoesNotExist:
            return Response(
                {'error': '無効なクーポンコードです。'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderListCreateView(generics.ListCreateAPIView):
    """注文一覧・作成API"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return OrderCreateSerializer
        return OrderSerializer
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            
            # 作成された注文を詳細情報で返す
            response_serializer = OrderSerializer(order)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderDetailView(generics.RetrieveAPIView):
    """注文詳細取得API"""
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def cancel_order(request, order_id):
    """注文キャンセルAPI"""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    
    if order.status not in ['pending', 'confirmed']:
        return Response(
            {'error': 'この注文はキャンセルできません。'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    with transaction.atomic():
        # 在庫を戻す
        for order_item in order.order_items.all():
            item = order_item.item
            item.stock_quantity += order_item.quantity
            item.save()
        
        # 注文ステータスを更新
        order.status = 'cancelled'
        order.save()
    
    return Response({'message': '注文をキャンセルしました。'})

class ShoppingCartListView(generics.ListAPIView):
    """ショッピングカート一覧取得API"""
    serializer_class = ShoppingCartSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ShoppingCart.objects.filter(user=self.request.user).order_by('-created_at')

class ShoppingCartCreateView(generics.CreateAPIView):
    """ショッピングカート追加API"""
    serializer_class = ShoppingCartCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

class ShoppingCartUpdateView(generics.UpdateAPIView):
    """ショッピングカート更新API"""
    serializer_class = ShoppingCartSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ShoppingCart.objects.filter(user=self.request.user)

class ShoppingCartDeleteView(generics.DestroyAPIView):
    """ショッピングカート削除API"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ShoppingCart.objects.filter(user=self.request.user)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def clear_cart(request):
    """カート全削除API"""
    ShoppingCart.objects.filter(user=request.user).delete()
    return Response({'message': 'カートを空にしました。'})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def cart_summary(request):
    """カート概要取得API"""
    cart_items = ShoppingCart.objects.filter(user=request.user)
    
    total_items = sum(item.quantity for item in cart_items)
    total_amount = sum(item.quantity * item.item.price for item in cart_items)
    
    return Response({
        'total_items': total_items,
        'total_amount': total_amount,
        'items': ShoppingCartSerializer(cart_items, many=True).data
    })

class PaymentListView(generics.ListAPIView):
    """決済履歴一覧取得API"""
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(
            order__user=self.request.user
        ).order_by('-created_at')

class PaymentDetailView(generics.RetrieveAPIView):
    """決済履歴詳細取得API"""
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(order__user=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def process_payment(request, order_id):
    """決済処理API"""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    
    if order.status != 'pending':
        return Response(
            {'error': 'この注文は決済できません。'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    transaction_id = request.data.get('transaction_id')
    if not transaction_id:
        return Response(
            {'error': 'トランザクションIDが必要です。'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    with transaction.atomic():
        # 決済履歴を作成
        payment = Payment.objects.create(
            order=order,
            payment_method=order.payment_method,
            amount=order.total_amount,
            status='completed',
            external_transaction_id=transaction_id
        )
        
        # 注文ステータスを更新
        order.status = 'paid'
        order.save()
    
    return Response({
        'message': '決済が完了しました。',
        'payment': PaymentSerializer(payment).data
    })
