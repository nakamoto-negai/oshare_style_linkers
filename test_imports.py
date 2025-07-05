#!/usr/bin/env python
"""
Simple Django imports test
"""
import os
import sys

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    import django
    print("✓ Django imported successfully")
    
    django.setup()
    print("✓ Django setup completed")
    
    from django.contrib.auth import get_user_model
    print("✓ User model imported")
    
    from accounts.serializers import UserLoginSerializer, UserRegistrationSerializer
    print("✓ Serializers imported")
    
    from accounts.views import login_view, register
    print("✓ Views imported")
    
    from rest_framework.authtoken.models import Token
    print("✓ Token model imported")
    
    User = get_user_model()
    print(f"✓ User model: {User}")
    
    # Test basic user creation
    if not User.objects.filter(username='testuser').exists():
        user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        print(f"✓ Test user created: {user.username}")
    else:
        user = User.objects.get(username='testuser')
        print(f"✓ Test user already exists: {user.username}")
    
    # Test token creation
    token, created = Token.objects.get_or_create(user=user)
    print(f"✓ Token {'created' if created else 'exists'}: {token.key[:10]}...")
    
    print("\n=== All imports and basic operations successful ===")
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
