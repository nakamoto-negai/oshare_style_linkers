# Generated by Django 5.2 on 2025-07-05 09:38

import django.core.validators
import django.db.models.deletion
from decimal import Decimal
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("items", "0002_add_main_image_url"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Coupon",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "code",
                    models.CharField(
                        max_length=50, unique=True, verbose_name="クーポンコード"
                    ),
                ),
                ("name", models.CharField(max_length=100, verbose_name="クーポン名")),
                ("description", models.TextField(blank=True, verbose_name="説明")),
                (
                    "discount_type",
                    models.CharField(
                        choices=[("percentage", "割引率"), ("fixed_amount", "固定額")],
                        max_length=20,
                        verbose_name="割引タイプ",
                    ),
                ),
                (
                    "discount_value",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0"))
                        ],
                        verbose_name="割引値",
                    ),
                ),
                (
                    "minimum_order_amount",
                    models.DecimalField(
                        decimal_places=2,
                        default=Decimal("0"),
                        max_digits=10,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0"))
                        ],
                        verbose_name="最小注文金額",
                    ),
                ),
                (
                    "maximum_discount_amount",
                    models.DecimalField(
                        blank=True,
                        decimal_places=2,
                        max_digits=10,
                        null=True,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0"))
                        ],
                        verbose_name="最大割引額",
                    ),
                ),
                (
                    "usage_limit",
                    models.PositiveIntegerField(
                        blank=True, null=True, verbose_name="使用回数制限"
                    ),
                ),
                (
                    "usage_count",
                    models.PositiveIntegerField(default=0, verbose_name="使用回数"),
                ),
                (
                    "user_usage_limit",
                    models.PositiveIntegerField(default=1, verbose_name="ユーザー別使用制限"),
                ),
                ("valid_from", models.DateTimeField(verbose_name="有効開始日時")),
                ("valid_until", models.DateTimeField(verbose_name="有効終了日時")),
                ("is_active", models.BooleanField(default=True, verbose_name="有効")),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="作成日時"),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, verbose_name="更新日時"),
                ),
            ],
            options={"verbose_name": "クーポン", "verbose_name_plural": "クーポン",},
        ),
        migrations.CreateModel(
            name="PaymentMethod",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=50, verbose_name="決済方法名")),
                (
                    "payment_type",
                    models.CharField(
                        choices=[
                            ("credit_card", "クレジットカード"),
                            ("bank_transfer", "銀行振込"),
                            ("cod", "代金引換"),
                            ("convenience_store", "コンビニ決済"),
                            ("paypal", "PayPal"),
                            ("stripe", "Stripe"),
                        ],
                        max_length=20,
                        verbose_name="決済タイプ",
                    ),
                ),
                ("is_active", models.BooleanField(default=True, verbose_name="有効")),
                (
                    "processing_fee_rate",
                    models.DecimalField(
                        decimal_places=4,
                        default=Decimal("0.0000"),
                        max_digits=5,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0")),
                            django.core.validators.MaxValueValidator(Decimal("1")),
                        ],
                        verbose_name="手数料率",
                    ),
                ),
                ("description", models.TextField(blank=True, verbose_name="説明")),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="作成日時"),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, verbose_name="更新日時"),
                ),
            ],
            options={"verbose_name": "決済方法", "verbose_name_plural": "決済方法",},
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "order_number",
                    models.CharField(max_length=50, unique=True, verbose_name="注文番号"),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "保留中"),
                            ("confirmed", "確認済み"),
                            ("processing", "処理中"),
                            ("shipped", "発送済み"),
                            ("delivered", "配達完了"),
                            ("cancelled", "キャンセル"),
                            ("refunded", "返金済み"),
                        ],
                        default="pending",
                        max_length=20,
                        verbose_name="ステータス",
                    ),
                ),
                (
                    "subtotal",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0"))
                        ],
                        verbose_name="小計",
                    ),
                ),
                (
                    "tax_amount",
                    models.DecimalField(
                        decimal_places=2,
                        default=Decimal("0"),
                        max_digits=10,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0"))
                        ],
                        verbose_name="税額",
                    ),
                ),
                (
                    "shipping_fee",
                    models.DecimalField(
                        decimal_places=2,
                        default=Decimal("0"),
                        max_digits=10,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0"))
                        ],
                        verbose_name="送料",
                    ),
                ),
                (
                    "discount_amount",
                    models.DecimalField(
                        decimal_places=2,
                        default=Decimal("0"),
                        max_digits=10,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0"))
                        ],
                        verbose_name="割引額",
                    ),
                ),
                (
                    "total_amount",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0"))
                        ],
                        verbose_name="合計金額",
                    ),
                ),
                (
                    "shipping_name",
                    models.CharField(max_length=100, verbose_name="配送先氏名"),
                ),
                (
                    "shipping_postal_code",
                    models.CharField(max_length=10, verbose_name="郵便番号"),
                ),
                ("shipping_address", models.TextField(verbose_name="配送先住所")),
                (
                    "shipping_phone",
                    models.CharField(max_length=20, verbose_name="電話番号"),
                ),
                (
                    "payment_status",
                    models.CharField(
                        choices=[
                            ("pending", "未決済"),
                            ("completed", "決済完了"),
                            ("failed", "決済失敗"),
                            ("refunded", "返金済み"),
                        ],
                        default="pending",
                        max_length=20,
                        verbose_name="決済ステータス",
                    ),
                ),
                ("notes", models.TextField(blank=True, verbose_name="備考")),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="注文日時"),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, verbose_name="更新日時"),
                ),
                (
                    "coupon",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="payments.coupon",
                        verbose_name="使用クーポン",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="orders",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="ユーザー",
                    ),
                ),
                (
                    "payment_method",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="payments.paymentmethod",
                        verbose_name="決済方法",
                    ),
                ),
            ],
            options={
                "verbose_name": "注文",
                "verbose_name_plural": "注文",
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "quantity",
                    models.PositiveIntegerField(
                        validators=[django.core.validators.MinValueValidator(1)],
                        verbose_name="数量",
                    ),
                ),
                (
                    "unit_price",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0"))
                        ],
                        verbose_name="単価",
                    ),
                ),
                (
                    "total_price",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0"))
                        ],
                        verbose_name="小計",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="作成日時"),
                ),
                (
                    "item",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="items.item",
                        verbose_name="商品",
                    ),
                ),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="items",
                        to="payments.order",
                        verbose_name="注文",
                    ),
                ),
            ],
            options={"verbose_name": "注文商品", "verbose_name_plural": "注文商品",},
        ),
        migrations.CreateModel(
            name="Payment",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "amount",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0"))
                        ],
                        verbose_name="決済金額",
                    ),
                ),
                (
                    "processing_fee",
                    models.DecimalField(
                        decimal_places=2,
                        default=Decimal("0"),
                        max_digits=10,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0"))
                        ],
                        verbose_name="決済手数料",
                    ),
                ),
                (
                    "external_payment_id",
                    models.CharField(blank=True, max_length=200, verbose_name="外部決済ID"),
                ),
                (
                    "external_transaction_id",
                    models.CharField(
                        blank=True, max_length=200, verbose_name="外部トランザクションID"
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending", "処理中"),
                            ("completed", "完了"),
                            ("failed", "失敗"),
                            ("cancelled", "キャンセル"),
                            ("refunded", "返金"),
                        ],
                        default="pending",
                        max_length=20,
                        verbose_name="決済ステータス",
                    ),
                ),
                (
                    "payment_details",
                    models.JSONField(blank=True, default=dict, verbose_name="決済詳細"),
                ),
                (
                    "processed_at",
                    models.DateTimeField(blank=True, null=True, verbose_name="決済処理日時"),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="作成日時"),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, verbose_name="更新日時"),
                ),
                (
                    "order",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="payment",
                        to="payments.order",
                        verbose_name="注文",
                    ),
                ),
                (
                    "payment_method",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="payments.paymentmethod",
                        verbose_name="決済方法",
                    ),
                ),
            ],
            options={"verbose_name": "決済", "verbose_name_plural": "決済",},
        ),
        migrations.CreateModel(
            name="CouponUsage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "discount_amount",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        validators=[
                            django.core.validators.MinValueValidator(Decimal("0"))
                        ],
                        verbose_name="割引額",
                    ),
                ),
                (
                    "used_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="使用日時"),
                ),
                (
                    "coupon",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="usage_history",
                        to="payments.coupon",
                        verbose_name="クーポン",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="ユーザー",
                    ),
                ),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="payments.order",
                        verbose_name="注文",
                    ),
                ),
            ],
            options={
                "verbose_name": "クーポン使用履歴",
                "verbose_name_plural": "クーポン使用履歴",
                "unique_together": {("coupon", "order")},
            },
        ),
        migrations.CreateModel(
            name="ShoppingCart",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "quantity",
                    models.PositiveIntegerField(
                        validators=[django.core.validators.MinValueValidator(1)],
                        verbose_name="数量",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="追加日時"),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, verbose_name="更新日時"),
                ),
                (
                    "item",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="items.item",
                        verbose_name="商品",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="cart_items",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="ユーザー",
                    ),
                ),
            ],
            options={
                "verbose_name": "カートアイテム",
                "verbose_name_plural": "カートアイテム",
                "unique_together": {("user", "item")},
            },
        ),
    ]
