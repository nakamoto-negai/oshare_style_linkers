
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Heart, Star, User, Clock, ArrowRight } from 'lucide-react';

const QA = () => {
  const questions = [
    {
      id: 1,
      title: "大学の入学式にふさわしいコーディネートを教えてください",
      content: "来月大学の入学式があります。フォーマルすぎず、でもきちんと見える服装を知りたいです。身長160cm、普通体型の女性です。",
      answers: 12,
      votes: 45,
      tags: ["入学式", "フォーマル", "女性"],
      timeAgo: "2時間前"
    },
    {
      id: 2,
      title: "古着を使ったおしゃれなコーディネート例",
      content: "古着に興味があるのですが、どうやって組み合わせればおしゃれに見えるか分かりません。初心者向けのアドバイスをお願いします。",
      answers: 8,
      votes: 32,
      tags: ["古着", "初心者", "コーディネート"],
      timeAgo: "5時間前"
    },
    {
      id: 3,
      title: "春のトレンドカラーを取り入れたい",
      content: "今年の春のトレンドカラーを教えてください。どんなアイテムに取り入れると良いでしょうか？",
      answers: 15,
      votes: 67,
      tags: ["春", "トレンド", "カラー"],
      timeAgo: "1日前"
    }
  ];

  return (
    <Layout>
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              ファッションQ&A
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              匿名で気軽にファッションの悩みを相談し、専門家や他のユーザーからアドバイスを受けられます
            </p>
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full">
              質問を投稿する
              <MessageCircle className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">2,547</div>
              <div className="text-gray-600">質問数</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">8,932</div>
              <div className="text-gray-600">回答数</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">1,234</div>
              <div className="text-gray-600">アクティブユーザー</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">解決率</div>
            </div>
          </div>

          {/* Popular Questions */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">人気の質問</h2>
            <div className="space-y-6">
              {questions.map((question) => (
                <Card key={question.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-800 mb-2 hover:text-purple-600 cursor-pointer">
                          {question.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 mb-4">
                          {question.content}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center text-gray-500">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">{question.answers}件の回答</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Heart className="w-4 h-4 mr-1" />
                          <span className="text-sm">{question.votes}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">{question.timeAgo}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-purple-600 border-purple-300 hover:bg-purple-50">
                        回答する
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">使い方</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">質問を投稿</h3>
                <p className="text-gray-600">
                  匿名でファッションの悩みを投稿。写真付きでも相談可能です。
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">回答を受ける</h3>
                <p className="text-gray-600">
                  専門家や他のユーザーから的確なアドバイスを受けられます。
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">実践・共有</h3>
                <p className="text-gray-600">
                  アドバイスを実践し、結果をコミュニティで共有しましょう。
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">
              あなたの質問をお待ちしています
            </h2>
            <p className="text-xl mb-8 opacity-90">
              どんな些細なことでも気軽に相談してください
            </p>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              今すぐ質問する
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QA;
