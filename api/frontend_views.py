from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from django.views.generic import TemplateView
import os
import re

class ReactAppView(TemplateView):
    """React アプリケーションを提供するビュー"""
    template_name = 'frontend/index.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['debug'] = settings.DEBUG
        return context

def serve_react_build(request):
    """ビルドされたReactアプリを直接提供（静的ファイルパスを修正）"""
    dist_path = os.path.join(settings.BASE_DIR, 'frontend', 'dist', 'index.html')
    
    if os.path.exists(dist_path):
        with open(dist_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # 静的ファイルのパスを Django の静的ファイルURL に変更
        # /assets/ を /static/assets/ に置換
        html_content = re.sub(
            r'(src|href)="(/assets/[^"]+)"',
            r'\1="/static\2"',
            html_content
        )
        
        # タイトルと説明を日本語に変更
        html_content = html_content.replace(
            '<title>oshare-style-answers</title>',
            '<title>おしゃれスタイル回答</title>'
        )
        html_content = html_content.replace(
            'content="Lovable Generated Project"',
            'content="あなたのスタイルに関する質問に答えるWebアプリケーション"'
        )
        
        return HttpResponse(html_content, content_type='text/html')
    else:
        # フォールバック：Djangoテンプレートを使用
        return render(request, 'frontend/index.html', {'debug': settings.DEBUG})
