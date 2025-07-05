from django.contrib import admin
from .models import (
    PaymentMethod, Coupon, Order, OrderItem, 
    CouponUsage, ShoppingCart, Payment
)

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ['name', 'payment_type', 'is_active', 'processing_fee_rate', 'created_at']
    list_filter = ['payment_type', 'is_active', 'created_at']
    search_fields = ['name', 'payment_type']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = [
        'code', 'name', 'discount_type', 'discount_value', 
        'minimum_order_amount', 'usage_limit', 'is_active', 
        'valid_from', 'valid_until'
    ]
    list_filter = ['discount_type', 'is_active', 'valid_from', 'valid_until']
    search_fields = ['code', 'name']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # 使用回数の注釈を追加
        return qs.prefetch_related('couponusage_set')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['unit_price']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number', 'user', 'status', 'subtotal', 
        'coupon_discount', 'total_amount', 'created_at'
    ]
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['order_number', 'user__username', 'user__email']
    readonly_fields = [
        'order_number', 'subtotal', 'coupon_discount', 
        'total_amount', 'created_at', 'updated_at'
    ]
    inlines = [OrderItemInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'user', 'payment_method', 'coupon'
        )

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'item', 'quantity', 'unit_price', 'get_total_amount']
    list_filter = ['order__status', 'order__created_at']
    search_fields = ['order__order_number', 'item__name']
    readonly_fields = ['unit_price']
    
    def get_total_amount(self, obj):
        return obj.quantity * obj.unit_price
    get_total_amount.short_description = '合計金額'

@admin.register(CouponUsage)
class CouponUsageAdmin(admin.ModelAdmin):
    list_display = ['coupon', 'user', 'order', 'discount_amount', 'used_at']
    list_filter = ['used_at', 'coupon__discount_type']
    search_fields = ['coupon__code', 'user__username', 'order__order_number']
    readonly_fields = ['used_at']

@admin.register(ShoppingCart)
class ShoppingCartAdmin(admin.ModelAdmin):
    list_display = ['user', 'item', 'quantity', 'get_total_amount', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'item__name']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_total_amount(self, obj):
        return obj.quantity * obj.item.price
    get_total_amount.short_description = '合計金額'

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'order', 'payment_method', 'amount', 'status', 
        'external_transaction_id', 'processed_at'
    ]
    list_filter = ['status', 'payment_method', 'processed_at']
    search_fields = ['order__order_number', 'external_transaction_id', 'external_payment_id']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'order', 'payment_method'
        )
