from django.db import models
from django.conf import settings


class Question(models.Model):
    """質問モデル"""
    CATEGORY_CHOICES = [
        ('styling', 'スタイリング'),
        ('coordination', 'コーディネート'),
        ('brand', 'ブランド'),
        ('size', 'サイズ'),
        ('care', 'お手入れ'),
        ('trend', 'トレンド'),
        ('other', 'その他'),
    ]
    
    STATUS_CHOICES = [
        ('open', '回答受付中'),
        ('closed', '解決済み'),
        ('expired', '期限切れ'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='questions')
    title = models.CharField('タイトル', max_length=200)
    content = models.TextField('質問内容')
    category = models.CharField('カテゴリ', max_length=20, choices=CATEGORY_CHOICES)
    status = models.CharField('ステータス', max_length=10, choices=STATUS_CHOICES, default='open')
    
    # 画像添付
    image = models.ImageField('画像', upload_to='questions/', null=True, blank=True)
    
    # 統計
    views_count = models.PositiveIntegerField('閲覧数', default=0)
    answers_count = models.PositiveIntegerField('回答数', default=0)
    
    # ポイント設定
    reward_points = models.PositiveIntegerField('回答報酬ポイント', default=10)
    
    created_at = models.DateTimeField('作成日時', auto_now_add=True)
    updated_at = models.DateTimeField('更新日時', auto_now=True)
    
    class Meta:
        verbose_name = '質問'
        verbose_name_plural = '質問'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class Answer(models.Model):
    """回答モデル"""
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='answers')
    content = models.TextField('回答内容')
    
    # 画像添付
    image = models.ImageField('画像', upload_to='answers/', null=True, blank=True)
    
    # 商品情報（JSONフィールドで複数商品の情報を保存）
    recommended_products = models.JSONField('推奨商品', null=True, blank=True, help_text='回答で紹介した商品のID配列')
    
    # 評価システム
    is_helpful = models.BooleanField('役立った回答', default=False)
    is_best_answer = models.BooleanField('ベストアンサー', default=False)
    helpful_votes = models.PositiveIntegerField('役立った投票数', default=0)
    
    created_at = models.DateTimeField('作成日時', auto_now_add=True)
    updated_at = models.DateTimeField('更新日時', auto_now=True)
    
    class Meta:
        verbose_name = '回答'
        verbose_name_plural = '回答'
        ordering = ['-is_best_answer', '-helpful_votes', 'created_at']
    
    def __str__(self):
        return f"{self.question.title}への回答 by {self.user.username}"


class AnswerVote(models.Model):
    """回答への投票"""
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_helpful = models.BooleanField('役立った', default=True)
    created_at = models.DateTimeField('投票日時', auto_now_add=True)
    
    class Meta:
        verbose_name = '回答投票'
        verbose_name_plural = '回答投票'
        unique_together = ['answer', 'user']
    
    def __str__(self):
        return f"{self.user.username} -> {self.answer}"
