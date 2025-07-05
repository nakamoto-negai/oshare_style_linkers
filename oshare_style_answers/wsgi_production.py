"""
さくらのレンタルサーバー用WSGI設定

さくらのレンタルサーバーでPythonアプリケーションを動作させるための
WSGI設定ファイルです。
"""

import os
import sys
from django.core.wsgi import get_wsgi_application

# プロジェクトのパスを追加
project_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_path)

# 本番環境の設定を使用
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'oshare_style_answers.settings_production')

application = get_wsgi_application()
