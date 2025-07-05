import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { CalendarIcon, EditIcon, SaveIcon, XIcon, UserIcon, TrophyIcon, MessageSquareIcon, HeartIcon, EyeIcon, CoinsIcon } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import PointHistory from '../components/PointHistory';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  birth_date: string | null;
  profile_image: string | null;
  points: number;
  total_earned_points: number;
  is_premium: boolean;
  notification_enabled: boolean;
  questions_count: number;
  answers_count: number;
  helpful_answers_count: number;
  date_joined: string;
}

interface Question {
  id: number;
  title: string;
  category: string;
  category_display: string;
  status: string;
  status_display: string;
  user_name: string;
  views_count: number;
  answers_count: number;
  reward_points: number;
  created_at: string;
}

interface Answer {
  id: number;
  content: string;
  image?: string;
  user_name: string;
  user_profile_image?: string;
  question_title: string;
  question_id: number;
  is_helpful: boolean;
  is_best_answer: boolean;
  helpful_votes: number;
  created_at: string;
  updated_at: string;
}

export default function Profile() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    birth_date: '',
    notification_enabled: true
  });

  useEffect(() => {
    if (user && token) {
      console.log('Profile useEffect: user and token available', { user, token });
      fetchProfile();
      fetchUserQuestions();
      fetchUserAnswers();
      
      // デバッグ情報を取得
      fetchDebugInfo();
    }
  }, [user, token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/profile/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          bio: data.bio || '',
          birth_date: data.birth_date || '',
          notification_enabled: data.notification_enabled
        });
      } else {
        toast({
          title: "エラー",
          description: "プロフィール情報の取得に失敗しました",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast({
        title: "エラー",
        description: "ネットワークエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDebugInfo = async () => {
    try {
      console.log('=== Debug API Request ===');
      console.log('User:', user);
      console.log('Token:', token);
      console.log('LocalStorage authToken:', localStorage.getItem('authToken'));
      
      const response = await fetch('http://localhost:8000/api/accounts/debug/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Debug API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('=== Debug API Response ===');
        console.log('Full response:', data);
        console.log('User info:', data.user_info);
        console.log('Questions count:', data.questions.count);
        console.log('Questions data:', data.questions.data);
        console.log('Database info:', data.database_info);
        console.log('========================');
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch debug info:', response.status, errorText);
      }
    } catch (error) {
      console.error('Debug fetch error:', error);
    }
  };

  const fetchUserQuestions = async () => {
    try {
      console.log('Fetching user questions...');
      const response = await fetch('http://localhost:8000/api/accounts/my-questions/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Questions API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Questions API response:', data);
        console.log('Questions array length:', data.length || 0);
        setQuestions(data.results || data);
      } else {
        console.error('Failed to fetch questions:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        toast({
          title: "エラー",
          description: "質問の取得に失敗しました",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Questions fetch error:', error);
      toast({
        title: "エラー",
        description: "ネットワークエラーが発生しました",
        variant: "destructive",
      });
    }
  };

  const fetchUserAnswers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/my-answers/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Answers API response:', data); // デバッグ用
        setAnswers(data.results || data);
      } else {
        console.error('Failed to fetch answers:', response.status);
      }
    } catch (error) {
      console.error('Answers fetch error:', error);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:8000/api/accounts/profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        toast({
          title: "成功",
          description: "プロフィールを更新しました",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "エラー",
          description: "プロフィールの更新に失敗しました",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "エラー",
        description: "ネットワークエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        birth_date: profile.birth_date || '',
        notification_enabled: profile.notification_enabled
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'closed': return 'secondary';
      case 'resolved': return 'secondary'; // 'success' -> 'secondary'
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return '回答受付中';
      case 'closed': return 'クローズ';
      case 'resolved': return '解決済み';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg text-gray-600">プロフィール情報が見つかりません</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* プロフィール情報カード */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.profile_image || undefined} />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                    {profile.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{profile.username}</CardTitle>
              <CardDescription>
                {profile.first_name && profile.last_name && 
                  `${profile.first_name} ${profile.last_name}`
                }
              </CardDescription>
              {profile.is_premium && (
                <Badge variant="secondary" className="w-fit mx-auto mt-2">
                  ✨ プレミアム会員
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* ポイント情報 */}
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{profile.points}</div>
                <div className="text-sm text-gray-600">現在のポイント</div>
                <div className="text-xs text-gray-500 mt-1">
                  累計: {profile.total_earned_points} ポイント
                </div>
              </div>

              {/* 統計情報 */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2">
                  <MessageSquareIcon className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                  <div className="text-lg font-semibold">{profile.questions_count}</div>
                  <div className="text-xs text-gray-600">質問</div>
                </div>
                <div className="p-2">
                  <MessageSquareIcon className="w-5 h-5 mx-auto mb-1 text-green-500" />
                  <div className="text-lg font-semibold">{profile.answers_count}</div>
                  <div className="text-xs text-gray-600">回答</div>
                </div>
                <div className="p-2">
                  <HeartIcon className="w-5 h-5 mx-auto mb-1 text-red-500" />
                  <div className="text-lg font-semibold">{profile.helpful_answers_count}</div>
                  <div className="text-xs text-gray-600">役立った回答</div>
                </div>
              </div>

              {/* 登録日 */}
              <div className="text-center text-sm text-gray-600">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                登録日: {formatDate(profile.date_joined)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* メインコンテンツ */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="questions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="questions">質問一覧</TabsTrigger>
              <TabsTrigger value="answers">回答一覧</TabsTrigger>
              <TabsTrigger value="profile">プロフィール</TabsTrigger>
              <TabsTrigger value="points">ポイント履歴</TabsTrigger>
            </TabsList>

            {/* プロフィール編集タブ */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>プロフィール詳細</CardTitle>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <EditIcon className="w-4 h-4 mr-2" />
                        編集
                      </Button>
                    ) : (
                      <div className="space-x-2">
                        <Button onClick={handleSaveProfile} size="sm" disabled={saving}>
                          <SaveIcon className="w-4 h-4 mr-2" />
                          {saving ? '保存中...' : '保存'}
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline" size="sm">
                          <XIcon className="w-4 h-4 mr-2" />
                          キャンセル
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isEditing ? (
                    // 表示モード
                    <>
                      <div>
                        <Label className="text-sm font-medium">ユーザー名</Label>
                        <div className="mt-1 text-sm">{profile.username}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">メールアドレス</Label>
                        <div className="mt-1 text-sm">{profile.email}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">名前</Label>
                          <div className="mt-1 text-sm">{profile.first_name || '未設定'}</div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">苗字</Label>
                          <div className="mt-1 text-sm">{profile.last_name || '未設定'}</div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">生年月日</Label>
                        <div className="mt-1 text-sm">
                          {profile.birth_date ? formatDate(profile.birth_date) : '未設定'}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">自己紹介</Label>
                        <div className="mt-1 text-sm whitespace-pre-wrap">
                          {profile.bio || '自己紹介が設定されていません'}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">通知設定</Label>
                        <div className="mt-1 text-sm">
                          {profile.notification_enabled ? '有効' : '無効'}
                        </div>
                      </div>
                    </>
                  ) : (
                    // 編集モード
                    <>
                      <div>
                        <Label htmlFor="username">ユーザー名</Label>
                        <Input id="username" value={profile.username} disabled />
                        <div className="text-xs text-gray-500 mt-1">ユーザー名は変更できません</div>
                      </div>
                      <div>
                        <Label htmlFor="email">メールアドレス</Label>
                        <Input id="email" value={profile.email} disabled />
                        <div className="text-xs text-gray-500 mt-1">メールアドレスは変更できません</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="first_name">名前</Label>
                          <Input
                            id="first_name"
                            value={editForm.first_name}
                            onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="last_name">苗字</Label>
                          <Input
                            id="last_name"
                            value={editForm.last_name}
                            onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="birth_date">生年月日</Label>
                        <Input
                          id="birth_date"
                          type="date"
                          value={editForm.birth_date}
                          onChange={(e) => setEditForm({...editForm, birth_date: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">自己紹介</Label>
                        <Textarea
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                          placeholder="自己紹介を入力してください..."
                          rows={4}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="notification_enabled"
                          checked={editForm.notification_enabled}
                          onChange={(e) => setEditForm({...editForm, notification_enabled: e.target.checked})}
                          className="rounded"
                        />
                        <Label htmlFor="notification_enabled">通知を受け取る</Label>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 質問一覧タブ */}
            <TabsContent value="questions">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>投稿した質問</CardTitle>
                      <CardDescription>あなたが投稿した質問の一覧です</CardDescription>
                    </div>
                    <Button 
                      onClick={() => navigate('/qa/create')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      質問を投稿
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {questions.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquareIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">まだ質問を投稿していません</p>
                      <Button 
                        onClick={() => navigate('/qa/create')}
                        variant="outline"
                      >
                        最初の質問を投稿する
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {questions.map((question) => (
                        <div 
                          key={question.id} 
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => navigate(`/qa/${question.id}`)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-medium text-lg text-blue-600 hover:text-blue-800">
                              {question.title}
                            </h3>
                            <Badge variant={getStatusBadgeColor(question.status)}>
                              {getStatusText(question.status)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">{question.category_display}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <EyeIcon className="w-4 h-4" />
                              <span>{question.views_count} 閲覧</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquareIcon className="w-4 h-4" />
                              <span>{question.answers_count} 件の回答</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CoinsIcon className="w-4 h-4 text-yellow-500" />
                              <span>{question.reward_points}pt</span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            投稿日: {formatDate(question.created_at)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 回答一覧タブ */}
            <TabsContent value="answers">
              <Card>
                <CardHeader>
                  <CardTitle>投稿した回答</CardTitle>
                  <CardDescription>あなたが投稿した回答の一覧です</CardDescription>
                </CardHeader>
                <CardContent>
                  {answers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      まだ回答を投稿していません
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {answers.map((answer) => (
                        <div key={answer.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">回答:</span>
                              <span 
                                className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                                onClick={() => navigate(`/qa/${answer.question_id}`)}
                              >
                                {answer.question_title}
                              </span>
                              {answer.is_best_answer && (
                                <Badge variant="secondary">
                                  <TrophyIcon className="w-3 h-3 mr-1" />
                                  ベストアンサー
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 mb-3 line-clamp-3">
                            {answer.content}
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>{formatDate(answer.created_at)}</span>
                            <div className="flex items-center space-x-2">
                              <HeartIcon className="w-4 h-4" />
                              <span>{answer.helpful_votes} 役立った</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ポイント履歴タブ */}
            <TabsContent value="points">
              <PointHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
