#!/usr/bin/env python
"""
決済システムAPIのテストスクリプト
"""
import requests
import json
from datetime import datetime

# APIベースURL
BASE_URL = "http://localhost:8000/api"

def test_api_endpoint(url, method="GET", data=None, headers=None):
    """API エンドポイントをテスト"""
    try:
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        
        if method == "GET":
            response = requests.get(url, headers=headers)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers)
        elif method == "PUT":
            response = requests.put(url, json=data, headers=headers)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers)
        
        print(f"  {method} {url}")
        print(f"  ステータス: {response.status_code}")
        
        if response.status_code < 400:
            try:
                result = response.json()
                if isinstance(result, list):
                    print(f"  結果: {len(result)}件のデータを取得")
                    if result:
                        print(f"  サンプル: {json.dumps(result[0], ensure_ascii=False, indent=2)[:200]}...")
                else:
                    print(f"  結果: {json.dumps(result, ensure_ascii=False, indent=2)[:200]}...")
            except json.JSONDecodeError:
                print(f"  結果: {response.text[:100]}...")
        else:
            print(f"  エラー: {response.text}")
        
        print()
        return response
        
    except requests.exceptions.ConnectionError:
        print(f"  ❌ 接続エラー: サーバーが起動していません")
        print()
        return None
    except Exception as e:
        print(f"  ❌ エラー: {e}")
        print()
        return None

def test_payment_methods():
    """決済方法APIテスト"""
    print("=== 決済方法API テスト ===")
    test_api_endpoint(f"{BASE_URL}/payment-methods/")

def test_coupons():
    """クーポンAPIテスト"""
    print("=== クーポンAPI テスト ===")
    
    # クーポン有効性検証
    print("1. クーポン有効性検証:")
    test_data = {
        "code": "WELCOME10",
        "order_amount": "5000"
    }
    test_api_endpoint(f"{BASE_URL}/coupons/validate/", "POST", test_data)
    
    # 無効なクーポンのテスト
    print("2. 無効なクーポンテスト:")
    invalid_data = {
        "code": "INVALID",
        "order_amount": "5000"
    }
    test_api_endpoint(f"{BASE_URL}/coupons/validate/", "POST", invalid_data)

def test_cart_operations():
    """カート操作APIテスト"""
    print("=== カート操作API テスト ===")
    
    # カート概要取得
    print("1. カート概要取得:")
    test_api_endpoint(f"{BASE_URL}/cart/summary/")
    
    # カート一覧取得
    print("2. カート一覧取得:")
    test_api_endpoint(f"{BASE_URL}/cart/")

def test_items_api():
    """商品APIテスト（在庫確認用）"""
    print("=== 商品API テスト ===")
    test_api_endpoint(f"{BASE_URL}/items/")

def main():
    print("🚀 決済システムAPIテストを開始します")
    print(f"📡 ベースURL: {BASE_URL}")
    print(f"🕐 テスト実行時刻: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    print()
    
    # サーバーの接続確認
    print("=== サーバー接続確認 ===")
    response = test_api_endpoint(f"{BASE_URL}/../api-info/")
    if response is None:
        print("❌ サーバーに接続できません。")
        print("   以下を確認してください:")
        print("   1. Django開発サーバーが起動している（python manage.py runserver）")
        print("   2. ポート8000が利用可能")
        return
    
    # 各APIのテスト
    test_items_api()
    test_payment_methods()
    test_coupons()
    test_cart_operations()
    
    print("=" * 50)
    print("✅ APIテストが完了しました")
    print()
    print("📝 次のステップ:")
    print("   1. 認証が必要なエンドポイントのテスト")
    print("   2. フロントエンドでの決済フロー実装")
    print("   3. 実際の決済処理の統合")

if __name__ == "__main__":
    main()
