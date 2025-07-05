
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles, Users, Recycle, Star, Heart, TrendingUp, ArrowRight } from 'lucide-react';

const Features = () => {
  return (
    <Layout>
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              充実の機能
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              あなたのファッションライフをサポートする多彩な機能をご紹介します
            </p>
          </div>

          {/* Main Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-gray-800 mb-4">匿名Q&A機能</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  コーディネートの悩みを匿名で相談。恥ずかしがらずに質問できる安心の環境です。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-pink-500 mr-3" />
                    完全匿名での質問投稿
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-pink-500 mr-3" />
                    写真付きでの相談可能
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-pink-500 mr-3" />
                    専門家からの迅速な回答
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-gray-800 mb-4">AIコーデ提案</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  体型や好みに基づいて、AIが最適なコーディネートを提案します。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-purple-500 mr-3" />
                    パーソナライズされた提案
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-purple-500 mr-3" />
                    季節やTPOに応じたコーデ
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-purple-500 mr-3" />
                    予算に合わせた商品紹介
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-indigo-100 to-indigo-200 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-gray-800 mb-4">コミュニティ機能</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  フォーラムやチャットでユーザー同士が交流し、ファッション情報を共有できます。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-indigo-500 mr-3" />
                    テーマ別フォーラム
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-indigo-500 mr-3" />
                    リアルタイムチャット
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-indigo-500 mr-3" />
                    ファッションイベント情報
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-100 to-green-200 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader>
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
                  <Recycle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-gray-800 mb-4">古着リサイクル</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  ユーザー間で古着の売買を行い、サステナブルなファッションを促進します。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-green-500 mr-3" />
                    簡単な出品・購入システム
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-green-500 mr-3" />
                    品質チェック機能
                  </li>
                  <li className="flex items-center">
                    <Star className="w-5 h-5 text-green-500 mr-3" />
                    環境貢献度の可視化
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Additional Features */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">その他の便利機能</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">お気に入り機能</h3>
                <p className="text-gray-600">気に入ったコーデやアイテムを保存</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">トレンド分析</h3>
                <p className="text-gray-600">最新のファッショントレンドを分析</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">レビューシステム</h3>
                <p className="text-gray-600">ユーザーからの評価とレビュー</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">
              すべての機能を無料で体験
            </h2>
            <p className="text-xl mb-8 opacity-90">
              今すぐ登録して、あなたのファッションライフを変えてみませんか？
            </p>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              無料で始める
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Features;
