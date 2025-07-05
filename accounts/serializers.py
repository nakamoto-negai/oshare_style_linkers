from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework.authtoken.models import Token
from .models import (
    PointHistory, UserRecommendation, UserPreference
)
from answers.models import Question, Answer, AnswerVote
from items.models import Item

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """ユーザー登録シリアライザー"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name'
        ]
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("このユーザー名は既に使用されています。")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("このメールアドレスは既に使用されています。")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "パスワードが一致しません。"})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        try:
            user = User.objects.create_user(**validated_data)
            # 新規登録時にトークンを作成
            Token.objects.create(user=user)
            return user
        except Exception as e:
            raise serializers.ValidationError(f"ユーザー作成でエラーが発生しました: {str(e)}")


class UserLoginSerializer(serializers.Serializer):
    """ユーザーログインシリアライザー"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError("ユーザー名またはパスワードが正しくありません。")
            if not user.is_active:
                raise serializers.ValidationError("このアカウントは無効化されています。")
            attrs['user'] = user
        else:
            raise serializers.ValidationError("ユーザー名とパスワードの両方を入力してください。")
        
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """ユーザーシリアライザー"""
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'bio', 'birth_date', 'profile_image', 'points', 'total_earned_points',
            'is_premium', 'questions_count', 'answers_count', 'helpful_answers_count',
            'date_joined'
        ]
        read_only_fields = [
            'points', 'total_earned_points', 'questions_count', 
            'answers_count', 'helpful_answers_count', 'date_joined'
        ]


class UserProfileSerializer(serializers.ModelSerializer):
    """ユーザープロフィール詳細シリアライザー"""
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'bio', 'birth_date', 'profile_image', 'points', 'total_earned_points',
            'is_premium', 'notification_enabled', 'questions_count', 
            'answers_count', 'helpful_answers_count', 'date_joined'
        ]
        read_only_fields = [
            'username', 'points', 'total_earned_points', 'questions_count',
            'answers_count', 'helpful_answers_count', 'date_joined'
        ]


class PointHistorySerializer(serializers.ModelSerializer):
    """ポイント履歴シリアライザー"""
    class Meta:
        model = PointHistory
        fields = ['id', 'points', 'reason', 'balance_after', 'created_at']


class QuestionListSerializer(serializers.ModelSerializer):
    """質問一覧シリアライザー"""
    user_name = serializers.CharField(source='user.username', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Question
        fields = [
            'id', 'title', 'category', 'category_display', 'status', 'status_display',
            'user_name', 'views_count', 'answers_count', 'reward_points', 'created_at'
        ]


class QuestionDetailSerializer(serializers.ModelSerializer):
    """質問詳細シリアライザー"""
    user_name = serializers.CharField(source='user.username', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Question
        fields = [
            'id', 'title', 'content', 'category', 'category_display', 
            'status', 'status_display', 'user_name', 'image',
            'views_count', 'answers_count', 'reward_points', 'created_at', 'updated_at'
        ]


class QuestionCreateSerializer(serializers.ModelSerializer):
    """質問作成シリアライザー"""
    class Meta:
        model = Question
        fields = ['title', 'content', 'category', 'image', 'reward_points']
    
    def create(self, validated_data):
        # ユーザーが設定されていない場合は、view層で設定される
        # （開発用の認証バイパス対応）
        if 'user' not in validated_data:
            request_user = self.context['request'].user
            if request_user.is_authenticated:
                validated_data['user'] = request_user
        return super().create(validated_data)


class AnswerSerializer(serializers.ModelSerializer):
    """回答シリアライザー"""
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_profile_image = serializers.ImageField(source='user.profile_image', read_only=True)
    
    class Meta:
        model = Answer
        fields = [
            'id', 'content', 'image', 'user_name', 'user_profile_image',
            'is_helpful', 'is_best_answer', 'helpful_votes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['is_helpful', 'is_best_answer', 'helpful_votes']


class AnswerCreateSerializer(serializers.ModelSerializer):
    """回答作成シリアライザー"""
    class Meta:
        model = Answer
        fields = ['content', 'image']
    
    def create(self, validated_data):
        # ユーザーが設定されていない場合は、view層で設定される
        # （開発用の認証バイパス対応）
        if 'user' not in validated_data:
            request_user = self.context['request'].user
            if request_user.is_authenticated:
                validated_data['user'] = request_user
        validated_data['question'] = self.context['question']
        return super().create(validated_data)


class UserRecommendationSerializer(serializers.ModelSerializer):
    """ユーザーおすすめシリアライザー"""
    item_name = serializers.CharField(source='item.name', read_only=True)
    item_brand = serializers.CharField(source='item.brand.name', read_only=True)
    item_price = serializers.DecimalField(source='item.price', max_digits=10, decimal_places=2, read_only=True)
    item_image = serializers.ImageField(source='item.main_image', read_only=True)
    
    class Meta:
        model = UserRecommendation
        fields = [
            'id', 'item', 'item_name', 'item_brand', 'item_price', 'item_image',
            'reason', 'score', 'is_viewed', 'is_liked', 'created_at'
        ]


class UserPreferenceSerializer(serializers.ModelSerializer):
    """ユーザー好みシリアライザー"""
    preferred_brands_names = serializers.StringRelatedField(source='preferred_brands', many=True, read_only=True)
    preferred_categories_names = serializers.StringRelatedField(source='preferred_categories', many=True, read_only=True)
    
    class Meta:
        model = UserPreference
        fields = [
            'preferred_brands', 'preferred_brands_names',
            'preferred_categories', 'preferred_categories_names',
            'clothing_sizes', 'shoe_sizes', 'budget_min', 'budget_max',
            'style_preferences', 'color_preferences'
        ]


class AnswerVoteSerializer(serializers.ModelSerializer):
    """回答投票シリアライザー"""
    class Meta:
        model = AnswerVote
        fields = ['id', 'answer', 'is_helpful', 'created_at']
        read_only_fields = ['created_at']
    
    def create(self, validated_data):
        # 現在のユーザーを自動設定
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class AnswerWithQuestionSerializer(serializers.ModelSerializer):
    """プロフィール画面用回答シリアライザー（質問情報付き）"""
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_profile_image = serializers.ImageField(source='user.profile_image', read_only=True)
    question_title = serializers.CharField(source='question.title', read_only=True)
    question_id = serializers.IntegerField(source='question.id', read_only=True)
    
    class Meta:
        model = Answer
        fields = [
            'id', 'content', 'image', 'user_name', 'user_profile_image',
            'question_title', 'question_id', 'is_helpful', 'is_best_answer', 
            'helpful_votes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['is_helpful', 'is_best_answer', 'helpful_votes']
