from django.core.management.base import BaseCommand
from answers.models import Question


class Command(BaseCommand):
    help = 'Update answer counts for all questions'

    def handle(self, *args, **options):
        questions = Question.objects.all()
        updated_count = 0
        
        for question in questions:
            actual_count = question.answers.count()
            if question.answers_count != actual_count:
                question.answers_count = actual_count
                question.save(update_fields=['answers_count'])
                updated_count += 1
                self.stdout.write(
                    f'Updated question "{question.title}" - answers_count: {actual_count}'
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} questions')
        )
