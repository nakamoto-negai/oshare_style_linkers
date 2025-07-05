import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, MapPin, CreditCard, Gift, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: number;
  item: {
    id: number;
    name: string;
    brand_name: string;
    price: number;
    image_url: string;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  subtotal: number;
  coupon_discount: number;
  total_amount: number;
  coupon_details?: {
    code: string;
    name: string;
  };
  payment_method_details: {
    name: string;
    payment_type: string;
  };
  shipping_name: string;
  shipping_postal_code: string;
  shipping_address: string;
  shipping_phone: string;
  notes: string;
  order_items: OrderItem[];
  created_at: string;
  updated_at: string;
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:8000/api/orders/${id}/`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('注文情報の取得に失敗しました');
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '注文情報の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: '保留中', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { label: '確認済み', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      processing: { label: '処理中', color: 'bg-purple-100 text-purple-800', icon: Package },
      shipped: { label: '発送済み', color: 'bg-green-100 text-green-800', icon: Truck },
      delivered: { label: '配達完了', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'キャンセル', color: 'bg-red-100 text-red-800', icon: Clock },
      refunded: { label: '返金済み', color: 'bg-gray-100 text-gray-800', icon: Clock },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const IconComponent = statusInfo.icon;

    return (
      <Badge className={statusInfo.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {statusInfo.label}
      </Badge>
    );
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

  if (error || !order) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="text-red-500 text-lg">{error || '注文が見つかりません'}</div>
              <Button 
                className="mt-4" 
                onClick={() => navigate('/orders')}
              >
                注文履歴に戻る
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
          <div className="max-w-4xl mx-auto">
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  注文詳細
                </h1>
                <p className="text-gray-600 mt-1">
                  注文番号: {order.order_number}
                </p>
              </div>
              {getStatusBadge(order.status)}
            </div>

            {/* 注文完了メッセージ */}
            {order.status === 'confirmed' && (
              <Card className="mb-6 border-green-200 bg-green-50">
                <CardContent className="py-6">
                  <div className="flex items-center text-green-800">
                    <CheckCircle className="w-6 h-6 mr-3" />
                    <div>
                      <h3 className="font-semibold">ご注文ありがとうございます！</h3>
                      <p className="text-sm">ご注文を確認いたしました。商品の準備ができ次第、発送いたします。</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 注文商品 */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Package className="inline-block w-5 h-5 mr-2" />
                      注文商品
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={item.item.image_url || '/placeholder-image.jpg'}
                          alt={item.item.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.item.name}</h3>
                          <p className="text-gray-600 text-sm">{item.item.brand_name}</p>
                          <p className="text-sm">
                            {formatPrice(item.unit_price)} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(item.total_price)}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* 配送先情報 */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <MapPin className="inline-block w-5 h-5 mr-2" />
                      配送先情報
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">お名前:</span>
                      <span className="ml-2">{order.shipping_name}</span>
                    </div>
                    <div>
                      <span className="font-medium">郵便番号:</span>
                      <span className="ml-2">{order.shipping_postal_code}</span>
                    </div>
                    <div>
                      <span className="font-medium">住所:</span>
                      <span className="ml-2">{order.shipping_address}</span>
                    </div>
                    <div>
                      <span className="font-medium">電話番号:</span>
                      <span className="ml-2">{order.shipping_phone}</span>
                    </div>
                    {order.notes && (
                      <div>
                        <span className="font-medium">備考:</span>
                        <span className="ml-2">{order.notes}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 注文概要 */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>注文概要</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>小計:</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    
                    {order.coupon_discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>
                          <Gift className="inline w-4 h-4 mr-1" />
                          クーポン割引:
                        </span>
                        <span>-{formatPrice(order.coupon_discount)}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>合計:</span>
                        <span className="text-blue-600">{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 決済情報 */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <CreditCard className="inline-block w-5 h-5 mr-2" />
                      決済情報
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">決済方法:</span>
                      <span className="ml-2">{order.payment_method_details.name}</span>
                    </div>
                    {order.coupon_details && (
                      <div>
                        <span className="font-medium">使用クーポン:</span>
                        <span className="ml-2">{order.coupon_details.code}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 注文日時 */}
                <Card>
                  <CardHeader>
                    <CardTitle>注文情報</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">注文日時:</span>
                      <span className="ml-2">{formatDate(order.created_at)}</span>
                    </div>
                    <div>
                      <span className="font-medium">最終更新:</span>
                      <span className="ml-2">{formatDate(order.updated_at)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* アクションボタン */}
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => navigate('/items')}
                  >
                    商品一覧を見る
                  </Button>
                  
                  {order.status === 'pending' && (
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700"
                      onClick={() => {
                        // TODO: 注文キャンセル機能を実装
                        toast({
                          title: "キャンセル機能",
                          description: "キャンセル機能は準備中です。",
                        });
                      }}
                    >
                      注文をキャンセル
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
