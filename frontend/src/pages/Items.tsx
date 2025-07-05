import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { itemAPI } from '@/lib/api';
import { Search, Filter, Heart, Star } from 'lucide-react';

interface Item {
  id: number;
  name: string;
  brand_name: string;
  category_name: string;
  price: number;
  original_price?: number;
  condition: string;
  size: string;
  color: string;
  main_image: string;
  is_featured: boolean;
  discount_percentage: number;
}

interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

const Items = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // フィルター状態
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [sortBy, setSortBy] = useState('');

  console.log('Items component rendering...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('=== Fetching initial data ===');
        
        // 商品データのみを先に取得
        const itemsResponse = await fetch('http://localhost:8000/api/items/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
        });
        
        if (!itemsResponse.ok) {
          throw new Error(`Items API failed: ${itemsResponse.status}`);
        }
        
        const itemsData = await itemsResponse.json();
        console.log('=== Items Data ===', itemsData);
        
        setItems(Array.isArray(itemsData) ? itemsData : []);
        
        // ブランドとカテゴリは後で取得
        try {
          const [brandsResponse, categoriesResponse] = await Promise.all([
            fetch('http://localhost:8000/api/brands/', {
              method: 'GET',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              mode: 'cors',
            }),
            fetch('http://localhost:8000/api/categories/', {
              method: 'GET',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              mode: 'cors',
            })
          ]);
          
          if (brandsResponse.ok) {
            const brandsData = await brandsResponse.json();
            setBrands(Array.isArray(brandsData) ? brandsData : []);
          }
          
          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
          }
        } catch (err) {
          console.warn('Failed to fetch brands/categories:', err);
          // ブランド・カテゴリの取得に失敗しても商品は表示する
        }
        
      } catch (err) {
        console.error('=== Fetch data error ===', err);
        setError(`データの取得に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // フィルター適用（一時的に無効化）
  const applyFilters = async () => {
    console.log('Filters disabled for testing');
    return;
  };

  // 検索・フィルターが変更されたら自動で適用（一時的に無効化）
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     applyFilters();
  //   }, 300); // デバウンス

  //   return () => clearTimeout(timeoutId);
  // }, [searchTerm, selectedBrand, selectedCategory, selectedCondition, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(price);
  };

  const getConditionColor = (condition: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-green-100 text-green-800',
      'like_new': 'bg-blue-100 text-blue-800',
      'good': 'bg-yellow-100 text-yellow-800',
      'fair': 'bg-orange-100 text-orange-800',
      'poor': 'bg-red-100 text-red-800'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-lg">商品を読み込み中...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-red-500 text-lg">エラー: {error}</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              商品一覧
            </h1>
            <p className="text-xl text-gray-600">
              お気に入りのアイテムを見つけよう
            </p>
          </div>

          {/* 検索・フィルター */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* 検索 */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="商品名・ブランドで検索"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* ブランド */}
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="ブランド" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全てのブランド</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* カテゴリ */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全てのカテゴリ</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 状態 */}
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="状態" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全ての状態</SelectItem>
                  <SelectItem value="new">新品</SelectItem>
                  <SelectItem value="like_new">ほぼ新品</SelectItem>
                  <SelectItem value="good">良い</SelectItem>
                  <SelectItem value="fair">普通</SelectItem>
                  <SelectItem value="poor">悪い</SelectItem>
                </SelectContent>
              </Select>

              {/* ソート */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="並び順" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">新着順</SelectItem>
                  <SelectItem value="price">価格（安い順）</SelectItem>
                  <SelectItem value="-price">価格（高い順）</SelectItem>
                  <SelectItem value="name">商品名順</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 商品グリッド */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative overflow-hidden rounded-t-lg">
                  {item.main_image && (
                    <img
                      src={`http://localhost:8000${item.main_image}`}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {item.is_featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">
                      <Star className="w-3 h-3 mr-1" />
                      おすすめ
                    </Badge>
                  )}
                  {item.discount_percentage > 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                      {item.discount_percentage}% OFF
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {item.brand_name}
                    </Badge>
                    <Badge className={`text-xs ${getConditionColor(item.condition)}`}>
                      {item.condition === 'new' ? '新品' :
                       item.condition === 'like_new' ? 'ほぼ新品' :
                       item.condition === 'good' ? '良い' :
                       item.condition === 'fair' ? '普通' : '悪い'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {item.name}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">サイズ: {item.size}</span>
                      <span className="text-sm text-gray-600">色: {item.color}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(item.price)}
                      </span>
                      {item.original_price && item.original_price > item.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(item.original_price)}
                        </span>
                      )}
                    </div>
                    
                    <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      詳細を見る
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {items.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">条件に合う商品が見つかりませんでした</div>
              <div className="text-sm text-gray-400 mt-2">
                デバッグ: {error ? `エラー: ${error}` : '商品データは正常に取得されています'}
              </div>
            </div>
          )}

          {/* デバッグ情報 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
              <strong>デバッグ情報:</strong><br />
              商品数: {items.length}<br />
              ローディング: {loading ? 'Yes' : 'No'}<br />
              エラー: {error || 'None'}<br />
              ブランド数: {brands.length}<br />
              カテゴリ数: {categories.length}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Items;
