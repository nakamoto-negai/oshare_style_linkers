from django.apps import AppConfig


class AnswersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'answers'
    
    def ready(self):
        import answers.signals
