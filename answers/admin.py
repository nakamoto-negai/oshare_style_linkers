from django.contrib import admin
from .models import Question, Answer, AnswerVote


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'category', 'status', 'answers_count', 'views_count', 'created_at']
    list_filter = ['category', 'status', 'created_at']
    search_fields = ['title', 'content', 'user__username']
    readonly_fields = ['views_count', 'answers_count', 'created_at', 'updated_at']
    list_per_page = 20


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['question', 'user', 'is_best_answer', 'is_helpful', 'helpful_votes', 'created_at']
    list_filter = ['is_best_answer', 'is_helpful', 'created_at']
    search_fields = ['content', 'user__username', 'question__title']
    readonly_fields = ['helpful_votes', 'created_at', 'updated_at']
    list_per_page = 20


@admin.register(AnswerVote)
class AnswerVoteAdmin(admin.ModelAdmin):
    list_display = ['answer', 'user', 'is_helpful', 'created_at']
    list_filter = ['is_helpful', 'created_at']
    search_fields = ['user__username', 'answer__question__title']
    readonly_fields = ['created_at']
