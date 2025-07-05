from django.urls import path
from . import views

app_name = 'payments'

urlpatterns = [
    # 決済方法
    path('payment-methods/', views.PaymentMethodListView.as_view(), name='payment-methods'),
    
    # クーポン
    path('coupons/', views.CouponListView.as_view(), name='coupons'),
    path('coupons/validate/', views.validate_coupon, name='validate-coupon'),
    
    # 注文
    path('orders/', views.OrderListCreateView.as_view(), name='orders'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('orders/<int:order_id>/cancel/', views.cancel_order, name='cancel-order'),
    
    # ショッピングカート
    path('cart/', views.ShoppingCartListView.as_view(), name='cart'),
    path('cart/add/', views.ShoppingCartCreateView.as_view(), name='cart-add'),
    path('cart/<int:pk>/update/', views.ShoppingCartUpdateView.as_view(), name='cart-update'),
    path('cart/<int:pk>/delete/', views.ShoppingCartDeleteView.as_view(), name='cart-delete'),
    path('cart/clear/', views.clear_cart, name='cart-clear'),
    path('cart/summary/', views.cart_summary, name='cart-summary'),
    
    # 決済
    path('payments/', views.PaymentListView.as_view(), name='payments'),
    path('payments/<int:pk>/', views.PaymentDetailView.as_view(), name='payment-detail'),
    path('orders/<int:order_id>/pay/', views.process_payment, name='process-payment'),
]
