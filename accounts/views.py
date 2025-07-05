from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.contrib.auth import login, logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.db.models import F
import logging
import json

# ロガーの設定
logger = logging.getLogger('accounts')
from .models import (
    PointHistory, UserRecommendation, UserPreference
)
from answers.models import Question, Answer, AnswerVote
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer,
    UserSerializer, UserProfileSerializer, PointHistorySerializer,
    QuestionListSerializer, QuestionDetailSerializer, QuestionCreateSerializer,
    AnswerSerializer, AnswerCreateSerializer, AnswerWithQuestionSerializer,
    UserRecommendationSerializer, UserPreferenceSerializer, AnswerVoteSerializer
)

User = get_user_model()


@api_view(['GET'])
@permission_classes([])  # 認証不要
def test_api(request):
    """テスト用APIエンドポイント"""
    return Response({
        'message': 'Accounts API is working!',
        'timestamp': str(timezone.now()),
        'method': request.method,
        'path': request.path,
        'user': str(request.user) if request.user.is_authenticated else 'Anonymous'
    })


class UserProfileView(generics.RetrieveUpdateAPIView):
    """ユーザープロフィール取得・更新"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class UserDetailView(generics.RetrieveAPIView):
    """ユーザー詳細取得（他のユーザーも含む）"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'


class PointHistoryListView(generics.ListAPIView):
    """ポイント履歴一覧"""
    serializer_class = PointHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PointHistory.objects.filter(user=self.request.user)


class QuestionListView(generics.ListCreateAPIView):
    """質問一覧・作成"""
    queryset = Question.objects.all()
    permission_classes = []  # 一時的に認証を無効化（開発用）
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return QuestionCreateSerializer
        return QuestionListSerializer
    
    def perform_create(self, serializer):
        # 開発用：認証されていない場合はスーパーユーザーを使用
        user = self.request.user if self.request.user.is_authenticated else User.objects.filter(is_superuser=True).first()
        logger.info(f"QuestionListView.perform_create called")
        logger.info(f"Request user: {self.request.user}")
        logger.info(f"Is authenticated: {self.request.user.is_authenticated}")
        logger.info(f"Using user: {user.username if user else 'No user'}")
        
        question = serializer.save(user=user)
        logger.info(f"Question created with ID: {question.id}, Title: {question.title}, User: {question.user.username}")
        
        # 質問数をカウントアップ
        if user:
            old_count = user.questions_count
            user.questions_count = F('questions_count') + 1
            user.save(update_fields=['questions_count'])
            user.refresh_from_db()
            logger.info(f"Updated questions_count for user {user.username}: {old_count} -> {user.questions_count}")
            
        return question


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """質問詳細・更新・削除"""
    queryset = Question.objects.all()
    serializer_class = QuestionDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_object(self):
        obj = super().get_object()
        # 閲覧数をカウントアップ（自分の質問は除く）
        if self.request.user != obj.user:
            obj.views_count = F('views_count') + 1
            obj.save(update_fields=['views_count'])
        return obj
    
    def perform_update(self, serializer):
        # 自分の質問のみ更新可能
        if serializer.instance.user != self.request.user:
            raise PermissionError("他のユーザーの質問は編集できません")
        serializer.save()
    
    def perform_destroy(self, instance):
        # 自分の質問のみ削除可能
        if instance.user != self.request.user:
            raise PermissionError("他のユーザーの質問は削除できません")
        instance.delete()


class QuestionAnswersView(generics.ListCreateAPIView):
    """質問に対する回答一覧・作成"""
    serializer_class = AnswerSerializer
    permission_classes = []  # 一時的に認証を無効化（開発用）
    
    def get_queryset(self):
        question_id = self.kwargs['question_id']
        return Answer.objects.filter(question_id=question_id)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AnswerCreateSerializer
        return AnswerSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.method == 'POST':
            question_id = self.kwargs['question_id']
            context['question'] = get_object_or_404(Question, id=question_id)
        return context
    
    def perform_create(self, serializer):
        # 認証されたユーザーがいる場合はそのユーザーを使用
        if self.request.user.is_authenticated:
            user = self.request.user
            logger.info(f"QuestionAnswersView: Using authenticated user: {user.username}")
        else:
            # 開発用：認証されていない場合はスーパーユーザーを使用
            user = User.objects.filter(is_superuser=True).first()
            logger.info(f"QuestionAnswersView: Using fallback user: {user.username if user else 'No user'}")
        
        answer = serializer.save(user=user)
        logger.info(f"Answer created with ID: {answer.id}, User: {answer.user.username}")
        
        # 回答数をカウントアップ
        if user:
            old_count = user.answers_count
            user.answers_count = F('answers_count') + 1
            user.save(update_fields=['answers_count'])
            user.refresh_from_db()
            logger.info(f"Updated answers_count for user {user.username}: {old_count} -> {user.answers_count}")
        
        # 質問の回答数もカウントアップ
        question = answer.question
        question.answers_count = F('answers_count') + 1
        question.save(update_fields=['answers_count'])
        logger.info(f"Updated answers_count for question {question.id}: {question.answers_count}")
        
        return answer


