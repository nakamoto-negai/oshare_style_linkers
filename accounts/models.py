from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    """カスタムユーザーモデル"""
    
    # 基本プロフィール情報
    bio = models.TextField('自己紹介', max_length=500, blank=True)
    birth_date = models.DateField('生年月日', null=True, blank=True)
    profile_image = models.ImageField('プロフィール画像', upload_to='profiles/', null=True, blank=True)
    
    # ポイントシステム
    points = models.PositiveIntegerField('所持ポイント', default=0)
    total_earned_points = models.PositiveIntegerField('累計獲得ポイント', default=0)
    
    # ユーザー設定
    is_premium = models.BooleanField('プレミアム会員', default=False)
    notification_enabled = models.BooleanField('通知設定', default=True)
    
    # アクティビティ統計
    questions_count = models.PositiveIntegerField('質問数', default=0)
    answers_count = models.PositiveIntegerField('回答数', default=0)
    helpful_answers_count = models.PositiveIntegerField('役立った回答数', default=0)
    
    # タイムスタンプ
    created_at = models.DateTimeField('作成日時', auto_now_add=True)
    updated_at = models.DateTimeField('更新日時', auto_now=True)
    
    class Meta:
        verbose_name = 'ユーザー'
        verbose_name_plural = 'ユーザー'
    
    def __str__(self):
        return self.username
    
    def add_points(self, points, reason=""):
        """ポイントを追加"""
        self.points += points
        self.total_earned_points += points
        self.save()
        
        # ポイント履歴を記録
        PointHistory.objects.create(
            user=self,
            points=points,
            reason=reason,
            balance_after=self.points
        )
    
    def subtract_points(self, points, reason=""):
        """ポイントを減算"""
        if self.points >= points:
            self.points -= points
            self.save()
            
            # ポイント履歴を記録
            PointHistory.objects.create(
                user=self,
                points=-points,
                reason=reason,
                balance_after=self.points
            )
            return True
        return False


class PointHistory(models.Model):
    """ポイント履歴"""
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='point_history')
    points = models.IntegerField('ポイント変動')
    reason = models.CharField('理由', max_length=200)
    balance_after = models.PositiveIntegerField('変動後残高')
    created_at = models.DateTimeField('作成日時', auto_now_add=True)
    
    class Meta:
        verbose_name = 'ポイント履歴'
        verbose_name_plural = 'ポイント履歴'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username}: {self.points}pt ({self.reason})"


class UserRecommendation(models.Model):
    """ユーザーおすすめ商品"""
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE, related_name='recommendations')
    item = models.ForeignKey('items.Item', on_delete=models.CASCADE)
    reason = models.CharField('おすすめ理由', max_length=200, blank=True)
    
    # おすすめ情報
    score = models.FloatField('おすすめスコア', default=0.0)
    is_viewed = models.BooleanField('閲覧済み', default=False)
    is_liked = models.BooleanField('いいね', default=False)
    
    created_at = models.DateTimeField('作成日時', auto_now_add=True)
    
    class Meta:
        verbose_name = 'おすすめ商品'
        verbose_name_plural = 'おすすめ商品'
        unique_together = ['user', 'item']
        ordering = ['-score', '-created_at']
    
    def __str__(self):
        return f"{self.user.username}へのおすすめ: {self.item.name}"


class UserPreference(models.Model):
    """ユーザー好み設定"""
    user = models.OneToOneField('CustomUser', on_delete=models.CASCADE, related_name='preference')
    
    # ファッション好み
    preferred_brands = models.ManyToManyField('items.Brand', blank=True, verbose_name='好きなブランド')
    preferred_categories = models.ManyToManyField('items.Category', blank=True, verbose_name='好きなカテゴリ')
    
    # サイズ設定
    clothing_sizes = models.JSONField('服のサイズ', default=dict, blank=True)
    shoe_sizes = models.JSONField('靴のサイズ', default=dict, blank=True)
    
    # 予算設定
    budget_min = models.PositiveIntegerField('最小予算', default=0)
    budget_max = models.PositiveIntegerField('最大予算', default=100000)
    
    # スタイル好み
    style_preferences = models.JSONField('スタイル好み', default=list, blank=True)
    color_preferences = models.JSONField('色の好み', default=list, blank=True)
    
    created_at = models.DateTimeField('作成日時', auto_now_add=True)
    updated_at = models.DateTimeField('更新日時', auto_now=True)
    
    class Meta:
        verbose_name = 'ユーザー好み'
        verbose_name_plural = 'ユーザー好み'
    
    def __str__(self):
        return f"{self.user.username}の好み設定"
