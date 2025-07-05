import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, ShoppingCart, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  description: string;
  material?: string;
  image_url: string;
  stock_quantity: number;
  is_featured: boolean;
  discount_percentage: number;
}

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [item, setItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/items/${id}/`);
        
        if (!response.ok) {
          throw new Error('商品が見つかりません');
        }
        
        const data = await response.json();
        setItem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '商品の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (item?.stock_quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = async () => {
    if (!item) return;
    
    try {
      setAddingToCart(true);
      
      // TODO: 認証チェック
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast({
          title: "ログインが必要です",
          description: "商品をカートに追加するにはログインしてください。",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8000/api/cart/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          item: item.id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('カートへの追加に失敗しました');
      }

      toast({
        title: "カートに追加しました",
        description: `${item.name} x${quantity} をカートに追加しました。`,
      });

    } catch (err) {
      toast({
        title: "エラー",
        description: err instanceof Error ? err.message : 'カートへの追加に失敗しました',
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = () => {
    if (!item) return;
    
    // カートに追加してから決済画面へ
    addToCart().then(() => {
      navigate('/checkout');
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'like_new': return 'bg-blue-100 text-blue-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">読み込み中...</div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="text-red-500 text-lg">{error || '商品が見つかりません'}</div>
              <Button 
                className="mt-4" 
                onClick={() => navigate('/items')}
              >
                商品一覧に戻る
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <Button 
            variant="outline" 
            className="mb-6"
            onClick={() => navigate('/items')}
          >
            ← 商品一覧に戻る
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 商品画像 */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <img
                    src={item.image_url || '/placeholder-image.jpg'}
                    alt={item.name}
                    className="w-full h-96 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* 商品情報 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{item.brand_name}</Badge>
                    <Badge className={getConditionColor(item.condition)}>
                      {item.condition === 'new' ? '新品' :
                       item.condition === 'like_new' ? 'ほぼ新品' :
                       item.condition === 'good' ? '良い' :
                       item.condition === 'fair' ? '普通' : '悪い'}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{item.name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* 価格 */}
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-blue-600">
                      {formatPrice(item.price)}
                    </span>
                    {item.original_price && item.original_price > item.price && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(item.original_price)}
                        </span>
                        <Badge variant="destructive">
                          {item.discount_percentage}% OFF
                        </Badge>
                      </>
                    )}
                  </div>

                  {/* 商品詳細 */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">サイズ:</span>
                      <span className="ml-2">{item.size}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">色:</span>
                      <span className="ml-2">{item.color}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">カテゴリ:</span>
                      <span className="ml-2">{item.category_name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">在庫:</span>
                      <span className="ml-2">{item.stock_quantity}個</span>
                    </div>
                    {item.material && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">素材:</span>
                        <span className="ml-2">{item.material}</span>
                      </div>
                    )}
                  </div>

                  {/* 商品説明 */}
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">商品説明</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* 数量選択 */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">数量</Label>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="w-20 text-center"
                        min="1"
                        max={item.stock_quantity}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= item.stock_quantity}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-500">
                        / {item.stock_quantity}個
                      </span>
                    </div>
                  </div>

                  {/* 購入ボタン */}
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      size="lg"
                      onClick={buyNow}
                      disabled={item.stock_quantity === 0 || addingToCart}
                    >
                      {item.stock_quantity === 0 ? '在庫切れ' : '今すぐ購入'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      onClick={addToCart}
                      disabled={item.stock_quantity === 0 || addingToCart}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {addingToCart ? 'カートに追加中...' : 'カートに追加'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
