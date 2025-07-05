# さくらのレンタルサーバーデプロイガイド

このドキュメントでは、Djangoアプリケーションをさくらのレンタルサーバーにデプロイする手順を説明します。

## 前提条件

- さくらのレンタルサーバー（スタンダード以上のプラン）
- Python 3.x が利用可能
- FTPまたはSSHアクセス
- 独自ドメインまたはさくらのサブドメイン

## デプロイ手順

### 1. ローカルでの準備

#### Windows環境の場合：
```cmd
deploy_sakura.bat
```

#### Linux/Mac環境の場合：
```bash
chmod +x deploy_sakura.sh
./deploy_sakura.sh
```

### 2. ファイルのアップロード

以下のファイルとディレクトリをさくらのレンタルサーバーの`www`ディレクトリにアップロードします：

```
www/
├── .htaccess
├── manage.py
├── requirements.txt
├── deploy_sakura.sh
├── db.sqlite3
├── oshare_style_answers/
├── accounts/
├── answers/
├── api/
├── items/
├── payments/
├── templates/
├── media/
└── static/ (collectstaticで生成される)
```

### 3. サーバー上での設定

1. SSHでサーバーにアクセス（または管理画面でPythonを有効化）

2. デプロイスクリプトを実行：
```bash
cd ~/www
chmod +x deploy_sakura.sh
./deploy_sakura.sh
```

3. スーパーユーザーの作成：
```bash
python3 manage.py createsuperuser --settings=oshare_style_answers.settings_production
```

### 4. 設定の更新

#### settings_production.py の更新

```python
# あなたのドメインに変更
ALLOWED_HOSTS = [
    'your-domain.sakura.ne.jp',  # ここを実際のドメインに変更
    'www.your-domain.sakura.ne.jp',
]

# CORS設定も同様に更新
CORS_ALLOWED_ORIGINS = [
    "https://your-domain.sakura.ne.jp",
    "https://www.your-domain.sakura.ne.jp",
]

CSRF_TRUSTED_ORIGINS = [
    "https://your-domain.sakura.ne.jp",
    "https://www.your-domain.sakura.ne.jp",
]
```

#### .htaccess の更新

```apache
# パスを実際のものに変更
WSGIDaemonProcess django python-path=/home/your-username/www
WSGIScriptAlias / /home/your-username/www/oshare_style_answers/wsgi_production.py

Alias /static /home/your-username/www/static
Alias /media /home/your-username/www/media
```

### 5. データベース設定（MySQL使用の場合）

さくらのレンタルサーバーでMySQLを使用する場合は、`settings_production.py`で以下を設定：

```python
# requirements.txt に mysqlclient を追加
# pip3 install --user mysqlclient

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_database_name',
        'USER': 'your_username', 
        'PASSWORD': 'your_password',
        'HOST': 'mysql1.db.sakura.ne.jp',  # さくらのMySQLサーバー
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}
```

### 6. フロントエンド（React/Vue）のビルド

フロントエンドがある場合は、ローカルでビルドしてからアップロード：

```bash
cd frontend
npm run build
# または
bun run build
```

生成された`dist`ディレクトリの内容を`static`ディレクトリにコピー。

## トラブルシューティング

### よくある問題と解決方法

1. **500 Internal Server Error**
   - ログファイル（`production.log`）を確認
   - パーミッションを確認
   - パスの設定を確認

2. **静的ファイルが読み込まれない**
   - `collectstatic`を再実行
   - `.htaccess`のAlias設定を確認

3. **データベース接続エラー**
   - MySQL接続情報を確認
   - データベースが作成されているか確認

4. **CSRF/CORS エラー**
   - `ALLOWED_HOSTS`の設定を確認
   - ドメイン設定が正しいか確認

## セキュリティ設定

### SSL/HTTPS設定

さくらのレンタルサーバーでSSLを有効にした場合：

```python
# settings_production.py で
SECURE_SSL_REDIRECT = True  # HTTPからHTTPSへリダイレクト
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
```

### 環境変数の設定

機密情報は環境変数で管理：

```python
# .env ファイルを作成して
SECRET_KEY=your-secret-key-here
DB_PASSWORD=your-db-password-here

# settings_production.py で
import os
from pathlib import Path

# .envファイルを読み込み
env_path = Path('.') / '.env'
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if '=' in line:
                key, value = line.strip().split('=', 1)
                os.environ.setdefault(key, value)

SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback-secret-key')
```

## 更新作業

アプリケーションを更新する場合：

1. 新しいファイルをアップロード
2. マイグレーションを実行：
   ```bash
   python3 manage.py migrate --settings=oshare_style_answers.settings_production
   ```
3. 静的ファイルを更新：
   ```bash
   python3 manage.py collectstatic --noinput --settings=oshare_style_answers.settings_production
   ```

## 監視とメンテナンス

- ログファイル（`production.log`）を定期的に確認
- データベースのバックアップを定期的に取得
- 静的ファイルとメディアファイルのバックアップを取得

## サポート

問題が発生した場合は、以下を確認してください：

1. さくらインターネットのサポートドキュメント
2. Djangoの公式ドキュメント
3. ログファイルの内容
4. サーバーの設定状況