class UserQuestionsView(generics.ListAPIView):
    """ユーザーの質問一覧"""
    serializer_class = QuestionListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Question.objects.filter(user=self.request.user).order_by('-created_at')
        logger.info(f"UserQuestionsView - User: {self.request.user.username}, Questions count: {queryset.count()}")
        for q in queryset:
            logger.info(f"  Question ID: {q.id}, Title: {q.title}, User: {q.user.username}")
        return queryset
    
    def list(self, request, *args, **kwargs):
        logger.info(f"UserQuestionsView.list called for user: {request.user.username}")
        response = super().list(request, *args, **kwargs)
        logger.info(f"UserQuestionsView response data: {response.data}")
        return response


class UserAnswersView(generics.ListAPIView):
    """ユーザーの回答一覧"""
    serializer_class = AnswerWithQuestionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Answer.objects.filter(user=self.request.user).select_related('question')
        logger.info(f"UserAnswersView - User: {self.request.user.username}, Answers count: {queryset.count()}")
        return queryset
    
    def list(self, request, *args, **kwargs):
        logger.info(f"UserAnswersView.list called for user: {request.user.username}")
        response = super().list(request, *args, **kwargs)
        logger.info(f"UserAnswersView response data: {response.data}")
        return response


class UserRecommendationsView(generics.ListAPIView):
    """ユーザーおすすめ商品一覧"""
    serializer_class = UserRecommendationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserRecommendation.objects.filter(user=self.request.user)


