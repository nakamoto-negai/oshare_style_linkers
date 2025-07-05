import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { BestAnswerConfirmDialog } from '@/components/BestAnswerConfirmDialog';
import { QuestionDetailSkeleton } from '@/components/QuestionDetailSkeleton';
import ProductSelector from '../components/ProductSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { accountAPI } from '@/lib/api';
import { 
  MessageCircle, Award, Clock, User, ThumbsUp, CheckCircle, 
  Send, ArrowLeft, Eye, Star, ThumbsDown, ImageIcon, ShoppingBag 
} from 'lucide-react';

interface Question {
  id: number;
  title: string;
  content: string;
  category: string;
  category_display: string;
  status: string;
  status_display: string;
  user: {
    id: number;
    username: string;
    first_name: string;
  };
  image?: string;
  views_count: number;
  answers_count: number;
  reward_points: number;
  created_at: string;
  updated_at: string;
  answers: Answer[];
}

interface Answer {
  id: number;
  content: string;
  image?: string; // 回答の画像URL（オプショナル）
  recommended_products?: number[]; // 推奨商品ID配列
  recommended_products_details?: Array<{
    id: number;
    name: string;
    brand_name: string;
    price: number;
    image_url: string | null;
    condition: string;
    size: string;
    color: string;
    is_featured: boolean;
  }>; // 推奨商品詳細情報
  user: {
    id: number;
    username: string;
    first_name: string;
  };
  is_best_answer: boolean;
  helpful_votes: number;
  created_at: string;
  updated_at: string;
  votes: Array<{
    id: number;
    is_helpful: boolean;
    created_at: string;
  }>;
  votes_count: number;
}

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [votingAnswerId, setVotingAnswerId] = useState<number | null>(null);
  const [markingBestAnswerId, setMarkingBestAnswerId] = useState<number | null>(null);
  const [answerImage, setAnswerImage] = useState<File | null>(null);
  const [answerImagePreview, setAnswerImagePreview] = useState<string | null>(null);
  const [showBestAnswerDialog, setShowBestAnswerDialog] = useState(false);
  const [pendingBestAnswerId, setPendingBestAnswerId] = useState<number | null>(null);
  const [pendingBestAnswerUserName, setPendingBestAnswerUserName] = useState<string>('');
  
  // 商品選択用の状態
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  
  // 現在のユーザーが質問者かどうかを判定（実際の実装では認証システムから取得）
  const isQuestionOwner = true; // TODO: 実際の認証システムと連携

  useEffect(() => {
    if (id) {
      fetchQuestionAndAnswers();
    }
  }, [id]);

  const fetchQuestionAndAnswers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 質問詳細を取得（回答も含まれている）
      const questionResponse = await accountAPI.getQuestion(parseInt(id!));
      setQuestion(questionResponse);
      setAnswers(questionResponse.answers || []);
      
    } catch (err) {
      console.error('Failed to fetch question details:', err);
      setError('質問の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim() || !id) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      console.log('=== フロントエンド回答投稿デバッグ ===');
      console.log('LocalStorage authToken:', localStorage.getItem('authToken'));
      console.log('newAnswer:', newAnswer);
      console.log('id:', id, 'type:', typeof id);
      console.log('answerImage:', answerImage);
      console.log('selectedProducts:', selectedProducts);
      if (answerImage) {
        console.log('answerImage.name:', answerImage.name);
        console.log('answerImage.type:', answerImage.type);
        console.log('answerImage.size:', answerImage.size);
      }
      
      // 選択した商品のIDリストを作成
      const productIds = selectedProducts.map(product => product.id);
      
      // 画像がある場合はFormData、ない場合はJSONを使用
      let answerData: any;
      if (answerImage) {
        const formData = new FormData();
        formData.append('content', newAnswer.trim());
        formData.append('question', id);
        formData.append('image', answerImage);
        if (productIds.length > 0) {
          formData.append('recommended_products', JSON.stringify(productIds));
        }
        answerData = formData;
        
        console.log('FormData作成:');
        for (const [key, value] of formData.entries()) {
          console.log(`  ${key}:`, value);
        }
      } else {
        answerData = {
          content: newAnswer.trim(),
          question: parseInt(id),
          ...(productIds.length > 0 && { recommended_products: productIds })
        };
        console.log('JSON data:', answerData);
      }
      
      console.log('APIリクエスト前');
      await accountAPI.createAnswer(answerData);
      console.log('APIリクエスト完了');
      
      // フォームをリセット
      setNewAnswer('');
      setAnswerImage(null);
      setAnswerImagePreview(null);
      setSelectedProducts([]);
      
      // 回答一覧を再取得して即座に反映
      await fetchQuestionAndAnswers();
      
      toast({
        title: "回答を投稿しました",
        description: "ご回答ありがとうございます！",
      });
      
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError('回答の投稿に失敗しました');
      toast({
        title: "投稿に失敗しました",
        description: "回答の投稿に失敗しました。しばらく経ってから再度お試しください。",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAnswerImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAnswerImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setAnswerImage(null);
    setAnswerImagePreview(null);
  };

  const handleVoteAnswer = async (answerId: number, isHelpful: boolean) => {
    try {
      setVotingAnswerId(answerId);
      await accountAPI.voteAnswer(answerId, isHelpful);
      
      // 楽観的更新: 即座にUIを更新
      setAnswers(prevAnswers => 
        prevAnswers.map(answer => 
          answer.id === answerId 
            ? { 
                ...answer, 
                helpful_votes: isHelpful ? answer.helpful_votes + 1 : answer.helpful_votes,
                votes_count: answer.votes_count + 1
              }
            : answer
        )
      );
      
      // バックグラウンドで正確なデータを再取得
      await fetchQuestionAndAnswers();
      
      toast({
        title: "役立った投票をしました",
        description: "投票が反映されました",
      });
      
    } catch (err) {
      console.error('Failed to vote answer:', err);
      setError('投票に失敗しました');
      toast({
        title: "投票に失敗しました",
        description: "投票処理に失敗しました。しばらく経ってから再度お試しください。",
        variant: "destructive",
      });
    } finally {
      setVotingAnswerId(null);
    }
  };

  const handleMarkBestAnswer = async (answerId: number) => {
    try {
      setMarkingBestAnswerId(answerId);
      await accountAPI.markBestAnswer(answerId);
      
      // 楽観的更新: 即座にUIを更新
      setAnswers(prevAnswers => 
        prevAnswers.map(answer => ({
          ...answer,
          is_best_answer: answer.id === answerId
        }))
      );
      
      // 質問詳細を再取得
      await fetchQuestionAndAnswers();
      
      toast({
        title: "ベストアンサーを設定しました",
        description: "ベストアンサーが設定されました",
      });
      
    } catch (err) {
      console.error('Failed to mark best answer:', err);
      setError('ベストアンサーの設定に失敗しました');
      toast({
        title: "ベストアンサー設定に失敗しました",
        description: "ベストアンサーの設定に失敗しました。しばらく経ってから再度お試しください。",
        variant: "destructive",
      });
    } finally {
      setMarkingBestAnswerId(null);
    }
  };

  const handleBestAnswerClick = (answerId: number, userName: string) => {
    setPendingBestAnswerId(answerId);
    setPendingBestAnswerUserName(userName);
    setShowBestAnswerDialog(true);
  };

  const confirmBestAnswer = () => {
    if (pendingBestAnswerId) {
      handleMarkBestAnswer(pendingBestAnswerId);
    }
    setShowBestAnswerDialog(false);
    setPendingBestAnswerId(null);
    setPendingBestAnswerUserName('');
  };

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
    return (
      <Layout>
        <QuestionDetailSkeleton />
      </Layout>
    );
  }

  if (error || !question) {
    return (
      <Layout>
        <div className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error || '質問が見つかりませんでした'}
              </AlertDescription>
            </Alert>
            <Button asChild className="mt-4">
              <Link to="/qa">
                <ArrowLeft className="w-4 h-4 mr-2" />
                質問一覧に戻る
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* パンくずナビ */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link to="/qa">
                <ArrowLeft className="w-4 h-4 mr-2" />
                質問一覧に戻る
              </Link>
            </Button>
          </div>

          {/* 質問詳細 */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`${getCategoryColor(question.category)}`}>
                      {question.category_display}
                    </Badge>
                    <Badge className={`${getStatusColor(question.status)}`}>
                      {question.status_display}
                    </Badge>
                    {question.reward_points > 0 && (
                      <Badge variant="outline">
                        <Award className="w-3 h-3 mr-1" />
                        {question.reward_points}pt
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl leading-tight mb-4">
                    {question.title}
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
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {question.views_count} 閲覧
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none mb-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {question.content}
                </p>
              </div>
              {question.image && (
                <div className="mt-4">
                  <img
                    src={question.image}
                    alt="質問画像"
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* 回答一覧 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              回答 ({answers.length})
            </h2>
            
            {error && (
              <Alert className="border-red-200 bg-red-50 mb-4">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            {answers.length > 0 ? (
              <div className="space-y-6">
                {answers.map((answer) => (
                  <Card 
                    key={answer.id} 
                    className={`transition-all duration-200 ${
                      answer.is_best_answer 
                        ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-md' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {answer.user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{answer.user.username}</div>
                            <div className="text-sm text-gray-500">
                              {formatDate(answer.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {answer.is_best_answer && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              ベストアンサー
                            </Badge>
                          )}
                          {!answer.is_best_answer && isQuestionOwner && question?.status === 'open' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleBestAnswerClick(answer.id, answer.user.username)}
                              disabled={markingBestAnswerId === answer.id}
                              className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                            >
                              <Star className="w-3 h-3 mr-1" />
                              {markingBestAnswerId === answer.id ? '設定中...' : 'ベストアンサーに選ぶ'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none mb-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {answer.content}
                        </p>
                      </div>
                      
                      {/* 回答の画像表示 */}
                      {answer.image && (
                        <div className="mb-4">
                          <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                            <img 
                              src={answer.image} 
                              alt="回答に添付された画像" 
                              className="w-full max-w-md h-auto object-contain mx-auto block"
                              onError={(e) => {
                                console.error('回答画像の読み込みに失敗:', answer.image);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* 推奨商品表示 */}
                      {answer.recommended_products_details && answer.recommended_products_details.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <ShoppingBag className="w-4 h-4" />
                            おすすめ商品
                          </h4>
                          <div className="text-sm text-gray-500 mb-3">
                            回答者がおすすめする商品です
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {answer.recommended_products_details.map((product) => (
                              <div key={product.id} className="border rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
                                <div className="flex items-start space-x-3">
                                  {product.image_url && (
                                    <img
                                      src={product.image_url}
                                      alt={product.name}
                                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-sm font-medium text-gray-900 truncate">
                                      {product.name}
                                    </h5>
                                    <p className="text-xs text-gray-500 mb-1">
                                      {product.brand_name}
                                    </p>
                                    <p className="text-sm font-semibold text-purple-600">
                                      ¥{product.price.toLocaleString()}
                                    </p>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {product.size}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {product.color}
                                      </Badge>
                                      {product.is_featured && (
                                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVoteAnswer(answer.id, true)}
                          disabled={votingAnswerId === answer.id}
                          className="flex items-center gap-1 hover:bg-green-50 hover:border-green-300"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          役立った {answer.helpful_votes > 0 && `(${answer.helpful_votes})`}
                        </Button>
                        {votingAnswerId === answer.id && (
                          <div className="text-sm text-gray-500">投票中...</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-500 text-lg mb-2">
                    まだ回答がありません
                  </div>
                  <div className="text-gray-400 text-sm">
                    最初の回答者になりませんか？
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 回答投稿フォーム */}
          {question.status === 'open' && (
            <Card className="border-purple-200 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Send className="w-5 h-5 text-purple-600" />
                  回答を投稿
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <Textarea
                    placeholder="質問に対する回答を詳しく入力してください..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    rows={6}
                    className="resize-none border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {newAnswer.length}/1000文字
                  </div>
                </div>
                
                {/* 画像アップロード */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    画像を追加（任意）
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="answer-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('answer-image-upload')?.click()}
                      className="flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      画像を選択
                    </Button>
                    {answerImage && (
                      <div className="text-sm text-gray-600">
                        {answerImage.name}
                      </div>
                    )}
                  </div>
                  
                  {answerImagePreview && (
                    <div className="mt-3 relative inline-block">
                      <img
                        src={answerImagePreview}
                        alt="アップロード予定の画像"
                        className="max-w-xs max-h-32 rounded-lg border shadow-sm"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* 商品選択 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    おすすめ商品を選択（任意）
                  </label>
                  <ProductSelector
                    selectedProducts={selectedProducts}
                    onProductsChange={setSelectedProducts}
                    maxProducts={3}
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    回答で紹介したい商品を最大3つまで選択できます
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    回答投稿後は編集できませんのでご注意ください
                  </div>
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!newAnswer.trim() || submitting}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? '投稿中...' : '回答を投稿'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {question.status !== 'open' && (
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="text-center py-8">
                <div className="text-gray-500">
                  この質問は回答受付を終了しています
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* ベストアンサー確認ダイアログ */}
      <BestAnswerConfirmDialog
        open={showBestAnswerDialog}
        onOpenChange={setShowBestAnswerDialog}
        onConfirm={confirmBestAnswer}
        answerUserName={pendingBestAnswerUserName}
      />
    </Layout>
  );
};

export default QuestionDetail;
