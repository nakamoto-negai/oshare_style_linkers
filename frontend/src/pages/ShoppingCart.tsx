import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: number;
  item: {
    id: number;
    name: string;
    brand_name: string;
    price: number;
    image_url: string;
    stock_quantity: number;
  };
  quantity: number;
  total_amount: number;
}

interface CartSummary {
  total_items: number;
  total_amount: number;
  items: CartItem[];
}

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartData, setCartData] = useState<CartSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8000/api/cart/summary/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('カートの読み込みに失敗しました');
      }

      const data = await response.json();
      setCartData(data);
    } catch (err) {
      toast({
        title: "エラー",
        description: err instanceof Error ? err.message : 'カートの読み込みに失敗しました',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    try {
      setUpdating(cartItemId);
      const token = localStorage.getItem('access_token');

      const response = await fetch(`http://localhost:8000/api/cart/${cartItemId}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('数量の更新に失敗しました');
      }

      // カートを再読み込み
      fetchCart();
    } catch (err) {
      toast({
        title: "エラー",
        description: err instanceof Error ? err.message : '数量の更新に失敗しました',
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(`http://localhost:8000/api/cart/${cartItemId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('商品の削除に失敗しました');
      }

      toast({
        title: "削除しました",
        description: "商品をカートから削除しました。",
      });

      // カートを再読み込み
      fetchCart();
    } catch (err) {
      toast({
        title: "エラー",
        description: err instanceof Error ? err.message : '商品の削除に失敗しました',
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch('http://localhost:8000/api/cart/clear/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('カートのクリアに失敗しました');
      }

      toast({
        title: "カートをクリアしました",
        description: "すべての商品をカートから削除しました。",
      });

      fetchCart();
    } catch (err) {
      toast({
        title: "エラー",
        description: err instanceof Error ? err.message : 'カートのクリアに失敗しました',
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(price);
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              <ShoppingBag className="inline-block w-8 h-8 mr-2" />
              ショッピングカート
            </h1>
            {cartData && cartData.items.length > 0 && (
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                カートをクリア
              </Button>
            )}
          </div>

          {!cartData || cartData.items.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-600 mb-2">
                    カートが空です
                  </h2>
                  <p className="text-gray-500 mb-6">
                    商品を追加して、お買い物を始めましょう！
                  </p>
                  <Button 
                    onClick={() => navigate('/items')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    商品を見る
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* カート商品一覧 */}
              <div className="lg:col-span-2 space-y-4">
                {cartData.items.map((cartItem) => (
                  <Card key={cartItem.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={cartItem.item.image_url || '/placeholder-image.jpg'}
                          alt={cartItem.item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {cartItem.item.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {cartItem.item.brand_name}
                          </p>
                          <p className="text-blue-600 font-medium">
                            {formatPrice(cartItem.item.price)}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                            disabled={updating === cartItem.id}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          
                          <span className="font-medium text-lg w-8 text-center">
                            {cartItem.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                            disabled={updating === cartItem.id || cartItem.quantity >= cartItem.item.stock_quantity}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            {formatPrice(cartItem.total_amount)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(cartItem.id)}
                            className="text-red-600 hover:text-red-700 mt-1"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            削除
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 注文概要 */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>注文概要</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>商品数:</span>
                      <span>{cartData.total_items}個</span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>合計:</span>
                      <span className="text-blue-600">
                        {formatPrice(cartData.total_amount)}
                      </span>
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        size="lg"
                        onClick={() => navigate('/checkout')}
                      >
                        レジに進む
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/items')}
                    >
                      買い物を続ける
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShoppingCart;
