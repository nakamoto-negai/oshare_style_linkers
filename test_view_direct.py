#!/usr/bin/env python
"""
Minimal test to isolate the 500 error issue
"""
import os
import sys
import django

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

print("Setting up Django...")
try:
    django.setup()
    print("✓ Django setup successful")
except Exception as e:
    print(f"✗ Django setup failed: {e}")
    sys.exit(1)

from django.http import HttpRequest
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from accounts.views import login_view
import json

User = get_user_model()

# Create test user
test_username = "testuser123"
test_password = "testpass123"

if not User.objects.filter(username=test_username).exists():
    user = User.objects.create_user(
        username=test_username,
        password=test_password,
        email="test@example.com"
    )
    print(f"✓ Created test user: {user.username}")
else:
    print(f"✓ Test user exists")

# Test the login view directly
print("\n--- Direct view test ---")
factory = APIRequestFactory()

login_data = {
    'username': test_username,
    'password': test_password
}

try:
    # Create a POST request
    request = factory.post(
        '/api/accounts/login/',
        data=login_data,
        format='json'
    )
    
    print("✓ Request created")
    
    # Call the view directly
    response = login_view(request)
    
    print(f"✓ View called successfully")
    print(f"Status code: {response.status_code}")
    print(f"Response data: {response.data}")
    
except Exception as e:
    print(f"✗ Error calling view directly: {e}")
    import traceback
    traceback.print_exc()

print("\nDone.")
