from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser, PointHistory, UserRecommendation, UserPreference
)

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """カスタムユーザー管理"""
    list_display = ('username', 'email', 'points', 'is_premium', 'questions_count', 'answers_count', 'date_joined')
    list_filter = ('is_premium', 'is_staff', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    fieldsets = UserAdmin.fieldsets + (
        ('プロフィール情報', {
            'fields': ('bio', 'birth_date', 'profile_image')
        }),
        ('ポイント・統計', {
            'fields': ('points', 'total_earned_points', 'questions_count', 'answers_count', 'helpful_answers_count')
        }),
        ('設定', {
            'fields': ('is_premium', 'notification_enabled')
        }),
    )


@admin.register(PointHistory)
class PointHistoryAdmin(admin.ModelAdmin):
    """ポイント履歴管理"""
    list_display = ('user', 'points', 'reason', 'balance_after', 'created_at')
    list_filter = ('created_at', 'points')
    search_fields = ('user__username', 'reason')
    readonly_fields = ('created_at',)


@admin.register(UserRecommendation)
class UserRecommendationAdmin(admin.ModelAdmin):
    """ユーザーおすすめ管理"""
    list_display = ('user', 'item', 'score', 'is_viewed', 'is_liked', 'created_at')
    list_filter = ('is_viewed', 'is_liked', 'created_at')
    search_fields = ('user__username', 'item__name', 'reason')


@admin.register(UserPreference)
class UserPreferenceAdmin(admin.ModelAdmin):
    """ユーザー好み管理"""
    list_display = ('user', 'budget_min', 'budget_max', 'created_at')
    search_fields = ('user__username',)
    filter_horizontal = ('preferred_brands', 'preferred_categories')
