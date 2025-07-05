"""
さくらのレンタルサーバー用のプロダクション設定
"""

from .settings import *
import os

# DEBUG設定
DEBUG = False

# 本番環境で許可するホスト（さくらのレンタルサーバーのドメインに変更してください）
ALLOWED_HOSTS = [
    'your-domain.sakura.ne.jp',  # ここをあなたのドメインに変更
    'www.your-domain.sakura.ne.jp',  # www付きドメインも追加
    '127.0.0.1',
    'localhost',
]

# セキュリティ設定の強化
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-&+-inj5v&1=a)hj%6ybx@x4h(_-v4c5jdiu_c0+^z_(f5iwz8y')

# HTTPS設定（さくらのレンタルサーバーでSSLを使用する場合）
SECURE_SSL_REDIRECT = False  # さくらのレンタルサーバーではプロキシ経由なのでFalse
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# データベース設定（さくらのレンタルサーバーでMySQLを使用する場合）
# SQLiteのままでも動作しますが、MySQLの方が推奨です
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# MySQLを使用する場合は以下をコメントアウト：
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': os.environ.get('DB_NAME', 'your_database_name'),
#         'USER': os.environ.get('DB_USER', 'your_username'),
#         'PASSWORD': os.environ.get('DB_PASSWORD', 'your_password'),
#         'HOST': os.environ.get('DB_HOST', 'mysql1.db.sakura.ne.jp'),
#         'PORT': os.environ.get('DB_PORT', '3306'),
#         'OPTIONS': {
#             'charset': 'utf8mb4',
#         },
#     }
# }

# 静的ファイル設定
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'static'

# メディアファイル設定
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# CORS設定（本番ドメインに変更）
CORS_ALLOWED_ORIGINS = [
    "https://your-domain.sakura.ne.jp",  # あなたのドメインに変更
    "https://www.your-domain.sakura.ne.jp",  # www付きドメインも追加
]

CORS_ALLOW_CREDENTIALS = True

# CSRF設定
CSRF_TRUSTED_ORIGINS = [
    "https://your-domain.sakura.ne.jp",  # あなたのドメインに変更
    "https://www.your-domain.sakura.ne.jp",  # www付きドメインも追加
]

# ログ設定（本番環境用）
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'production.log',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'ERROR',
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}

# キャッシュ設定
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
        'LOCATION': BASE_DIR / 'cache',
    }
}

# セッション設定
SESSION_COOKIE_SECURE = False  # さくらのレンタルサーバーではプロキシ経由なのでFalse
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_AGE = 3600 * 24 * 7  # 1週間

# CSRF設定
CSRF_COOKIE_SECURE = False  # さくらのレンタルサーバーではプロキシ経由なのでFalse
CSRF_COOKIE_HTTPONLY = True
