from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # 認証関連
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('me/', views.current_user, name='current-user'),
    
    # テスト用エンドポイント
    path('test/', views.test_api, name='api-test'),
    path('debug/', views.debug_user_data, name='debug-user-data'),
    
    # ユーザー関連
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('users/<str:username>/', views.UserDetailView.as_view(), name='user-detail'),
    path('point-history/', views.PointHistoryListView.as_view(), name='point-history'),
    
    # 質問関連
    path('questions/', views.QuestionListView.as_view(), name='question-list'),
    path('questions/<int:pk>/', views.QuestionDetailView.as_view(), name='question-detail'),
    path('questions/<int:question_id>/answers/', views.QuestionAnswersView.as_view(), name='question-answers'),
    path('my-questions/', views.UserQuestionsView.as_view(), name='user-questions'),
    
    # 回答関連
    path('my-answers/', views.UserAnswersView.as_view(), name='user-answers'),
    path('answers/<int:answer_id>/vote/', views.vote_answer, name='vote-answer'),
    path('answers/<int:answer_id>/best/', views.mark_best_answer, name='mark-best-answer'),
    
    # おすすめ・設定
    path('recommendations/', views.UserRecommendationsView.as_view(), name='user-recommendations'),
    path('preferences/', views.UserPreferenceView.as_view(), name='user-preferences'),
]
