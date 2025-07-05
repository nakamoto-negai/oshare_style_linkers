import re
from django.conf import settings
from django.middleware.csrf import CsrfViewMiddleware
from django.utils.deprecation import MiddlewareMixin

class CSRFExemptMiddleware(MiddlewareMixin):
    """API エンドポイントのCSRF保護を免除するミドルウェア"""
    
    def process_request(self, request):
        # CSRF_EXEMPT_URLS設定をチェック
        if hasattr(settings, 'CSRF_EXEMPT_URLS'):
            # リクエストのパスをチェック
            for exempt_url in settings.CSRF_EXEMPT_URLS:
                if re.match(exempt_url, request.path_info):
                    # CSRFチェックを無効化
                    setattr(request, '_dont_enforce_csrf_checks', True)
                    break
        
        return None
