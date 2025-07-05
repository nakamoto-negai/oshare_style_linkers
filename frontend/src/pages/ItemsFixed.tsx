import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';

interface Item {
  id: number;
  name: string;
  brand_name: string;
  category_name: string;
  price: number;
  original_price?: number;
  condition: string;
  size: string;
  color: string;
  main_image: string;
  is_featured: boolean;
  discount_percentage: number;
}

const ItemsFixed = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('ItemsFixed component rendering...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('ItemsFixed: Starting fetch...');
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
        
        console.log('ItemsFixed: Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('ItemsFixed: Data received:', data);
        
        setItems(Array.isArray(data) ? data : []);
        
      } catch (err) {
        console.error('ItemsFixed: Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(price);
  };

  const getConditionColor = (condition: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-green-100 text-green-800',
      'like_new': 'bg-blue-100 text-blue-800',
      'good': 'bg-yellow-100 text-yellow-800',
      'fair': 'bg-orange-100 text-orange-800',
      'poor': 'bg-red-100 text-red-800'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  console.log('ItemsFixed: Render state:', { loading, error, itemsCount: items.length });

  if (loading) {
    return (
      <Layout>
        <div className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-lg">商品を読み込み中...</div>
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
          {/* ヘッダー */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              商品一覧
            </h1>
            <p className="text-xl text-gray-600">
              お気に入りのアイテムを見つけよう
            </p>
          </div>

          {/* 商品グリッド */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  {item.main_image ? (
                    <img
                      src={item.main_image}
                      alt={item.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">画像なし</span>
                    </div>
                  )}
                  
                  {item.is_featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                      おすすめ
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {item.brand_name}
                    </Badge>
                    <Badge className={`text-xs ${getConditionColor(item.condition)}`}>
                      {item.condition === 'new' ? '新品' :
                       item.condition === 'like_new' ? 'ほぼ新品' :
                       item.condition === 'good' ? '良い' :
                       item.condition === 'fair' ? '普通' : '悪い'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {item.name}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">サイズ: {item.size}</span>
                      <span className="text-sm text-gray-600">色: {item.color}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(item.price)}
                      </span>
                      {item.original_price && item.original_price > item.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(item.original_price)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        onClick={() => navigate(`/items/${item.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        詳細を見る
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/items/${item.id}`)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">商品が見つかりませんでした</div>
            </div>
          )}

          {/* デバッグ情報 */}
          <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
            <strong>デバッグ情報:</strong><br />
            商品数: {items.length}<br />
            ローディング: {loading ? 'Yes' : 'No'}<br />
            エラー: {error || 'None'}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemsFixed;
