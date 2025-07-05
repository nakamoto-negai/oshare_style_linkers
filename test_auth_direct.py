#!/usr/bin/env python
"""
Test Django authentication endpoints directly
"""
import os
import sys
import django
import json

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    django.setup()
    
    from django.test.client import Client
    from django.contrib.auth import get_user_model
    from rest_framework.authtoken.models import Token
    
    User = get_user_model()
    
    # Create test client
    client = Client()
    
    print("=== Testing Django Authentication Endpoints ===")
    
    # Create test user if doesn't exist
    test_username = "testuser123"
    test_password = "testpass123"
    test_email = "test@example.com"
    
    if not User.objects.filter(username=test_username).exists():
        user = User.objects.create_user(
            username=test_username,
            password=test_password,
            email=test_email
        )
        print(f"✓ Created test user: {user.username}")
    else:
        user = User.objects.get(username=test_username)
        print(f"✓ Test user exists: {user.username}")
    
    # Test login endpoint
    print("\n--- Testing Login Endpoint ---")
    login_data = {
        'username': test_username,
        'password': test_password
    }
    
    try:
        response = client.post(
            '/api/accounts/login/',
            data=json.dumps(login_data),
            content_type='application/json'
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.items())}")
        
        if response.status_code == 200:
            try:
                response_data = json.loads(response.content.decode())
                print("✓ Login successful!")
                print(f"  - Message: {response_data.get('message', 'N/A')}")
                print(f"  - Token: {response_data.get('token', 'N/A')[:10]}...")
                print(f"  - User: {response_data.get('user', {}).get('username', 'N/A')}")
            except json.JSONDecodeError:
                print("✗ Response is not valid JSON")
                print(f"Raw response: {response.content.decode()}")
        else:
            print("✗ Login failed!")
            try:
                error_data = json.loads(response.content.decode())
                print(f"Error: {json.dumps(error_data, indent=2)}")
            except json.JSONDecodeError:
                print(f"Raw error response: {response.content.decode()}")
    
    except Exception as e:
        print(f"✗ Exception during login test: {e}")
        import traceback
        traceback.print_exc()
    
    # Test registration endpoint
    print("\n--- Testing Registration Endpoint ---")
    reg_data = {
        'username': 'newuser123',
        'password': 'newpass123',
        'password_confirm': 'newpass123',
        'email': 'newuser@example.com'
    }
    
    try:
        # Delete user if exists
        User.objects.filter(username=reg_data['username']).delete()
        
        response = client.post(
            '/api/accounts/register/',
            data=json.dumps(reg_data),
            content_type='application/json'
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            try:
                response_data = json.loads(response.content.decode())
                print("✓ Registration successful!")
                print(f"  - Message: {response_data.get('message', 'N/A')}")
                print(f"  - Token: {response_data.get('token', 'N/A')[:10]}...")
                print(f"  - User: {response_data.get('user', {}).get('username', 'N/A')}")
            except json.JSONDecodeError:
                print("✗ Response is not valid JSON")
                print(f"Raw response: {response.content.decode()}")
        else:
            print("✗ Registration failed!")
            try:
                error_data = json.loads(response.content.decode())
                print(f"Error: {json.dumps(error_data, indent=2)}")
            except json.JSONDecodeError:
                print(f"Raw error response: {response.content.decode()}")
    
    except Exception as e:
        print(f"✗ Exception during registration test: {e}")
        import traceback
        traceback.print_exc()

except Exception as e:
    print(f"✗ Setup error: {e}")
    import traceback
    traceback.print_exc()
