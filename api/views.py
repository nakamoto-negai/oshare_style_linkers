from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from items.models import Item, Brand, Category
from .serializers import ItemSerializer, ItemListSerializer, BrandSerializer, CategorySerializer
import logging

# ログ設定
logger = logging.getLogger(__name__)

@api_view(['GET'])
def api_test(request):
    """API接続テスト用のエンドポイント"""
    return JsonResponse({
        'message': 'Django API is working!',
        'status': 'success'
    })

class StyleListView(APIView):
    """スタイル一覧を返すAPI"""
    
    def get(self, request):
        # サンプルデータ（後でデータベースからの取得に変更）
        styles = [
            {
                'id': 1,
                'name': 'カジュアル',
                'description': 'リラックスした日常スタイル',
                'image_url': '/images/casual.jpg'
            },
            {
                'id': 2,
                'name': 'フォーマル',
                'description': 'ビジネスや特別な場面に',
                'image_url': '/images/formal.jpg'
            },
            {
                'id': 3,
                'name': 'ストリート',
                'description': '都市的でトレンディなスタイル',
                'image_url': '/images/street.jpg'
            }
        ]
        return Response({'styles': styles})

class ItemListView(generics.ListAPIView):
    """商品一覧API"""
    queryset = Item.objects.filter(is_available=True).select_related('brand', 'category')
    serializer_class = ItemListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['brand', 'category', 'condition', 'size', 'is_featured']
    search_fields = ['name', 'description', 'brand__name', 'color']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']

    def get(self, request, *args, **kwargs):
        logger.info(f"ItemListView GET request received from {request.META.get('REMOTE_ADDR')}")
        logger.info(f"Request headers: {dict(request.headers)}")
        logger.info(f"Request GET params: {dict(request.GET)}")
        
        response = super().get(request, *args, **kwargs)
        logger.info(f"ItemListView response status: {response.status_code}")
        logger.info(f"ItemListView response data count: {len(response.data) if hasattr(response, 'data') else 'N/A'}")
        
        return response

class ItemDetailView(generics.RetrieveAPIView):
    """商品詳細API"""
    queryset = Item.objects.filter(is_available=True).select_related('brand', 'category').prefetch_related('additional_images')
    serializer_class = ItemSerializer

class BrandListView(generics.ListAPIView):
    """ブランド一覧API"""
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

class CategoryListView(generics.ListAPIView):
    """カテゴリ一覧API"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class FeaturedItemsView(generics.ListAPIView):
    """おすすめ商品一覧API"""
    queryset = Item.objects.filter(is_available=True, is_featured=True).select_related('brand', 'category')
    serializer_class = ItemListSerializer
