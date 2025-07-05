from rest_framework import serializers
from .models import Question, Answer, AnswerVote
from django.contrib.auth import get_user_model
import sys

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name']

class AnswerVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnswerVote
        fields = ['id', 'is_helpful', 'created_at']

class AnswerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    votes = AnswerVoteSerializer(many=True, read_only=True)
    votes_count = serializers.SerializerMethodField()
    recommended_products_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Answer
        fields = [
            'id', 'content', 'image', 'recommended_products', 'recommended_products_details', 
            'user', 'is_best_answer', 'helpful_votes',
            'created_at', 'updated_at', 'votes', 'votes_count'
        ]
    
    def get_votes_count(self, obj):
        return obj.votes.count()
    
    def get_recommended_products_details(self, obj):
        """推奨商品の詳細情報を取得"""
        if not obj.recommended_products:
            return []
        
        try:
            from items.models import Item
            products = Item.objects.filter(id__in=obj.recommended_products, is_available=True)
            return [
                {
                    'id': product.id,
                    'name': product.name,
                    'brand_name': product.brand.name if product.brand else '',
                    'price': product.price,
                    'image_url': product.main_image_url or (
                        self.context.get('request').build_absolute_uri(product.main_image.url) 
                        if product.main_image and self.context.get('request') else None
                    ),
                    'condition': product.condition,
                    'size': product.size,
                    'color': product.color,
                    'is_featured': product.is_featured,
                }
                for product in products
            ]
        except Exception as e:
            print(f"Error fetching product details: {e}", file=sys.stderr)
            return []
    
    def to_representation(self, instance):
        """画像URLを適切に返す"""
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image and request:
            data['image'] = request.build_absolute_uri(instance.image.url)
        return data

class AnswerCreateSerializer(serializers.ModelSerializer):
    """回答作成用シリアライザー"""
    
    class Meta:
        model = Answer
        fields = ['id', 'content', 'question', 'image', 'recommended_products', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError("回答内容は必須です。")
        if len(value.strip()) < 10:
            raise serializers.ValidationError("回答内容は10文字以上で入力してください。")
        return value.strip()
    
    def validate_recommended_products(self, value):
        """推奨商品IDのバリデーション"""
        if value is None:
            return value
        
        # 商品IDの配列であることを確認
        if not isinstance(value, list):
            raise serializers.ValidationError("推奨商品は配列形式で指定してください。")
        
        # 最大3個まで
        if len(value) > 3:
            raise serializers.ValidationError("推奨商品は最大3個までです。")
        
        # 各要素が整数（商品ID）であることを確認
        for product_id in value:
            if not isinstance(product_id, int):
                raise serializers.ValidationError("商品IDは整数で指定してください。")
        
        return value
    
    def create(self, validated_data):
        """カスタムcreateメソッドで画像・商品情報保存をデバッグ"""
        import sys
        print(f"=== AnswerCreateSerializer.create ===", file=sys.stderr)
        print(f"validated_data: {validated_data}", file=sys.stderr)
        print(f"validated_data keys: {list(validated_data.keys())}", file=sys.stderr)
        
        if 'image' in validated_data:
            image = validated_data['image']
            print(f"Image field: {image}", file=sys.stderr)
            print(f"Image type: {type(image)}", file=sys.stderr)
            if hasattr(image, 'name'):
                print(f"Image name: {image.name}", file=sys.stderr)
            if hasattr(image, 'size'):
                print(f"Image size: {image.size}", file=sys.stderr)
        else:
            print(f"No image in validated_data", file=sys.stderr)
        
        if 'recommended_products' in validated_data:
            products = validated_data['recommended_products']
            print(f"Recommended products: {products}", file=sys.stderr)
        
        # デフォルトのcreateを実行
        instance = super().create(validated_data)
        
        print(f"Created instance: {instance}", file=sys.stderr)
        print(f"Instance image field: '{instance.image}'", file=sys.stderr)
        print(f"Instance recommended_products: {instance.recommended_products}", file=sys.stderr)
        print(f"=== End AnswerCreateSerializer.create ===", file=sys.stderr)
        
        return instance
    
    def to_representation(self, instance):
        """画像URLを適切に返す"""
        data = super().to_representation(instance)
        request = self.context.get('request')
        if instance.image:
            if request:
                data['image'] = request.build_absolute_uri(instance.image.url)
            else:
                data['image'] = instance.image.url
        return data

class QuestionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Question
        fields = [
            'id', 'title', 'content', 'category', 'category_display',
            'status', 'status_display', 'image', 'views_count', 'answers_count',
            'reward_points', 'created_at', 'updated_at', 'user', 'answers'
        ]

class QuestionCreateSerializer(serializers.ModelSerializer):
    """質問作成用シリアライザー"""
    class Meta:
        model = Question
        fields = [
            'id', 'title', 'content', 'category', 'image', 'reward_points',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']
        
    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("タイトルは必須です。")
        if len(value.strip()) < 5:
            raise serializers.ValidationError("タイトルは5文字以上で入力してください。")
        return value.strip()
    
    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError("質問内容は必須です。")
        if len(value.strip()) < 5:
            raise serializers.ValidationError("質問内容は5文字以上で入力してください。")
        return value.strip()
    
    def validate_reward_points(self, value):
        """報酬ポイントのバリデーション（文字列から整数への変換対応）"""
        if isinstance(value, str):
            try:
                value = int(value)
            except ValueError:
                raise serializers.ValidationError("報酬ポイントは数値で入力してください。")
        
        if value < 10 or value > 1000:
            raise serializers.ValidationError("報酬ポイントは10から1000の間で設定してください。")
        return value

class QuestionListSerializer(serializers.ModelSerializer):
    """質問一覧用の軽量シリアライザー"""
    user = UserSerializer(read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Question
        fields = [
            'id', 'title', 'category', 'category_display',
            'status', 'status_display', 'views_count', 'answers_count',
            'reward_points', 'created_at', 'user'
        ]
