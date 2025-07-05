#!/bin/bash

# さくらのレンタルサーバーデプロイスクリプト
# このスクリプトは本番環境での初期セットアップとデプロイを行います

echo "=== さくらのレンタルサーバー デプロイスクリプト ==="

# 1. 環境変数の設定
export DJANGO_SETTINGS_MODULE=oshare_style_answers.settings_production

# 2. 依存関係のインストール
echo "依存関係をインストール中..."
pip3 install --user -r requirements.txt

# 3. 静的ファイルの収集
echo "静的ファイルを収集中..."
python3 manage.py collectstatic --noinput --settings=oshare_style_answers.settings_production

# 4. データベースマイグレーション
echo "データベースマイグレーションを実行中..."
python3 manage.py migrate --settings=oshare_style_answers.settings_production

# 5. 必要なディレクトリの作成
echo "必要なディレクトリを作成中..."
mkdir -p static
mkdir -p media
mkdir -p cache
mkdir -p logs

# 6. パーミッションの設定
echo "パーミッションを設定中..."
chmod 755 static
chmod 755 media
chmod 755 cache
chmod 755 logs
chmod 644 .htaccess
chmod 644 oshare_style_answers/wsgi_production.py

# 7. スーパーユーザーの作成（初回のみ）
echo "スーパーユーザーの作成（初回デプロイ時のみ実行してください）"
echo "python3 manage.py createsuperuser --settings=oshare_style_answers.settings_production"

echo "=== デプロイ完了 ==="
echo ""
echo "次のステップ："
echo "1. さくらのレンタルサーバーのコントロールパネルでPythonアプリケーションを有効化"
echo "2. ドメインの設定を確認"
echo "3. settings_production.py の ALLOWED_HOSTS とドメイン設定を更新"
echo "4. .htaccess のパス設定を実際のパスに更新"
echo "5. 必要に応じてスーパーユーザーを作成"
