from rest_framework import generics, filters, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend
from .models import Question, Answer, AnswerVote
from .serializers import (
    QuestionSerializer, QuestionListSerializer, 
    AnswerSerializer, QuestionCreateSerializer, AnswerCreateSerializer
)
import logging
import sys

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class QuestionListCreateView(generics.ListCreateAPIView):
    """質問一覧・作成API"""
    queryset = Question.objects.select_related('user').order_by('-created_at')
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'status', 'user']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'views_count', 'answers_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return QuestionCreateSerializer
        return QuestionListSerializer
    
    def create(self, request, *args, **kwargs):
        print(f"=== Question Create Debug ===", file=sys.stderr)
        print(f"Content-Type: {request.content_type}", file=sys.stderr)
        print(f"Request method: {request.method}", file=sys.stderr)
        print(f"Request data: {request.data}", file=sys.stderr)
        print(f"Request FILES: {request.FILES}", file=sys.stderr)
        print(f"Request user: {request.user}", file=sys.stderr)
        print(f"Is authenticated: {request.user.is_authenticated}", file=sys.stderr)
        print(f"Authorization header: {request.META.get('HTTP_AUTHORIZATION', 'No Auth Header')}", file=sys.stderr)
        
        # シリアライザーでバリデーションエラーの詳細を確認
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"Validation errors: {serializer.errors}", file=sys.stderr)
        
        print("=== End Question Create Debug ===", file=sys.stderr)
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        # ユーザー認証の確認とログイン中のユーザーを設定
        from django.contrib.auth import get_user_model
        import logging
        
        logger = logging.getLogger('answers')
        User = get_user_model()
        
        logger.info(f"=== QuestionListCreateView.perform_create called ===")
        logger.info(f"Request user: {self.request.user}")
        logger.info(f"Request user type: {type(self.request.user)}")
        logger.info(f"Is authenticated: {self.request.user.is_authenticated}")
        logger.info(f"Authorization header: {self.request.META.get('HTTP_AUTHORIZATION', 'No Auth Header')}")
        
        # 認証されたユーザーがいる場合はそのユーザーを使用
        if self.request.user.is_authenticated:
            user = self.request.user
            logger.info(f"Using authenticated user: {user.username} (ID: {user.id})")
        else:
            # 開発用：認証されていない場合はスーパーユーザーを使用
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                # スーパーユーザーがいない場合は最初のユーザーを使用
                user = User.objects.first()
                if not user:
                    # ユーザーが全く存在しない場合は作成
                    user = User.objects.create_user(
                        username='anonymous_user',
                        email='anonymous@example.com',
                        first_name='匿名ユーザー'
                    )
            logger.info(f"Using fallback user: {user.username} (ID: {user.id})")
        
        logger.info(f"Saving question with title: {serializer.validated_data.get('title')}")
        question = serializer.save(user=user)
        logger.info(f"Question created successfully:")
        logger.info(f"  - ID: {question.id}")
        logger.info(f"  - Title: {question.title}")
        logger.info(f"  - User: {question.user.username} (ID: {question.user.id})")
        logger.info(f"  - Created at: {question.created_at}")
        
        # 質問数をカウントアップ
        if user:
            from django.db.models import F
            old_count = user.questions_count
            user.questions_count = F('questions_count') + 1
            user.save(update_fields=['questions_count'])
            user.refresh_from_db()
            logger.info(f"Updated questions_count for user {user.username}: {old_count} -> {user.questions_count}")
        
        # 作成した質問がデータベースに保存されているか確認
        saved_question = Question.objects.get(id=question.id)
        logger.info(f"Verification - Question in DB: ID {saved_question.id}, User: {saved_question.user.username}")
        
        logger.info(f"=== perform_create completed ===")
        return question

class QuestionDetailView(generics.RetrieveAPIView):
    """質問詳細API"""
    queryset = Question.objects.select_related('user').prefetch_related(
        'answers__user', 'answers__votes'
    )
    serializer_class = QuestionSerializer
    
    def retrieve(self, request, *args, **kwargs):
        """質問を取得する際に閲覧数を増やす"""
        instance = self.get_object()
        # 閲覧数を増やす
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class AnswerListView(generics.ListAPIView):
    """回答一覧API"""
    serializer_class = AnswerSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['question', 'user', 'is_best_answer']
    ordering_fields = ['created_at', 'helpful_votes']
    ordering = ['-is_best_answer', '-helpful_votes', 'created_at']
    
    def get_queryset(self):
        return Answer.objects.select_related('user').prefetch_related('votes')

@api_view(['GET'])
def qa_stats(request):
    """Q&A統計情報API"""
    stats = {
        'total_questions': Question.objects.count(),
        'open_questions': Question.objects.filter(status='open').count(),
        'closed_questions': Question.objects.filter(status='closed').count(),
        'total_answers': Answer.objects.count(),
        'best_answers': Answer.objects.filter(is_best_answer=True).count(),
    }
    return Response(stats)

