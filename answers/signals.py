from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Answer, Question


@receiver(post_save, sender=Answer)
def update_answer_count_on_save(sender, instance, created, **kwargs):
    """回答が作成された時に質問の回答数を更新"""
    if created:
        question = instance.question
        question.answers_count = question.answers.count()
        question.save(update_fields=['answers_count'])


@receiver(post_delete, sender=Answer)
def update_answer_count_on_delete(sender, instance, **kwargs):
    """回答が削除された時に質問の回答数を更新"""
    question = instance.question
    question.answers_count = question.answers.count()
    question.save(update_fields=['answers_count'])
