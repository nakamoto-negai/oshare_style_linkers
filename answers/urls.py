from django.urls import path
from . import views

urlpatterns = [
    # 質問関連API
    path('questions/', views.QuestionListCreateView.as_view(), name='question_list_create'),
    path('questions/<int:pk>/', views.QuestionDetailView.as_view(), name='question_detail'),
    
    # 回答関連API
    path('answers/', views.AnswerListView.as_view(), name='answer_list'),
    path('answers/create/', views.AnswerCreateView.as_view(), name='answer_create'),
    
    # 統計API
    path('stats/', views.qa_stats, name='qa_stats'),
    
    # テスト用API
    path('formdata-test/', views.FormDataTestView.as_view(), name='formdata_test'),
]
