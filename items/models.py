from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal

class Brand(models.Model):
    """ブランドモデル"""
    name = models.CharField(max_length=100, verbose_name="ブランド名")
    description = models.TextField(blank=True, verbose_name="ブランド説明")
    website_url = models.URLField(blank=True, verbose_name="公式サイト")
    logo_image = models.ImageField(upload_to='brands/', blank=True, null=True, verbose_name="ロゴ画像")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="作成日時")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新日時")
    
    class Meta:
        verbose_name = "ブランド"
        verbose_name_plural = "ブランド"
        
    def __str__(self):
        return self.name

class Category(models.Model):
    """カテゴリモデル"""
    name = models.CharField(max_length=50, verbose_name="カテゴリ名")
    description = models.TextField(blank=True, verbose_name="説明")
    
    class Meta:
        verbose_name = "カテゴリ"
        verbose_name_plural = "カテゴリ"
        
    def __str__(self):
        return self.name

class Item(models.Model):
    """商品モデル"""
    CONDITION_CHOICES = [
        ('new', '新品'),
        ('like_new', 'ほぼ新品'),
        ('good', '良い'),
        ('fair', '普通'),
        ('poor', '悪い'),
    ]
    
    SIZE_CHOICES = [
        ('XS', 'XS'),
        ('S', 'S'),
        ('M', 'M'),
        ('L', 'L'),
        ('XL', 'XL'),
        ('XXL', 'XXL'),
        ('XXXL', 'XXXL'),
        ('FREE', 'フリーサイズ'),
    ]
    
    # 基本情報
    name = models.CharField(max_length=200, verbose_name="商品名")
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, verbose_name="ブランド")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="カテゴリ")
    
    # 価格情報
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=0, 
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="価格"
    )
    original_price = models.DecimalField(
        max_digits=10, 
        decimal_places=0, 
        blank=True, 
        null=True,
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="元値"
    )
    
    # 商品詳細
    description = models.TextField(verbose_name="商品説明")
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, verbose_name="状態")
    size = models.CharField(max_length=10, choices=SIZE_CHOICES, verbose_name="サイズ")
    color = models.CharField(max_length=50, verbose_name="色")
    material = models.CharField(max_length=100, blank=True, verbose_name="素材")
    
    # 画像
    main_image = models.ImageField(upload_to='items/', blank=True, null=True, verbose_name="メイン画像")
    main_image_url = models.URLField(blank=True, null=True, verbose_name="メイン画像URL")  # 外部画像URL用
    
    # ステータス
    is_available = models.BooleanField(default=True, verbose_name="販売中")
    is_featured = models.BooleanField(default=False, verbose_name="おすすめ商品")
    
    # 在庫管理
    stock_quantity = models.PositiveIntegerField(default=0, verbose_name="在庫数")
    
    # 日時
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="作成日時")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新日時")
    
    class Meta:
        verbose_name = "商品"
        verbose_name_plural = "商品"
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.brand.name} - {self.name}"
    
    @property
    def discount_percentage(self):
        """割引率を計算"""
        if self.original_price and self.original_price > self.price:
            return int((1 - (self.price / self.original_price)) * 100)
        return 0

class ItemImage(models.Model):
    """商品追加画像モデル"""
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='additional_images', verbose_name="商品")
    image = models.ImageField(upload_to='items/', verbose_name="画像")
    order = models.PositiveIntegerField(default=0, verbose_name="表示順")
    
    class Meta:
        verbose_name = "商品追加画像"
        verbose_name_plural = "商品追加画像"
        ordering = ['order']
        
    def __str__(self):
        return f"{self.item.name} - 画像{self.order}"