class FormDataTestView(APIView):
    """FormDataテスト用ビュー"""
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def post(self, request):
        print(f"Content-Type: {request.content_type}")
        print(f"Parser classes: {self.parser_classes}")
        print(f"Request data: {request.data}")
        print(f"Request FILES: {request.FILES}")
        return Response({"message": "FormData test successful", "data": dict(request.data)})
    
@method_decorator(csrf_exempt, name='dispatch')
class AnswerCreateView(generics.CreateAPIView):
    """回答投稿API"""
    serializer_class = AnswerCreateSerializer
    queryset = Answer.objects.all()
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_serializer_context(self):
        """シリアライザーにリクエストコンテキストを渡す"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def create(self, request, *args, **kwargs):
        print(f"\n=== Answer Create Debug ===", file=sys.stderr)
        print(f"Content-Type: {request.content_type}", file=sys.stderr)
        print(f"Request method: {request.method}", file=sys.stderr)
        print(f"Request data keys: {list(request.data.keys()) if hasattr(request, 'data') else 'No data'}", file=sys.stderr)
        print(f"Request FILES keys: {list(request.FILES.keys()) if hasattr(request, 'FILES') else 'No FILES'}", file=sys.stderr)
        
        if hasattr(request, 'data'):
            for key, value in request.data.items():
                if key == 'image':
                    print(f"  {key}: {type(value)} - {value}", file=sys.stderr)
                    if hasattr(value, 'content_type'):
                        print(f"    content_type: {value.content_type}", file=sys.stderr)
                    if hasattr(value, 'size'):
                        print(f"    size: {value.size}", file=sys.stderr)
                    if hasattr(value, 'name'):
                        print(f"    name: {value.name}", file=sys.stderr)
                else:
                    print(f"  {key}: {value}", file=sys.stderr)
        
        if hasattr(request, 'FILES'):
            for key, value in request.FILES.items():
                print(f"  FILE {key}: {type(value)} - {value}", file=sys.stderr)
                if hasattr(value, 'content_type'):
                    print(f"    FILE content_type: {value.content_type}", file=sys.stderr)
                if hasattr(value, 'size'):
                    print(f"    FILE size: {value.size}", file=sys.stderr)
        
        # バリデーション前のシリアライザーチェック
        serializer = self.get_serializer(data=request.data)
        print(f"Serializer is_valid: {serializer.is_valid()}", file=sys.stderr)
        if not serializer.is_valid():
            print(f"Serializer errors: {serializer.errors}", file=sys.stderr)
            # エラーの詳細をログに出力
            for field, errors in serializer.errors.items():
                print(f"  Field '{field}' errors: {errors}", file=sys.stderr)
        
        print("=== End Debug ===", file=sys.stderr)
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        # ユーザー認証の確認とログイン中のユーザーを設定
        from django.contrib.auth import get_user_model
        import logging
        
        logger = logging.getLogger('answers')
        User = get_user_model()
        
        logger.info(f"AnswerCreateView.perform_create called")
        logger.info(f"Request user: {self.request.user}")
        logger.info(f"Is authenticated: {self.request.user.is_authenticated}")
        logger.info(f"Authorization header: {self.request.META.get('HTTP_AUTHORIZATION', 'No Auth Header')}")
        
        # 認証されたユーザーがいる場合はそのユーザーを使用
        if self.request.user.is_authenticated:
            user = self.request.user
            logger.info(f"Using authenticated user: {user.username}")
        else:
            # 開発用：認証されていない場合はスーパーユーザーを使用
            user = User.objects.filter(is_superuser=True).first()
            if not user:
                # スーパーユーザーがいない場合は最初のユーザーを使用
                user = User.objects.first()
                if not user:
                    # ユーザーが全く存在しない場合は作成
                    user = User.objects.create_user(
                        username='anonymous_user',
                        email='anonymous@example.com',
                        first_name='匿名ユーザー'
                    )
            logger.info(f"Using fallback user: {user.username}")
        
        print(f"=== perform_create ===", file=sys.stderr)
        print(f"Serializer validated_data: {serializer.validated_data}", file=sys.stderr)
        print(f"Using user: {user.username} (ID: {user.id})", file=sys.stderr)
        
        instance = serializer.save(user=user)
        
        print(f"Saved instance: {instance}", file=sys.stderr)
        print(f"Saved instance user: {instance.user.username} (ID: {instance.user.id})", file=sys.stderr)
        logger.info(f"Answer created with ID: {instance.id}, User: {instance.user.username}")
        
        # 回答数をカウントアップ
        if user:
            from django.db.models import F
            old_count = user.answers_count
            user.answers_count = F('answers_count') + 1
            user.save(update_fields=['answers_count'])
            user.refresh_from_db()
            logger.info(f"Updated answers_count for user {user.username}: {old_count} -> {user.answers_count}")
        
        print(f"Saved instance image: '{instance.image}'", file=sys.stderr)
        if instance.image:
            print(f"Created answer with image: {instance.image}", file=sys.stderr)
        else:
            print(f"Created answer WITHOUT image", file=sys.stderr)
        print(f"=== end perform_create ===", file=sys.stderr)
        return instance
