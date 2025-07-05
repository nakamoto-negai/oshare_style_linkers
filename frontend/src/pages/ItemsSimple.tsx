import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';

const ItemsSimple = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log('ItemsSimple: Starting fetch...');
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:8000/api/items/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
        });
        
        console.log('ItemsSimple: Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('ItemsSimple: Data received:', data);
        
        setItems(Array.isArray(data) ? data : []);
        
      } catch (err) {
        console.error('ItemsSimple: Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-lg">読み込み中...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-red-500 text-lg">エラー: {error}</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">商品一覧（シンプル）</h1>
          
          <div className="mb-4">
            <p>商品数: {items.length}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div key={item.id || index} className="border rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">{item.name || 'No name'}</h3>
                <p className="text-gray-600">ブランド: {item.brand_name || 'No brand'}</p>
                <p className="text-gray-600">価格: ¥{item.price || 'No price'}</p>
                <p className="text-gray-600">サイズ: {item.size || 'No size'}</p>
                <p className="text-gray-600">色: {item.color || 'No color'}</p>
              </div>
            ))}
          </div>
          
          {items.length === 0 && (
            <div className="text-center text-gray-500">
              商品が見つかりません
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ItemsSimple;
