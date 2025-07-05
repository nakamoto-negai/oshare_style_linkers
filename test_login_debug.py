#!/usr/bin/env python
"""
Login debug test script
"""
import os
import sys
import django
import requests
import json

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

def test_login_api():
    """Test login API directly"""
    base_url = "http://localhost:8000"
    
    # Test data
    test_user_data = {
        "username": "testuser123",
        "password": "testpass123"
    }
    
    print("=== LOGIN API DEBUG TEST ===")
    
    # Check if user exists
    try:
        user = User.objects.get(username=test_user_data["username"])
        print(f"✓ User exists: {user.username}")
        print(f"  - ID: {user.id}")
        print(f"  - Email: {user.email}")
        print(f"  - Is Active: {user.is_active}")
    except User.DoesNotExist:
        print("✗ Test user does not exist")
        # Create test user
        print("Creating test user...")
        user = User.objects.create_user(
            username=test_user_data["username"],
            password=test_user_data["password"],
            email="test@example.com"
        )
        print(f"✓ Test user created: {user.username}")
    
    # Check if token exists
    try:
        token = Token.objects.get(user=user)
        print(f"✓ Token exists: {token.key[:10]}...")
    except Token.DoesNotExist:
        token = Token.objects.create(user=user)
        print(f"✓ Token created: {token.key[:10]}...")
    
    # Test login endpoint
    print("\n--- Testing login endpoint ---")
    try:
        response = requests.post(
            f"{base_url}/api/accounts/login/",
            json=test_user_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print("✓ Login successful!")
            print(f"  - Token: {data.get('token', 'N/A')[:10]}...")
            print(f"  - User: {data.get('user', {}).get('username', 'N/A')}")
        else:
            print("✗ Login failed!")
            print(f"Response content: {response.text}")
            
            # Try to parse as JSON
            try:
                error_data = response.json()
                print(f"Error data: {json.dumps(error_data, indent=2)}")
            except:
                print("Could not parse response as JSON")
    
    except requests.exceptions.ConnectionError:
        print("✗ Could not connect to server. Is Django running on port 8000?")
    except Exception as e:
        print(f"✗ Error testing login: {e}")

if __name__ == "__main__":
    test_login_api()
