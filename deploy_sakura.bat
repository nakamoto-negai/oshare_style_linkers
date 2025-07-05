@echo off
REM さくらのレンタルサーバーデプロイスクリプト（Windows用）
REM このスクリプトはローカルでの準備作業を行います

echo === さくらのレンタルサーバー デプロイ準備（Windows用） ===

REM 1. 環境変数の設定
set DJANGO_SETTINGS_MODULE=oshare_style_answers.settings_production

REM 2. 静的ファイルの収集
echo 静的ファイルを収集中...
python manage.py collectstatic --noinput --settings=oshare_style_answers.settings_production

REM 3. データベースマイグレーション（ローカルテスト用）
echo データベースマイグレーションをテスト中...
python manage.py migrate --settings=oshare_style_answers.settings_production

REM 4. 必要なディレクトリの作成
echo 必要なディレクトリを作成中...
if not exist static mkdir static
if not exist media mkdir media
if not exist cache mkdir cache
if not exist logs mkdir logs

echo === ローカル準備完了 ===
echo.
echo 次のステップ：
echo 1. ファイルをさくらのレンタルサーバーにアップロード
echo 2. サーバー上で deploy_sakura.sh を実行
echo 3. settings_production.py の設定を確認・更新
echo 4. .htaccess のパス設定を実際のパスに更新

pause
