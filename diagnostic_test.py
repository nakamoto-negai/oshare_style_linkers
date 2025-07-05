#!/usr/bin/env python
"""
Comprehensive troubleshooting script for the 500 error
"""
import os
import sys
import django

def run_diagnostics():
    """Run comprehensive diagnostics"""
    print("=== Django Authentication Diagnostics ===")
    
    # Step 1: Django setup
    print("\n1. Setting up Django...")
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        django.setup()
        print("✓ Django setup successful")
    except Exception as e:
        print(f"✗ Django setup failed: {e}")
        return False
    
    # Step 2: Check database
    print("\n2. Checking database...")
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("✓ Database connection successful")
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return False
    
    # Step 3: Check user model
    print("\n3. Checking user model...")
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        user_count = User.objects.count()
        print(f"✓ User model accessible, {user_count} users in database")
    except Exception as e:
        print(f"✗ User model error: {e}")
        return False
    
    # Step 4: Check token model
    print("\n4. Checking token model...")
    try:
        from rest_framework.authtoken.models import Token
        token_count = Token.objects.count()
        print(f"✓ Token model accessible, {token_count} tokens in database")
    except Exception as e:
        print(f"✗ Token model error: {e}")
        return False
    
    # Step 5: Test serializers
    print("\n5. Testing serializers...")
    try:
        from accounts.serializers import UserLoginSerializer, UserRegistrationSerializer
        print("✓ Serializers imported successfully")
        
        # Test login serializer
        login_serializer = UserLoginSerializer(data={
            'username': 'test',
            'password': 'test'
        })
        print("✓ Login serializer created")
        
        # Test registration serializer
        reg_serializer = UserRegistrationSerializer(data={
            'username': 'test',
            'password': 'test',
            'password_confirm': 'test',
            'email': 'test@test.com'
        })
        print("✓ Registration serializer created")
        
    except Exception as e:
        print(f"✗ Serializer error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Step 6: Test views
    print("\n6. Testing view imports...")
    try:
        from accounts.views import login_view, register
        print("✓ Views imported successfully")
    except Exception as e:
        print(f"✗ View import error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Step 7: Create test user
    print("\n7. Creating test user...")
    try:
        test_username = "testuser123"
        if not User.objects.filter(username=test_username).exists():
            user = User.objects.create_user(
                username=test_username,
                password="testpass123",
                email="test@example.com"
            )
            print(f"✓ Test user created: {user.username}")
        else:
            user = User.objects.get(username=test_username)
            print(f"✓ Test user exists: {user.username}")
    except Exception as e:
        print(f"✗ Test user creation error: {e}")
        return False
    
    # Step 8: Test direct view call
    print("\n8. Testing direct view call...")
    try:
        from rest_framework.test import APIRequestFactory
        from accounts.views import login_view
        
        factory = APIRequestFactory()
        request = factory.post(
            '/api/accounts/login/',
            {'username': test_username, 'password': 'testpass123'},
            format='json'
        )
        
        response = login_view(request)
        print(f"✓ Direct view call successful, status: {response.status_code}")
        
        if hasattr(response, 'data'):
            print(f"  Response data: {response.data}")
        
    except Exception as e:
        print(f"✗ Direct view call error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n=== All diagnostics passed! ===")
    print("The issue might be with:")
    print("1. Server not running")
    print("2. Port conflicts")
    print("3. CORS/CSRF configuration")
    print("4. Frontend request format")
    
    return True

if __name__ == "__main__":
    run_diagnostics()
