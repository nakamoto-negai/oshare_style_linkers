from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
import uuid
from items.models import Item

User = get_user_model()

class PaymentMethod(models.Model):
    """決済方法モデル"""
    PAYMENT_TYPES = [
        ('credit_card', 'クレジットカード'),
        ('bank_transfer', '銀行振込'),
        ('cod', '代金引換'),
        ('convenience_store', 'コンビニ決済'),
        ('paypal', 'PayPal'),
        ('stripe', 'Stripe'),
    ]
    
    name = models.CharField(max_length=50, verbose_name="決済方法名")
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES, verbose_name="決済タイプ")
    is_active = models.BooleanField(default=True, verbose_name="有効")
    processing_fee_rate = models.DecimalField(
        max_digits=5, 
        decimal_places=4, 
        default=Decimal('0.0000'),
        validators=[MinValueValidator(Decimal('0')), MaxValueValidator(Decimal('1'))],
        verbose_name="手数料率"
    )
    description = models.TextField(blank=True, verbose_name="説明")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="作成日時")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新日時")
    
    class Meta:
        verbose_name = "決済方法"
        verbose_name_plural = "決済方法"
        
    def __str__(self):
        return self.name

class Coupon(models.Model):
    """クーポンモデル"""
    DISCOUNT_TYPES = [
        ('percentage', '割引率'),
        ('fixed_amount', '固定額'),
    ]
    
    code = models.CharField(max_length=50, unique=True, verbose_name="クーポンコード")
    name = models.CharField(max_length=100, verbose_name="クーポン名")
    description = models.TextField(blank=True, verbose_name="説明")
    
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES, verbose_name="割引タイプ")
    discount_value = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="割引値"
    )
    
    # 使用条件
    minimum_order_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=Decimal('0'),
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="最小注文金額"
    )
    maximum_discount_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="最大割引額"
    )
    
    # 使用制限
    usage_limit = models.PositiveIntegerField(null=True, blank=True, verbose_name="使用回数制限")
    usage_count = models.PositiveIntegerField(default=0, verbose_name="使用回数")
    user_usage_limit = models.PositiveIntegerField(default=1, verbose_name="ユーザー別使用制限")
    
    # 有効期間
    valid_from = models.DateTimeField(verbose_name="有効開始日時")
    valid_until = models.DateTimeField(verbose_name="有効終了日時")
    
    # ステータス
    is_active = models.BooleanField(default=True, verbose_name="有効")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="作成日時")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新日時")
    
    class Meta:
        verbose_name = "クーポン"
        verbose_name_plural = "クーポン"
        
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    def calculate_discount(self, order_amount):
        """割引額を計算"""
        if self.discount_type == 'percentage':
            discount = order_amount * (self.discount_value / 100)
        else:  # fixed_amount
            discount = self.discount_value
        
        # 最大割引額の制限
        if self.maximum_discount_amount:
            discount = min(discount, self.maximum_discount_amount)
        
        return min(discount, order_amount)
    
    def is_valid(self):
        """クーポンが有効かどうかをチェック"""
        from django.utils import timezone
        
        if not self.is_active:
            return False
        
        now = timezone.now()
        if now < self.valid_from or now > self.valid_until:
            return False
        
        # 使用回数制限チェック
        if self.usage_limit and self.usage_count >= self.usage_limit:
            return False
        
        return True
    
    def is_valid_for_order(self, order_amount, user=None):
        """注文に対してクーポンが有効かチェック"""
        from django.utils import timezone
        
        # 基本チェック
        if not self.is_active:
            return False, "クーポンが無効です"
        
        # 有効期間チェック
        now = timezone.now()
        if now < self.valid_from or now > self.valid_until:
            return False, "クーポンの有効期限が切れています"
        
        # 最小注文金額チェック
        if order_amount < self.minimum_order_amount:
            return False, f"最小注文金額¥{self.minimum_order_amount}以上で使用可能です"
        
        # 使用回数制限チェック
        if self.usage_limit and self.usage_count >= self.usage_limit:
            return False, "クーポンの使用回数が上限に達しています"
        
        # ユーザー別使用制限チェック
        if user:
            user_usage = CouponUsage.objects.filter(coupon=self, user=user).count()
            if user_usage >= self.user_usage_limit:
                return False, "このクーポンの使用回数が上限に達しています"
        
        return True, "有効"

