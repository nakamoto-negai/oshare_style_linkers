import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { accountAPI } from '@/lib/api';
import { Search, MessageCircle, Award, Clock, User, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Question {
  id: number;
  title: string;
  category: string;
  category_display: string;
  status: string;
  status_display: string;
  user: {
    id: number;
    username: string;
    first_name: string;
  };
  views_count: number;
  answers_count: number;
  reward_points: number;
  created_at: string;
}

const QA = () => {
  console.log('=== QAList Component Start ===');
  console.log('Current URL:', window.location.href);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // フィルター状態
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categoryOptions = [
    { value: 'styling', label: 'スタイリング' },
    { value: 'coordination', label: 'コーディネート' },
    { value: 'brand', label: 'ブランド' },
    { value: 'size', label: 'サイズ' },
    { value: 'care', label: 'お手入れ' },
    { value: 'trend', label: 'トレンド' },
    { value: 'other', label: 'その他' },
  ];

  const statusOptions = [
    { value: 'open', label: '回答受付中' },
    { value: 'closed', label: '解決済み' },
    { value: 'expired', label: '期限切れ' },
  ];

  useEffect(() => {
    console.log('QAList useEffect triggered');
    testAPIConnection();
    fetchQuestions();
  }, []);

  const testAPIConnection = async () => {
    try {
      console.log('Testing API connection...');
      const response = await accountAPI.testAPI();
      console.log('API test successful:', response);
    } catch (err) {
      console.error('API test failed:', err);
    }
  };

  const fetchQuestions = async () => {
    console.log('fetchQuestions called');
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedStatus && selectedStatus !== 'all') params.status = selectedStatus;
      
      console.log('Calling API with params:', params);
      const response = await accountAPI.getQuestions(params);
      console.log('API response:', response);
      console.log('API response type:', typeof response);
      console.log('API response is array:', Array.isArray(response));
      
      if (Array.isArray(response)) {
        setQuestions(response);
      } else if (response && response.results && Array.isArray(response.results)) {
        setQuestions(response.results);
      } else {
        console.warn('Unexpected API response format:', response);
        setQuestions([]);
      }
      
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError('質問の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchQuestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, selectedStatus]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'open': 'bg-green-100 text-green-800',
      'closed': 'bg-blue-100 text-blue-800',
      'expired': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'styling': 'bg-purple-100 text-purple-800',
      'coordination': 'bg-pink-100 text-pink-800',
      'brand': 'bg-blue-100 text-blue-800',
      'size': 'bg-yellow-100 text-yellow-800',
      'care': 'bg-green-100 text-green-800',
      'trend': 'bg-red-100 text-red-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    console.log('Rendering loading state');
    return (
      <Layout>
        <div className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-lg">質問を読み込み中...</div>
            <div className="mt-4 text-sm text-gray-500">
              APIを呼び出し中です...
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    console.log('Rendering error state:', error);
    return (
      <Layout>
        <div className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-red-500 text-lg mb-4">エラー: {error}</div>
            <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600 text-white">
              ページを再読み込み
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  console.log('Rendering QAList with questions:', questions.length, 'loading:', loading);

  return (
    <Layout>
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
              質問・回答
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              ファッションの疑問を解決しよう
            </p>
            <Button 
              asChild 
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              <Link to="/qa/create">
                <Plus className="w-4 h-4 mr-2" />
                質問を投稿
              </Link>
            </Button>
          </div>

          {/* 統計サマリー */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">総質問数</div>
              <div className="text-2xl font-bold">{questions.length}</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">回答受付中</div>
              <div className="text-2xl font-bold">
                {questions.filter(q => q.status === 'open').length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">解決済み</div>
              <div className="text-2xl font-bold">
                {questions.filter(q => q.status === 'closed').length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
              <div className="text-sm opacity-90">総閲覧数</div>
              <div className="text-2xl font-bold">
                {questions.reduce((sum, q) => sum + q.views_count, 0)}
              </div>
            </div>
          </div>

          {/* 検索・フィルター */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 検索 */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="質問を検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* カテゴリ */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* ステータス */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全て</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 質問一覧 */}
          <div className="space-y-6">
            {questions.map((question) => (
              <Card key={question.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`text-xs ${getCategoryColor(question.category)}`}>
                          {question.category_display}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(question.status)}`}>
                          {question.status_display}
                        </Badge>
                        {question.reward_points > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            {question.reward_points}pt
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl leading-tight mb-2 hover:text-purple-600 transition-colors">
                        <Link to={`/qa/${question.id}`}>
                          {question.title}
                        </Link>
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {question.user.username}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(question.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-blue-600">{question.answers_count}</span>
                        <span>回答</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-green-600">{question.views_count}</span>
                        <span>閲覧</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/qa/${question.id}`}>
                        詳細を見る
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {questions.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <div className="text-gray-500 text-lg mb-2">質問が見つかりませんでした</div>
              <div className="text-gray-400">条件を変更して再検索してください</div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default QA;
