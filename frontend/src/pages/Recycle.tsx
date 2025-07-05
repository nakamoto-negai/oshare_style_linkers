

import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Recycle, Leaf, Heart, Star, TrendingUp, ShoppingBag, ArrowRight } from 'lucide-react';

const RecyclePage = () => {
  const items = [
    {
      id: 1,
      title: "ヴィンテージデニムジャケット",
      price: "¥3,500",
      originalPrice: "¥12,000",
      condition: "良好",
      size: "M",
      seller: "ユーザーA",
      image: "photo-1649972904349-6e44c42644a7",
      likes: 24
    },
    {
      id: 2,
      title: "ブランドニット",
      price: "¥2,800",
      originalPrice: "¥8,000",
      condition: "美品",
      size: "S",
      seller: "ユーザーB",
      image: "photo-1488590528505-98d2b5aba04b",
      likes: 18
    },
    {
      id: 3,
      title: "カジュアルワンピース",
      price: "¥1,500",
      originalPrice: "¥5,500",
      condition: "良好",
      size: "L",
      seller: "ユーザーC",
      image: "photo-1581091226825-a6a2a5aee158",
      likes: 32
    }
  ];

  return (
    <Layout>
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-6">
              古着リサイクル
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              着なくなった服を新しい人に託し、サステナブルなファッションライフを実現しましょう
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-full">
                服を出品する
                <ShoppingBag className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-green-300 text-green-700 hover:bg-green-50 px-8 py-4 text-lg rounded-full">
                商品を探す
              </Button>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">15,247</div>
              <div className="text-gray-600">リサイクルされた服</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">2.3t</div>
              <div className="text-gray-600">CO2削減量</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">890万</div>
              <div className="text-gray-600">節約金額（円）</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">3,456</div>
              <div className="text-gray-600">アクティブユーザー</div>
            </div>
          </div>

          {/* Featured Items */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">注目のアイテム</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {items.map((item) => (
                <Card key={item.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative">
                    <img 
                      src={`https://images.unsplash.com/${item.image}?w=400&h=300&fit=crop`}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-xs ml-1">{item.likes}</span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">{item.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">{item.price}</span>
                      <span className="text-sm text-gray-500 line-through">{item.originalPrice}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {item.condition}
                      </Badge>
                      <Badge variant="outline">
                        サイズ{item.size}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">出品者: {item.seller}</span>
                      <Button size="sm" className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white">
                        詳細を見る
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">リサイクルの流れ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">出品・検索</h3>
                <p className="text-gray-600">
                  着なくなった服を出品するか、欲しいアイテムを検索します
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">マッチング</h3>
                <p className="text-gray-600">
                  お互いが納得する条件でマッチング。安全な取引をサポート
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">配送・完了</h3>
                <p className="text-gray-600">
                  配送手続きをして取引完了。環境への貢献度も可視化されます
                </p>
              </div>
            </div>
          </div>

          {/* Sustainability Impact */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">環境への貢献</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-green-100 to-teal-100 border-0 shadow-xl">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">CO2削減効果</CardTitle>
                  <CardDescription className="text-gray-600">
                    古着1着をリサイクルすることで、新品製造時の約60%のCO2削減に貢献
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 border-0 shadow-xl">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                    <Recycle className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">資源の有効活用</CardTitle>
                  <CardDescription className="text-gray-600">
                    廃棄される衣類を減らし、限りある資源を最大限に活用します
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">リサイクルのメリット</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">節約効果</h3>
                <p className="text-gray-600">新品の30-70%オフで購入可能</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">環境保護</h3>
                <p className="text-gray-600">CO2削減に直接貢献</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">ユニーク性</h3>
                <p className="text-gray-600">他にはない個性的なアイテム</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">社会貢献</h3>
                <p className="text-gray-600">持続可能な社会づくりに参加</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">
              一緒にサステナブルな未来を作りませんか？
            </h2>
            <p className="text-xl mb-8 opacity-90">
              あなたの一着が、誰かの新しいお気に入りになります
            </p>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              今すぐ始める
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecyclePage;
