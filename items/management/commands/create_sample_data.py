from django.core.management.base import BaseCommand
from items.models import Brand, Category, Item
import os
from django.conf import settings

class Command(BaseCommand):
    help = 'サンプル商品データを作成します'

    def handle(self, *args, **options):
        self.stdout.write('サンプルデータを作成中...')
        
        # 既存データをクリア
        Item.objects.all().delete()
        Brand.objects.all().delete()
        Category.objects.all().delete()
        
        # ブランド作成
        brands = [
            Brand.objects.create(
                name='ユニクロ',
                description='シンプルで高品質なファッションブランド',
                website_url='https://www.uniqlo.com'
            ),
            Brand.objects.create(
                name='ZARA',
                description='ヨーロッパ発のファストファッションブランド',
                website_url='https://www.zara.com'
            ),
            Brand.objects.create(
                name='無印良品',
                description='シンプルで機能的なライフスタイルブランド',
                website_url='https://www.muji.com'
            ),
        ]
        
        # カテゴリ作成
        categories = [
            Category.objects.create(
                name='メンズ_カジュアル',
                description='カジュアルなメンズファッション'
            ),
            Category.objects.create(
                name='レディース_カジュアル',
                description='カジュアルなレディースファッション'
            ),
            Category.objects.create(
                name='メンズ_フォーマル',
                description='フォーマルなメンズファッション'
            ),
            Category.objects.create(
                name='レディース_フォーマル',
                description='フォーマルなレディースファッション'
            ),
        ]
        
        # 商品作成
        items_data = [
            {
                'name': 'ベーシックTシャツ',
                'brand': brands[0],  # ユニクロ
                'category': categories[0],  # メンズ_カジュアル
                'price': 1500,
                'original_price': 2000,
                'description': '肌触りの良いコットン100%のベーシックTシャツ',
                'condition': 'new',
                'size': 'M',
                'color': '白',
                'material': 'コットン100%',
                'is_available': True,
                'is_featured': True,
            },
            {
                'name': 'デニムジャケット',
                'brand': brands[1],  # ZARA
                'category': categories[0],  # メンズ_カジュアル
                'price': 8000,
                'original_price': 12000,
                'description': 'ヴィンテージ感のあるデニムジャケット',
                'condition': 'like_new',
                'size': 'L',
                'color': 'インディゴブルー',
                'material': 'デニム',
                'is_available': True,
                'is_featured': False,
            },
            {
                'name': 'シンプルワンピース',
                'brand': brands[2],  # 無印良品
                'category': categories[1],  # レディース_カジュアル
                'price': 4500,
                'original_price': 6000,
                'description': 'シンプルで着回しの利くワンピース',
                'condition': 'good',
                'size': 'S',
                'color': 'ベージュ',
                'material': 'コットンリネン',
                'is_available': True,
                'is_featured': True,
            },
            {
                'name': 'ビジネススーツ',
                'brand': brands[0],  # ユニクロ
                'category': categories[2],  # メンズ_フォーマル
                'price': 25000,
                'original_price': 35000,
                'description': 'ストレッチ素材のビジネススーツ',
                'condition': 'like_new',
                'size': 'L',
                'color': 'ネイビー',
                'material': 'ポリエステル混',
                'is_available': True,
                'is_featured': False,
            },
            {
                'name': 'エレガントブラウス',
                'brand': brands[1],  # ZARA
                'category': categories[3],  # レディース_フォーマル
                'price': 6500,
                'original_price': 9000,
                'description': 'エレガントで上品なブラウス',
                'condition': 'new',
                'size': 'M',
                'color': '白',
                'material': 'シルク混',
                'is_available': True,
                'is_featured': True,
            },
        ]
        
        for item_data in items_data:
            Item.objects.create(**item_data)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'サンプルデータの作成が完了しました:\n'
                f'- ブランド: {len(brands)}件\n'
                f'- カテゴリ: {len(categories)}件\n'
                f'- 商品: {len(items_data)}件'
            )
        )
