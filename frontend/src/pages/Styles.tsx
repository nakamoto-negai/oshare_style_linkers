import { useEffect, useState } from 'react';
import { styleAPI } from '@/lib/api';

interface Style {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

const StylesPage = () => {
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        // まずAPI接続をテスト
        const testResponse = await styleAPI.testConnection();
        console.log('API Test:', testResponse);
        
        // スタイル一覧を取得
        const stylesResponse = await styleAPI.getStyles();
        setStyles(stylesResponse.styles);
      } catch (err) {
        setError('APIとの接続に失敗しました');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStyles();
  }, []);

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">スタイル一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {styles.map((style) => (
          <div key={style.id} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{style.name}</h2>
            <p className="text-gray-600">{style.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StylesPage;
