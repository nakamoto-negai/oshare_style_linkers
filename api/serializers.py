from rest_framework import serializers
from items.models import Brand, Category, Item, ItemImage

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'description', 'website_url', 'logo_image']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class ItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImage
        fields = ['id', 'image', 'order']

class ItemSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    additional_images = ItemImageSerializer(many=True, read_only=True)
    discount_percentage = serializers.ReadOnlyField()
    image_url = serializers.SerializerMethodField()  # 画像URL統一処理
    
    class Meta:
        model = Item
        fields = [
            'id', 'name', 'brand', 'category', 'price', 'original_price',
            'description', 'condition', 'size', 'color', 'material',
            'image_url', 'additional_images', 'is_available', 'is_featured',
            'discount_percentage', 'created_at', 'updated_at'
        ]
    
    def get_image_url(self, obj):
        """画像URLを取得（main_image_urlを優先、なければmain_image）"""
        if obj.main_image_url:
            return obj.main_image_url
        elif obj.main_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.main_image.url)
        return None

class ItemListSerializer(serializers.ModelSerializer):
    """商品一覧用の軽量シリアライザー"""
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    discount_percentage = serializers.ReadOnlyField()
    image_url = serializers.SerializerMethodField()  # 画像URL統一処理
    
    class Meta:
        model = Item
        fields = [
            'id', 'name', 'brand_name', 'category_name', 'price', 'original_price',
            'condition', 'size', 'color', 'image_url', 'is_available', 
            'is_featured', 'discount_percentage'
        ]
    
    def get_image_url(self, obj):
        """画像URLを取得（main_image_urlを優先、なければmain_image）"""
        if obj.main_image_url:
            return obj.main_image_url
        elif obj.main_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.main_image.url)
        return None
