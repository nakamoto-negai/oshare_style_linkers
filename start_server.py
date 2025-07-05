#!/usr/bin/env python
"""
Start Django server with detailed error logging
"""
import os
import sys
import django

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    django.setup()
    print("✓ Django setup successful")
    
    from django.core.management import execute_from_command_line
    
    print("Starting Django development server...")
    execute_from_command_line(['manage.py', 'runserver', '8000', '--verbosity=2'])
    
except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
