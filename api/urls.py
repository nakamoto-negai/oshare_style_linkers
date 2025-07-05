from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.api_test, name='api_test'),
    path('styles/', views.StyleListView.as_view(), name='style_list'),
    
    # 商品関連API
    path('items/', views.ItemListView.as_view(), name='item_list'),
    path('items/<int:pk>/', views.ItemDetailView.as_view(), name='item_detail'),
    path('items/featured/', views.FeaturedItemsView.as_view(), name='featured_items'),
    
    # ブランド・カテゴリAPI
    path('brands/', views.BrandListView.as_view(), name='brand_list'),
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
]
