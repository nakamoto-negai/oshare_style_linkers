#!/usr/bin/env python
"""
Quick server status and authentication test
"""
import requests
import json
import time

def test_server_status():
    """Test if Django server is running and responding"""
    print("=== Testing Server Status ===")
    
    try:
        # Test basic server response
        response = requests.get('http://localhost:8000/api-info/', timeout=5)
        print(f"Server status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✓ Server is running")
            print(f"  API info: {data}")
        else:
            print(f"✗ Server returned {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to server on port 8000")
        print("Please ensure Django server is running: python manage.py runserver 8000")
        return False
    except Exception as e:
        print(f"✗ Server test error: {e}")
        return False
        
    return True

def test_auth_endpoints():
    """Test authentication endpoints"""
    if not test_server_status():
        return
        
    print("\n=== Testing Authentication Endpoints ===")
    
    # Test data
    test_data = {
        "username": "testuser123",
        "password": "testpass123"
    }
    
    # Test login endpoint
    print("\n--- Testing login endpoint ---")
    try:
        response = requests.post(
            'http://localhost:8000/api/accounts/login/',
            json=test_data,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
        
        if response.status_code == 200:
            data = response.json()
            print("✓ Login successful")
            print(f"Token: {data.get('token', 'N/A')[:10]}...")
        elif response.status_code == 500:
            print("✗ Internal Server Error (500)")
            print("This indicates a server-side issue")
            print(f"Response content: {response.text[:500]}...")
        else:
            print(f"✗ Login failed with status {response.status_code}")
            try:
                error_data = response.json()
                print(f"Error: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Raw response: {response.text[:500]}...")
                
    except Exception as e:
        print(f"✗ Request error: {e}")

if __name__ == "__main__":
    test_auth_endpoints()
