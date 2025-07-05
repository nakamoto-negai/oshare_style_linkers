import sqlite3
import os

# データベースファイルのパス
db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')

if os.path.exists(db_path):
    print(f"データベースファイルが見つかりました: {db_path}")
    
    # SQLiteデータベースに接続
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # テーブル一覧を取得
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("\nテーブル一覧:")
    for table in tables:
        print(f"  - {table[0]}")
    
    # ユーザーテーブルの確認
    try:
        cursor.execute("SELECT id, username, email FROM accounts_user;")
        users = cursor.fetchall()
        print(f"\n--- ユーザー ---")
        print(f"ユーザー数: {len(users)}")
        for user in users:
            print(f"  ID: {user[0]}, Username: {user[1]}, Email: {user[2]}")
    except Exception as e:
        print(f"ユーザーテーブルエラー: {e}")
    
    # 質問テーブルの確認
    try:
        cursor.execute("SELECT id, title, user_id FROM answers_question ORDER BY created_at DESC;")
        questions = cursor.fetchall()
        print(f"\n--- 質問 ---")
        print(f"質問数: {len(questions)}")
        for question in questions:
            print(f"  ID: {question[0]}, Title: {question[1]}, User ID: {question[2]}")
    except Exception as e:
        print(f"質問テーブルエラー: {e}")
    
    # 各ユーザーの質問数を計算
    try:
        cursor.execute("""
            SELECT u.username, COUNT(q.id) as question_count
            FROM accounts_user u
            LEFT JOIN answers_question q ON u.id = q.user_id
            GROUP BY u.id, u.username
            ORDER BY question_count DESC;
        """)
        user_stats = cursor.fetchall()
        print(f"\n--- ユーザー別質問数 ---")
        for stat in user_stats:
            print(f"  {stat[0]}: {stat[1]}件")
    except Exception as e:
        print(f"統計エラー: {e}")
    
    conn.close()
else:
    print(f"データベースファイルが見つかりません: {db_path}")
