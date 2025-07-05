import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, MapPin, Gift, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: number;
  item: {
    id: number;
    name: string;
    brand_name: string;
    price: number;
    image_url: string;
  };
  quantity: number;
  total_amount: number;
}

interface CartSummary {
  total_items: number;
  total_amount: number;
  items: CartItem[];
}

interface PaymentMethod {
  id: number;
  name: string;
  payment_type: string;
  processing_fee_rate: number;
  description: string;
}

interface CouponValidation {
  valid: boolean;
  coupon: {
    id: number;
    code: string;
    name: string;
    discount_type: string;
    discount_value: number;
  };
  discount_amount: number;
  final_amount: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cartData, setCartData] = useState<CartSummary | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // フォームデータ
  const [formData, setFormData] = useState({
    shipping_name: '',
    shipping_postal_code: '',
    shipping_address: '',
    shipping_phone: '',
    payment_method_id: '',
    coupon_code: '',
    notes: '',
  });
  
  const [couponValidation, setCouponValidation] = useState<CouponValidation | null>(null);
  const [couponError, setCouponError] = useState<string>('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      // カート情報と決済方法を並行して取得
      const [cartResponse, paymentsResponse] = await Promise.all([
        fetch('http://localhost:8000/api/cart/summary/', {
          headers: { 'Authorization': `Token ${token}` },
        }),
        fetch('http://localhost:8000/api/payment-methods/'),
      ]);

      if (!cartResponse.ok) {
        throw new Error('カート情報の取得に失敗しました');
      }
      
      if (!paymentsResponse.ok) {
        throw new Error('決済方法の取得に失敗しました');
      }

      const cartData = await cartResponse.json();
      const paymentsData = await paymentsResponse.json();

      setCartData(cartData);
      setPaymentMethods(paymentsData);

      // カートが空の場合はカートページにリダイレクト
      if (!cartData.items || cartData.items.length === 0) {
        toast({
          title: "カートが空です",
          description: "商品をカートに追加してください。",
          variant: "destructive",
        });
        navigate('/cart');
      }

    } catch (err) {
      toast({
        title: "エラー",
        description: err instanceof Error ? err.message : 'データの読み込みに失敗しました',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateCoupon = async () => {
    if (!formData.coupon_code.trim() || !cartData) return;

    try {
      setCouponError('');
      const token = localStorage.getItem('access_token');

      const response = await fetch('http://localhost:8000/api/coupons/validate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          code: formData.coupon_code,
          order_amount: cartData.total_amount.toString(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setCouponValidation(data);
        toast({
          title: "クーポンが適用されました",
          description: `${data.discount_amount}円の割引が適用されます。`,
        });
      } else {
        setCouponError(data.error || 'クーポンが無効です');
        setCouponValidation(null);
      }
    } catch (err) {
      setCouponError('クーポンの確認に失敗しました');
      setCouponValidation(null);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitOrder = async () => {
    if (!cartData || !formData.payment_method_id) {
      toast({
        title: "入力エラー",
        description: "必須項目を入力してください。",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('access_token');

      // 注文データを準備
      const orderData = {
        payment_method: parseInt(formData.payment_method_id),
        shipping_name: formData.shipping_name,
        shipping_postal_code: formData.shipping_postal_code,
        shipping_address: formData.shipping_address,
        shipping_phone: formData.shipping_phone,
        notes: formData.notes,
        coupon_code: formData.coupon_code || undefined,
        items: cartData.items.map(item => ({
          item_id: item.item.id.toString(),
          quantity: item.quantity.toString(),
        })),
      };

      const response = await fetch('http://localhost:8000/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '注文の作成に失敗しました');
      }

      const order = await response.json();

      toast({
        title: "注文が完了しました",
        description: `注文番号: ${order.order_number}`,
      });

      // 注文完了ページまたは注文詳細ページにリダイレクト
      navigate(`/orders/${order.id}`);

    } catch (err) {
      toast({
        title: "エラー",
        description: err instanceof Error ? err.message : '注文の処理に失敗しました',
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getFinalAmount = () => {
    if (!cartData) return 0;
    return couponValidation ? couponValidation.final_amount : cartData.total_amount;
  };

  const getDiscountAmount = () => {
    return couponValidation ? couponValidation.discount_amount : 0;
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
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              <CreditCard className="inline-block w-8 h-8 mr-2" />
              お支払い・配送情報
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 注文フォーム */}
              <div className="lg:col-span-2 space-y-6">
                {/* 配送先情報 */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <MapPin className="inline-block w-5 h-5 mr-2" />
                      配送先情報
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shipping_name">お名前 *</Label>
                        <Input
                          id="shipping_name"
                          value={formData.shipping_name}
                          onChange={(e) => handleInputChange('shipping_name', e.target.value)}
                          placeholder="山田 太郎"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="shipping_phone">電話番号 *</Label>
                        <Input
                          id="shipping_phone"
                          value={formData.shipping_phone}
                          onChange={(e) => handleInputChange('shipping_phone', e.target.value)}
                          placeholder="03-1234-5678"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="shipping_postal_code">郵便番号 *</Label>
                      <Input
                        id="shipping_postal_code"
                        value={formData.shipping_postal_code}
                        onChange={(e) => handleInputChange('shipping_postal_code', e.target.value)}
                        placeholder="123-4567"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="shipping_address">住所 *</Label>
                      <Textarea
                        id="shipping_address"
                        value={formData.shipping_address}
                        onChange={(e) => handleInputChange('shipping_address', e.target.value)}
                        placeholder="東京都渋谷区1-1-1 マンション名 101号室"
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 決済方法 */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <CreditCard className="inline-block w-5 h-5 mr-2" />
                      決済方法
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={formData.payment_method_id}
                      onValueChange={(value) => handleInputChange('payment_method_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="決済方法を選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id.toString()}>
                            <div className="flex flex-col">
                              <span>{method.name}</span>
                              {method.processing_fee_rate > 0 && (
                                <span className="text-sm text-gray-500">
                                  手数料: {(method.processing_fee_rate * 100).toFixed(2)}%
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* クーポン */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Gift className="inline-block w-5 h-5 mr-2" />
                      クーポンコード
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        value={formData.coupon_code}
                        onChange={(e) => handleInputChange('coupon_code', e.target.value)}
                        placeholder="クーポンコードを入力"
                      />
                      <Button
                        variant="outline"
                        onClick={validateCoupon}
                        disabled={!formData.coupon_code.trim()}
                      >
                        適用
                      </Button>
                    </div>
                    
                    {couponError && (
                      <div className="flex items-center text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {couponError}
                      </div>
                    )}
                    
                    {couponValidation && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="text-green-800 font-medium">
                          ✓ {couponValidation.coupon.name}
                        </div>
                        <div className="text-green-600 text-sm">
                          {formatPrice(couponValidation.discount_amount)} の割引が適用されます
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 備考 */}
                <Card>
                  <CardHeader>
                    <CardTitle>備考</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="配送に関するご要望などがございましたらお書きください"
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* 注文概要 */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>注文概要</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 商品一覧 */}
                    <div className="space-y-3">
                      {cartData?.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 text-sm">
                          <img
                            src={item.item.image_url || '/placeholder-image.jpg'}
                            alt={item.item.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{item.item.name}</div>
                            <div className="text-gray-500">
                              {formatPrice(item.item.price)} × {item.quantity}
                            </div>
                          </div>
                          <div className="font-medium">
                            {formatPrice(item.total_amount)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>小計:</span>
                        <span>{formatPrice(cartData?.total_amount || 0)}</span>
                      </div>
                      
                      {getDiscountAmount() > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>クーポン割引:</span>
                          <span>-{formatPrice(getDiscountAmount())}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-lg font-semibold">
                        <span>合計:</span>
                        <span className="text-blue-600">
                          {formatPrice(getFinalAmount())}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        size="lg"
                        onClick={submitOrder}
                        disabled={submitting || !formData.payment_method_id || !formData.shipping_name}
                      >
                        {submitting ? '注文処理中...' : '注文を確定する'}
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/cart')}
                    >
                      カートに戻る
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