class UserPreferenceView(generics.RetrieveUpdateAPIView):
    """ユーザー好み設定取得・更新"""
    serializer_class = UserPreferenceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        preference, created = UserPreference.objects.get_or_create(user=self.request.user)
        return preference


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def vote_answer(request, answer_id):
    """回答に投票"""
    try:
        answer = get_object_or_404(Answer, id=answer_id)
        is_helpful = request.data.get('is_helpful', True)
        
        # 既存の投票を確認
        vote, created = AnswerVote.objects.get_or_create(
            answer=answer,
            user=request.user,
            defaults={'is_helpful': is_helpful}
        )
        
        if not created:
            # 既存の投票を更新
            vote.is_helpful = is_helpful
            vote.save()
        
        # 投票数を更新
        helpful_votes = AnswerVote.objects.filter(answer=answer, is_helpful=True).count()
        answer.helpful_votes = helpful_votes
        answer.save(update_fields=['helpful_votes'])
        
        return Response({
            'success': True,
            'message': '投票しました',
            'helpful_votes': helpful_votes
        })
    
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([])  # 開発環境での動作確認用に一時的に無効化
def mark_best_answer(request, answer_id):
    """ベストアンサーをマーク"""
    try:
        answer = get_object_or_404(Answer, id=answer_id)
        question = answer.question
        
        # 開発環境では認証チェックを簡略化
        from django.conf import settings
        if settings.DEBUG:
            print(f"DEBUG: Setting best answer for answer_id={answer_id}")
            print(f"DEBUG: Question user={question.user.username}, Answer user={answer.user.username}")
        
        # 他のベストアンサーを解除
        Answer.objects.filter(question=question, is_best_answer=True).update(is_best_answer=False)
        
        # 新しいベストアンサーを設定
        answer.is_best_answer = True
        answer.save(update_fields=['is_best_answer'])
        
        # 回答者にポイント付与
        try:
            answer.user.add_points(question.reward_points, f"ベストアンサー選出: {question.title}")
        except Exception as e:
            print(f"DEBUG: Point addition failed: {e}")
        
        # 質問をクローズ
        question.status = 'closed'
        question.save(update_fields=['status'])
        
        return Response({
            'success': True,
            'message': 'ベストアンサーに選出しました'
        })
    
    except Exception as e:
        print(f"DEBUG: Exception in mark_best_answer: {e}")
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([])
@csrf_exempt
def register(request):
    """ユーザー登録"""
    logger.info(f"Registration attempt - Method: {request.method}, Content-Type: {request.content_type}")
    logger.info(f"Request data: {request.data}")
    
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        logger.info(f"Registration serializer created with data: {request.data}")
        
        if serializer.is_valid():
            logger.info("Registration serializer validation passed")
            user = serializer.save()
            logger.info(f"User created: {user.username}")
            
            token, created = Token.objects.get_or_create(user=user)
            logger.info(f"Token {'created' if created else 'retrieved'} for registration: {token.key[:10]}...")
            
            response_data = {
                'user': UserSerializer(user).data,
                'token': token.key,
                'message': '登録が完了しました。'
            }
            logger.info("Registration response data prepared successfully")
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            logger.warning(f"Registration serializer validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        logger.error(f"Exception in register: {str(e)}", exc_info=True)
        return Response({
            'error': str(e),
            'message': '登録処理でエラーが発生しました。'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([])
@csrf_exempt
def login_view(request):
    """ユーザーログイン"""
    logger.info(f"Login attempt - Method: {request.method}")
    logger.info(f"Content-Type: {request.content_type}")
    logger.info(f"Request META: {dict(request.META)}")
    
    try:
        # リクエストデータの取得とログ
        if hasattr(request, 'data'):
            request_data = request.data
        else:
            # フォールバック: JSONパースを試行
            try:
                request_data = json.loads(request.body.decode('utf-8'))
            except:
                request_data = request.POST
                
        logger.info(f"Request data: {request_data}")
        
        # シリアライザーでバリデーション
        serializer = UserLoginSerializer(data=request_data)
        logger.info(f"Serializer created successfully")
        
        if serializer.is_valid():
            logger.info("Serializer validation passed")
            user = serializer.validated_data['user']
            logger.info(f"User found: {user.username}")
            
            # トークン取得・作成
            token, created = Token.objects.get_or_create(user=user)
            logger.info(f"Token {'created' if created else 'retrieved'}: {token.key[:10]}...")
            
            # ログイン処理
            login(request, user)
            logger.info("User logged in successfully")
            
            # レスポンスデータ作成
            user_data = UserSerializer(user).data
            response_data = {
                'user': user_data,
                'token': token.key,
                'message': 'ログインしました。'
            }
            logger.info("Response data prepared successfully")
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        else:
            logger.warning(f"Serializer validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        return Response({
            'error': 'Invalid JSON',
            'message': 'リクエストデータの形式が正しくありません。'
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Exception in login_view: {str(e)}", exc_info=True)
        return Response({
            'error': str(e),
            'message': 'ログイン処理でエラーが発生しました。'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """ユーザーログアウト"""
    try:
        # トークンを削除
        request.user.auth_token.delete()
    except:
        pass
    logout(request)
    return Response({'message': 'ログアウトしました。'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """現在のユーザー情報を取得"""
    return Response({
        'user': UserSerializer(request.user).data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def debug_user_data(request):
    """デバッグ用：ユーザーの質問・回答データを確認"""
    user = request.user
    
    # Djangoの認証状況を詳細にログ出力
    logger.info(f"=== Debug API Called ===")
    logger.info(f"Request user: {user}")
    logger.info(f"User ID: {user.id}")
    logger.info(f"User username: {user.username}")
    logger.info(f"User email: {user.email}")
    logger.info(f"Is authenticated: {user.is_authenticated}")
    logger.info(f"Is active: {user.is_active}")
    logger.info(f"Authorization header: {request.META.get('HTTP_AUTHORIZATION', 'No Auth Header')}")
    
    # ユーザーの質問を取得
    questions = Question.objects.filter(user=user).order_by('-created_at')
    logger.info(f"Questions found for user {user.username}: {questions.count()}")
    
    questions_data = []
    for q in questions:
        questions_data.append({
            'id': q.id,
            'title': q.title,
            'content': q.content[:50] + '...' if len(q.content) > 50 else q.content,
            'created_at': q.created_at,
            'user_id': q.user.id,
            'user_username': q.user.username
        })
        logger.info(f"  Question {q.id}: {q.title} by {q.user.username}")
    
    # ユーザーの回答を取得
    answers = Answer.objects.filter(user=user).select_related('question')
    logger.info(f"Answers found for user {user.username}: {answers.count()}")
    
    answers_data = []
    for a in answers:
        answers_data.append({
            'id': a.id,
            'content': a.content[:50] + '...' if len(a.content) > 50 else a.content,
            'question_title': a.question.title,
            'created_at': a.created_at,
            'user_id': a.user.id,
            'user_username': a.user.username
        })
        logger.info(f"  Answer {a.id}: to '{a.question.title}' by {a.user.username}")
    
    # 全質問数（確認用）
    total_questions = Question.objects.count()
    user_questions_count = questions.count()
    logger.info(f"Total questions in DB: {total_questions}")
    logger.info(f"Questions by this user: {user_questions_count}")
    
    # 他のユーザーの質問も確認
    all_users = User.objects.all()
    all_users_info = []
    for u in all_users:
        u_questions = Question.objects.filter(user=u).count()
        all_users_info.append({
            'id': u.id,
            'username': u.username,
            'questions_count': u_questions
        })
        logger.info(f"User {u.username} has {u_questions} questions")
    
    debug_info = {
        'user_info': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_authenticated': user.is_authenticated,
            'is_active': user.is_active,
        },
        'questions': {
            'count': user_questions_count,
            'data': questions_data
        },
        'answers': {
            'count': answers.count(),
            'data': answers_data
        },
        'database_info': {
            'total_questions_in_db': total_questions,
            'questions_by_this_user': user_questions_count,
            'all_users': all_users_info
        }
    }
    
    logger.info(f"Returning debug info: {debug_info}")
    return Response(debug_info)
