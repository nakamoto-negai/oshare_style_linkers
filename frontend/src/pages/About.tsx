
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Users, Sparkles, Heart, TrendingUp, Star, ArrowRight, Globe } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "田中 美咲",
      role: "創設者・CEO",
      description: "ファッション業界での10年の経験を活かし、誰もが気軽におしゃれを楽しめる世界を目指しています。",
      image: "photo-1649972904349-6e44c42644a7"
    },
    {
      name: "佐藤 健太",
      role: "技術責任者・CTO",
      description: "AI技術とファッションの融合により、パーソナライズされた体験を提供します。",
      image: "photo-1488590528505-98d2b5aba04b"
    },
    {
      name: "山田 葵",
      role: "コミュニティマネージャー",
      description: "ユーザー同士のつながりを大切にし、温かいコミュニティづくりを心がけています。",
      image: "photo-1581091226825-a6a2a5aee158"
    }
  ];

  const milestones = [
    {
      year: "2024年1月",
      title: "サービス開始",
      description: "大学生向けファッションQ&Aプラットフォームとしてスタート"
    },
    {
      year: "2024年3月",
      title: "1,000ユーザー達成",
      description: "口コミで広がり、短期間で1,000人のユーザーが参加"
    },
    {
      year: "2024年6月",
      title: "AI機能リリース",
      description: "パーソナライズされたコーディネート提案機能を実装"
    },
    {
      year: "2024年9月",
      title: "古着リサイクル開始",
      description: "サステナブルファッションへの取り組みを本格化"
    }
  ];

  return (
    <Layout>
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              おしゃれアンサーズについて
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ファッションの壁を取り払い、誰もが気軽に自己表現できる社会を実現するため、2024年に設立されました。
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-0 shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-800">ミッション</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  ファッションに対する壁を取り払い、誰もが気軽に自己表現できる環境を提供し、
                  個人の魅力を最大限に引き出すサポートをします。
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-0 shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-800">ビジョン</CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  持続可能なファッション文化を創造し、環境に配慮しながら、
                  すべての人がファッションを通じて自分らしさを表現できる世界を目指します。
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">私たちの価値観</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">包括性</h3>
                <p className="text-gray-600">
                  年齢、性別、体型、経済状況に関係なく、すべての人がファッションを楽しめる環境を作ります
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">持続可能性</h3>
                <p className="text-gray-600">
                  環境に配慮したファッションの普及により、持続可能な社会の実現に貢献します
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">コミュニティ</h3>
                <p className="text-gray-600">
                  ユーザー同士が支え合い、学び合える温かいコミュニティの構築を大切にします
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">チーム紹介</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={`https://images.unsplash.com/${member.image}?w=400&h=300&fit=crop&face`}
                      alt={member.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">{member.name}</CardTitle>
                    <Badge variant="secondary" className="w-fit bg-purple-100 text-purple-800">
                      {member.role}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">これまでの歩み</h2>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{milestone.title}</h3>
                        <Badge variant="outline">{milestone.year}</Badge>
                      </div>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">サービス実績</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600 mb-2">5,847</div>
                <div className="text-gray-600">登録ユーザー数</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">12,934</div>
                <div className="text-gray-600">Q&A投稿数</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">3,456</div>
                <div className="text-gray-600">リサイクル取引数</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">98%</div>
                <div className="text-gray-600">ユーザー満足度</div>
              </div>
            </div>
          </div>

          {/* Future Vision */}
          <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-white mb-16">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-6">未来への展望</h2>
              <p className="text-xl mb-8 opacity-90 max-w-4xl mx-auto">
                2025年には10万人のユーザーコミュニティを形成し、AI技術をさらに発展させて、
                より精度の高いパーソナライズされたファッション提案を実現します。
                また、海外展開も視野に入れ、グローバルなファッションコミュニティの構築を目指します。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">ユーザー拡大</h3>
                  <p className="opacity-90">10万人のコミュニティ形成</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <Sparkles className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">AI技術向上</h3>
                  <p className="opacity-90">より高精度な提案システム</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <Globe className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">グローバル展開</h3>
                  <p className="opacity-90">世界中でサービス提供</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              一緒に未来を作りませんか？
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              おしゃれアンサーズと一緒に、すべての人がファッションを楽しめる世界を作りましょう
            </p>
            <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              今すぐ参加する
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
