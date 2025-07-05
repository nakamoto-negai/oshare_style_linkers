
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, MessageCircle, Recycle, TrendingUp, Star, Heart, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <div>
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-20 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-indigo-400/20"></div>
          <div className="relative max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 shadow-lg">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">ファッションの悩み、解決します</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              おしゃれアンサーズ
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              匿名で気軽に相談できる<br />
              <span className="font-semibold text-blue-700">ファッションQ&Aコミュニティ</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                無料で始める
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg rounded-full">
                デモを見るよね
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">匿名で安心</h3>
                <p className="text-gray-600 text-sm">恥ずかしがらずに気軽に相談できる環境</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <MessageCircle className="w-8 h-8 text-cyan-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">専門的アドバイス</h3>
                <p className="text-gray-600 text-sm">ファッション知識豊富な人からの的確な助言</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <Recycle className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-800 mb-2">サステナブル</h3>
                <p className="text-gray-600 text-sm">古着リサイクルで環境にも配慮</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">主な機能</h2>
              <p className="text-xl text-gray-600">あなたのファッションライフをサポートする充実の機能</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">匿名Q&A機能</CardTitle>
                  <CardDescription className="text-gray-600">
                    コーディネートの悩みを匿名で相談。恥ずかしがらずに質問できる安心の環境です。
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-gradient-to-br from-cyan-100 to-cyan-200 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">AIコーデ提案</CardTitle>
                  <CardDescription className="text-gray-600">
                    体型や好みに基づいて、AIが最適なコーディネートを提案します。
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-gradient-to-br from-indigo-100 to-indigo-200 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">コミュニティ機能</CardTitle>
                  <CardDescription className="text-gray-600">
                    フォーラムやチャットでユーザー同士が交流し、ファッション情報を共有できます。
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-gradient-to-br from-teal-100 to-teal-200 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mb-4">
                    <Recycle className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">古着リサイクル</CardTitle>
                  <CardDescription className="text-gray-600">
                    ユーザー間で古着の売買を行い、サステナブルなファッションを促進します。
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Revenue Model Section */}
        <section className="py-20 px-6 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">収益モデル</h2>
              <p className="text-xl text-gray-600">持続可能なビジネス成長を実現</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">仲介手数料</h3>
                <p className="text-gray-600 mb-4">古着売買の仲介手数料として7%を収益化</p>
                <Badge variant="secondary" className="text-lg px-4 py-2">7%</Badge>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">月額利用料</h3>
                <p className="text-gray-600 mb-4">プレミアム機能利用のための月額料金</p>
                <Badge variant="secondary" className="text-lg px-4 py-2">300円/月</Badge>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">広告収入</h3>
                <p className="text-gray-600 mb-4">ブランドとのタイアップ・広告掲載収入</p>
                <Badge variant="secondary" className="text-lg px-4 py-2">成長型</Badge>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
                <h3 className="text-3xl font-bold mb-4">5年後の売上予測</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-2xl font-bold mb-2">1億2,750万円</p>
                    <p className="opacity-90">年商</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold mb-2">8,010万円</p>
                    <p className="opacity-90">利益</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">ユーザーの声</h2>
              <p className="text-xl text-gray-600">実際に使ってみた大学生の感想</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      A
                    </div>
                    <div>
                      <p className="font-semibold">大学2年生</p>
                      <p className="text-sm text-gray-600">文学部</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    「匿名で相談できるから、恥ずかしがらずに質問できました！みんな優しくアドバイスしてくれて、おしゃれが楽しくなりました。」
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      B
                    </div>
                    <div>
                      <p className="font-semibold">大学3年生</p>
                      <p className="text-sm text-gray-600">経済学部</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    「古着リサイクル機能で、着なくなった服を売って新しい服を買えるのが嬉しい！環境にも優しくて一石二鳥です。」
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      C
                    </div>
                    <div>
                      <p className="font-semibold">大学1年生</p>
                      <p className="text-sm text-gray-600">工学部</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    「AIコーデ提案がすごく便利！自分の体型に合ったコーディネートを教えてくれるので、失敗することがなくなりました。」
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              ファッションの悩み、<br />今すぐ解決しませんか？
            </h2>
            <p className="text-xl mb-8 opacity-90">
              匿名で安心、専門家のアドバイスを受けて<br />
              あなたらしいおしゃれを見つけましょう
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              今すぐ無料で始める
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
