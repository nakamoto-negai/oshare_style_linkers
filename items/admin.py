from django.contrib import admin
from .models import Brand, Category, Item, ItemImage

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

class ItemImageInline(admin.TabularInline):
    model = ItemImage
    extra = 3

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'brand', 'category', 'price', 'condition', 'is_available', 'created_at']
    list_filter = ['brand', 'category', 'condition', 'is_available', 'created_at']
    search_fields = ['name', 'brand__name', 'description']
    readonly_fields = ['created_at', 'updated_at', 'discount_percentage']
    inlines = [ItemImageInline]
    
    fieldsets = (
        ('基本情報', {
            'fields': ('name', 'brand', 'category')
        }),
        ('価格情報', {
            'fields': ('price', 'original_price', 'discount_percentage')
        }),
        ('商品詳細', {
            'fields': ('description', 'condition', 'size', 'color', 'material')
        }),
        ('画像', {
            'fields': ('main_image',)
        }),
        ('ステータス', {
            'fields': ('is_available', 'is_featured')
        }),
        ('日時情報', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
