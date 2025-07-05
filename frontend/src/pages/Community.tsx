
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Calendar, Star, Heart, TrendingUp, ArrowRight } from 'lucide-react';

const Community = () => {
  const forums = [
    {
      title: "大学生ファッション",
      description: "大学生向けのカジュアルファッション情報を共有",
      members: 1234,
      posts: 567,
      category: "学生向け"
    },
    {
      title: "古着・ヴィンテージ",
      description: "古着の魅力やコーディネート術について",
      members: 890,
      posts: 345,
      category: "古着"
    },
    {
      title: "就活スタイル",
      description: "就職活動に適したファッションアドバイス",
      members: 567,
      posts: 234,
      category: "フォーマル"
    }
  ];

  const events = [
    {
      title: "春のトレンドファッションショー",
      date: "2024年4月15日",
      time: "14:00-16:00",
      participants: 89,
      type: "オンライン"
    },
    {
      title: "古着交換イベント",
      date: "2024年4月20日",
      time: "13:00-17:00",
      participants: 45,
      type: "オフライン"
    },
    {
      title: "就活スタイル相談会",
      date: "2024年4月25日",
      time: "19:00-21:00",
      participants: 67,
      type: "オンライン"
    }
  ];

  return (
    <Layout>
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              コミュニティ
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              ファッション好きが集まるコミュニティで、情報交換やイベントに参加しましょう
            </p>
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full">
              コミュニティに参加
              <Users className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">5,847</div>
              <div className="text-gray-600">コミュニティメンバー</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
              <div className="text-gray-600">アクティブフォーラム</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">234</div>
              <div className="text-gray-600">今月の投稿数</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">15</div>
              <div className="text-gray-600">今月のイベント</div>
            </div>
          </div>

          {/* Popular Forums */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">人気のフォーラム</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {forums.map((forum, index) => (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {forum.category}
                      </Badge>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <CardTitle className="text-xl text-gray-800 mb-2">
                      {forum.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {forum.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="text-sm">{forum.members}人</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">{forum.posts}投稿</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                      参加する
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">今後のイベント</h2>
            <div className="space-y-6">
              {events.map((event, index) => (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                          <div className="flex items-center space-x-4 text-gray-600">
                            <span>{event.date}</span>
                            <span>{event.time}</span>
                            <Badge variant={event.type === 'オンライン' ? 'default' : 'secondary'}>
                              {event.type}
                            </Badge>
                          </div>
                          <div className="flex items-center mt-2 text-gray-500">
                            <Users className="w-4 h-4 mr-1" />
                            <span className="text-sm">{event.participants}人参加予定</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                        参加する
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Community Features */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">コミュニティの特徴</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">リアルタイムチャット</h3>
                <p className="text-gray-600">
                  メンバー同士でリアルタイムにファッション相談や情報交換ができます
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">定期イベント</h3>
                <p className="text-gray-600">
                  ファッションショーや交換会など、様々なイベントを定期開催
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">専門家の参加</h3>
                <p className="text-gray-600">
                  ファッションの専門家も参加し、プロの視点からアドバイス
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">
              一緒にファッションを楽しみませんか？
            </h2>
            <p className="text-xl mb-8 opacity-90">
              活発なコミュニティで新しい出会いとファッションの発見を
            </p>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              今すぐ参加する
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