class Order(models.Model):
    """注文モデル"""
    STATUS_CHOICES = [
        ('pending', '保留中'),
        ('confirmed', '確認済み'),
        ('processing', '処理中'),
        ('shipped', '発送済み'),
        ('delivered', '配達完了'),
        ('cancelled', 'キャンセル'),
        ('refunded', '返金済み'),
    ]
    
    # 基本情報
    order_number = models.CharField(max_length=50, unique=True, verbose_name="注文番号")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders', verbose_name="ユーザー")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="ステータス")
    
    # 金額情報
    subtotal = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="小計"
    )
    tax_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=Decimal('0'),
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="税額"
    )
    shipping_fee = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=Decimal('0'),
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="送料"
    )
    discount_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=Decimal('0'),
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="割引額"
    )
    total_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="合計金額"
    )
    
    # クーポン
    coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="使用クーポン")
    
    # 配送情報
    shipping_name = models.CharField(max_length=100, verbose_name="配送先氏名")
    shipping_postal_code = models.CharField(max_length=10, verbose_name="郵便番号")
    shipping_address = models.TextField(verbose_name="配送先住所")
    shipping_phone = models.CharField(max_length=20, verbose_name="電話番号")
    
    # 決済情報
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT, verbose_name="決済方法")
    payment_status = models.CharField(
        max_length=20, 
        choices=[
            ('pending', '未決済'),
            ('completed', '決済完了'),
            ('failed', '決済失敗'),
            ('refunded', '返金済み'),
        ], 
        default='pending', 
        verbose_name="決済ステータス"
    )
    
    # メモ
    notes = models.TextField(blank=True, verbose_name="備考")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="注文日時")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新日時")
    
    class Meta:
        verbose_name = "注文"
        verbose_name_plural = "注文"
        ordering = ['-created_at']
        
    def __str__(self):
        return f"注文 {self.order_number} - {self.user.username}"
    
    def save(self, *args, **kwargs):
        # 注文番号が未設定の場合は生成
        if not self.order_number:
            self.order_number = self.generate_order_number()
        
        # 合計金額を計算
        discount = self.coupon_discount
        self.discount_amount = discount
        self.total_amount = self.subtotal - discount + self.tax_amount + self.shipping_fee
        
        super().save(*args, **kwargs)
    
    def generate_order_number(self):
        """注文番号を生成"""
        import datetime
        now = datetime.datetime.now()
        return f"ORD-{now.strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    
    @property
    def coupon_discount(self):
        """クーポン割引額を計算"""
        if self.coupon:
            return self.coupon.calculate_discount(self.subtotal)
        return Decimal('0')

class OrderItem(models.Model):
    """注文商品モデル"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items', verbose_name="注文")
    item = models.ForeignKey(Item, on_delete=models.CASCADE, verbose_name="商品")
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)], verbose_name="数量")
    unit_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="単価"
    )
    total_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="小計"
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="作成日時")
    
    class Meta:
        verbose_name = "注文商品"
        verbose_name_plural = "注文商品"
        
    def __str__(self):
        return f"{self.item.name} x {self.quantity}"
    
    def save(self, *args, **kwargs):
        self.total_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)

class CouponUsage(models.Model):
    """クーポン使用履歴モデル"""
    coupon = models.ForeignKey(Coupon, on_delete=models.CASCADE, related_name='usage_history', verbose_name="クーポン")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="ユーザー")
    order = models.ForeignKey(Order, on_delete=models.CASCADE, verbose_name="注文")
    discount_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="割引額"
    )
    used_at = models.DateTimeField(auto_now_add=True, verbose_name="使用日時")
    
    class Meta:
        verbose_name = "クーポン使用履歴"
        verbose_name_plural = "クーポン使用履歴"
        unique_together = ['coupon', 'order']
        
    def __str__(self):
        return f"{self.coupon.code} - {self.user.username} - ¥{self.discount_amount}"

class ShoppingCart(models.Model):
    """ショッピングカートモデル"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items', verbose_name="ユーザー")
    item = models.ForeignKey(Item, on_delete=models.CASCADE, verbose_name="商品")
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)], verbose_name="数量")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="追加日時")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新日時")
    
    class Meta:
        verbose_name = "カートアイテム"
        verbose_name_plural = "カートアイテム"
        unique_together = ['user', 'item']
        
    def __str__(self):
        return f"{self.user.username} - {self.item.name} x {self.quantity}"
    
    @property
    def total_price(self):
        """小計を計算"""
        return self.item.price * self.quantity

class Payment(models.Model):
    """決済履歴モデル"""
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment', verbose_name="注文")
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT, verbose_name="決済方法")
    
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="決済金額"
    )
    processing_fee = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=Decimal('0'),
        validators=[MinValueValidator(Decimal('0'))],
        verbose_name="決済手数料"
    )
    
    # 外部決済サービスの情報
    external_payment_id = models.CharField(max_length=200, blank=True, verbose_name="外部決済ID")
    external_transaction_id = models.CharField(max_length=200, blank=True, verbose_name="外部トランザクションID")
    
    status = models.CharField(
        max_length=20, 
        choices=[
            ('pending', '処理中'),
            ('completed', '完了'),
            ('failed', '失敗'),
            ('cancelled', 'キャンセル'),
            ('refunded', '返金'),
        ], 
        default='pending', 
        verbose_name="決済ステータス"
    )
    
    # 決済詳細情報（JSON形式）
    payment_details = models.JSONField(default=dict, blank=True, verbose_name="決済詳細")
    
    processed_at = models.DateTimeField(null=True, blank=True, verbose_name="決済処理日時")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="作成日時")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新日時")
    
    class Meta:
        verbose_name = "決済"
        verbose_name_plural = "決済"
        
    def __str__(self):
        return f"決済 {self.order.order_number} - ¥{self.amount}"
