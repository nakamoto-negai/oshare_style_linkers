"""
URL configuration for oshare_style_answers project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from api.frontend_views import ReactAppView, serve_react_build
from django.views.static import serve
import os

def api_root(request):
    """API情報を返すルートエンドポイント"""
    return JsonResponse({
        "message": "おしゃれスタイル回答 API",
        "version": "1.0",
        "endpoints": {
            "admin": "/admin/",
            "api_test": "/api/test/",
            "styles": "/api/styles/",
            "app": "/app/"
        },
        "frontend_url": "http://localhost:8080",
        "status": "running"
    })

urlpatterns = [
    path('api/', include('api.urls')),  # API endpoints
    path('api/accounts/', include('accounts.urls')),  # アカウント関連API
    path('api/', include('answers.urls')),  # Q&A関連API
    path('api/', include('payments.urls')),  # 決済関連API
    path('admin/', admin.site.urls),
    path('api-info/', api_root, name='api_root'),  # API情報ページ
    path('app/', ReactAppView.as_view(), name='react_app'),  # React アプリ（開発用）
    path('', serve_react_build, name='frontend_home'),  # ルートでReactアプリを提供
]

# Serve static files in development
if settings.DEBUG:
    # 通常の静的ファイル
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    
    # メディアファイル（アップロード画像）
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # Reactビルドの静的ファイルを提供
    frontend_dist = os.path.join(settings.BASE_DIR, 'frontend', 'dist')
    if os.path.exists(frontend_dist):
        # /static/assets/ パスでassetsを提供
        urlpatterns += [
            path('static/assets/<path:path>', serve, {
                'document_root': os.path.join(frontend_dist, 'assets'),
            }),
        ]
        # favicon.ico などのファイル用
        urlpatterns += static('/favicon.ico', document_root=frontend_dist)
        urlpatterns += static('/robots.txt', document_root=frontend_dist)
