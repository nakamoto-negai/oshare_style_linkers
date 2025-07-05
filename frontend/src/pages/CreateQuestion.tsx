import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { accountAPI } from '@/lib/api';
import { ImageIcon, Loader2, ArrowLeft, Send, CheckCircle } from 'lucide-react';

const CreateQuestion = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    reward_points: 10,
    image: null as File | null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categoryOptions = [
    { value: 'styling', label: 'スタイリング' },
    { value: 'coordination', label: 'コーディネート' },
    { value: 'brand', label: 'ブランド' },
    { value: 'size', label: 'サイズ' },
    { value: 'care', label: 'お手入れ' },
    { value: 'trend', label: 'トレンド' },
    { value: 'other', label: 'その他' },
  ];

  const rewardPointsOptions = [
    { value: 10, label: '10ポイント' },
    { value: 20, label: '20ポイント' },
    { value: 50, label: '50ポイント' },
    { value: 100, label: '100ポイント' },
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB制限
        setError('画像ファイルのサイズは5MB以下にしてください。');
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      
      // プレビュー表示
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('タイトルを入力してください。');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('質問内容を入力してください。');
      return;
    }
    
    if (!formData.category) {
      setError('カテゴリを選択してください。');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('=== Question Creation Debug ===');
      console.log('LocalStorage authToken:', localStorage.getItem('authToken'));
      console.log('FormData contents:');
      
      // FormDataを使用してファイルアップロードに対応
      const submitData = new FormData();
      submitData.append('title', formData.title.trim());
      submitData.append('content', formData.content.trim());
      submitData.append('category', formData.category);
      submitData.append('reward_points', formData.reward_points.toString());
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      // FormDataの内容をログ出力
      for (const [key, value] of submitData.entries()) {
        console.log(`  ${key}:`, value);
      }
      console.log('================================');

      await accountAPI.createQuestion(submitData);
      setSuccess(true);
      
      // 3秒後にプロフィールページへリダイレクト（作成した質問を確認するため）
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
      
    } catch (err) {
      console.error('Failed to create question:', err);
      setError('質問の投稿に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="py-20 px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8 text-center">
                <div className="text-green-600 mb-4">
                  <CheckCircle className="w-16 h-16 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">
                  質問を投稿しました！
                </h2>
                <p className="text-green-700 mb-4">
                  他のユーザーからの回答をお待ちください。
                </p>
                <p className="text-green-600 text-sm">
                  まもなくプロフィールページに移動します...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="mb-8">
            <Button
              variant="ghost"
              asChild
              className="mb-4"
            >
              <Link to="/qa">
                <ArrowLeft className="w-4 h-4 mr-2" />
                質問一覧に戻る
              </Link>
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
              質問を投稿
            </h1>
            <p className="text-xl text-gray-600">
              ファッションの疑問を他のユーザーに相談しましょう
            </p>
          </div>

          {/* エラー表示 */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* 質問投稿フォーム */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">質問の詳細</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* タイトル */}
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">
                    タイトル <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="例：このコーディネートをどう思いますか？"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full"
                    maxLength={200}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.title.length}/200文字
                  </p>
                </div>

                {/* カテゴリ */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    カテゴリ <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリを選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 質問内容 */}
                <div>
                  <Label htmlFor="content" className="text-sm font-medium text-gray-700 mb-2 block">
                    質問内容 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="詳しい質問内容を記入してください..."
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="min-h-[150px] resize-none"
                    maxLength={2000}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.content.length}/2000文字
                  </p>
                </div>

                {/* 画像アップロード */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    画像 (任意)
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-sm">画像を選択</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      {formData.image && (
                        <span className="text-sm text-gray-600">
                          {formData.image.name}
                        </span>
                      )}
                    </div>
                    
                    {imagePreview && (
                      <div className="mt-4 relative inline-block">
                        <img
                          src={imagePreview}
                          alt="プレビュー"
                          className="max-w-full h-auto max-h-64 rounded-lg shadow-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, image: null }));
                            setImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                        >
                          ×
                        </Button>
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      JPG、PNG、GIF形式（最大5MB）
                    </p>
                  </div>
                </div>

                {/* 報酬ポイント */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    報酬ポイント
                  </Label>
                  <Select 
                    value={formData.reward_points.toString()} 
                    onValueChange={(value) => handleInputChange('reward_points', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rewardPointsOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    ベストアンサーに選ばれた回答者に付与されるポイントです
                  </p>
                </div>

                {/* 投稿ボタン */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="flex-1"
                  >
                    <Link to="/qa">キャンセル</Link>
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        投稿中...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        質問を投稿
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 投稿のヒント */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">💡 良い質問をするコツ</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-blue-700 space-y-2">
                <li>• 具体的で分かりやすいタイトルを付けましょう</li>
                <li>• 質問の背景や状況を詳しく説明しましょう</li>
                <li>• 画像があると回答者が理解しやすくなります</li>
                <li>• 適切なカテゴリを選択しましょう</li>
                <li>• 礼儀正しく質問しましょう</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreateQuestion;
