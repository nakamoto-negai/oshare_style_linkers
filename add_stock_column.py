#!/usr/bin/env python
"""
商品テーブルに在庫数カラムを追加するスクリプト
"""
import sqlite3
import os

def add_stock_quantity_column():
    db_path = 'db.sqlite3'
    
    if not os.path.exists(db_path):
        print(f"❌ データベースファイル {db_path} が見つかりません")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # カラムが既に存在するかチェック
        cursor.execute("PRAGMA table_info(items_item)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'stock_quantity' in columns:
            print("✓ stock_quantityカラムは既に存在します")
        else:
            # カラムを追加
            cursor.execute("""
                ALTER TABLE items_item 
                ADD COLUMN stock_quantity INTEGER DEFAULT 0
            """)
            print("✓ stock_quantityカラムを追加しました")
        
        # 全商品の在庫を設定
        cursor.execute("""
            UPDATE items_item 
            SET stock_quantity = CASE 
                WHEN price >= 10000 THEN 5
                WHEN price >= 5000 THEN 15
                ELSE 30
            END
            WHERE stock_quantity = 0
        """)
        
        updated_rows = cursor.rowcount
        print(f"✓ {updated_rows}件の商品に在庫を設定しました")
        
        # 確認
        cursor.execute("SELECT name, price, stock_quantity FROM items_item LIMIT 5")
        rows = cursor.fetchall()
        print("\n在庫設定確認（上位5件）:")
        for row in rows:
            print(f"  {row[0]}: 価格{row[1]}円 → 在庫{row[2]}個")
        
        conn.commit()
        conn.close()
        
        print("\n✅ 在庫数の設定が完了しました！")
        
    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")

if __name__ == "__main__":
    add_stock_quantity_column()
