import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Plus, X, ShoppingBag, Star } from 'lucide-react';
import { itemAPI } from '@/lib/api';

interface Item {
  id: number;
  name: string;
  brand_name: string;
  category_name: string;
  price: number;
  original_price?: number;
  image_url: string | null;
  condition: string;
  size: string;
  color: string;
  is_featured: boolean;
  discount_percentage: number;
}

interface ProductSelectorProps {
  selectedProducts: Item[];
  onProductsChange: (products: Item[]) => void;
  maxProducts?: number;
}

export default function ProductSelector({ 
  selectedProducts, 
  onProductsChange, 
  maxProducts = 3 
}: ProductSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // 商品検索
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await itemAPI.getItems({ search: query, page_size: 10 });
      setSearchResults(response.results || response);
    } catch (error) {
      console.error('Failed to search products:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 検索クエリが変更されたときの処理
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // 商品を選択に追加
  const addProduct = (product: Item) => {
    if (selectedProducts.length >= maxProducts) return;
    if (selectedProducts.find(p => p.id === product.id)) return;
    
    onProductsChange([...selectedProducts, product]);
  };

  // 商品を選択から削除
  const removeProduct = (productId: number) => {
    onProductsChange(selectedProducts.filter(p => p.id !== productId));
  };

  // 価格のフォーマット
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {/* 選択された商品の表示 */}
      {selectedProducts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">選択した商品</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"
              >
                <img
                  src={product.image_url || '/placeholder-image.png'}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.brand_name} • {formatPrice(product.price)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProduct(product.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 商品検索・追加ボタン */}
      {selectedProducts.length < maxProducts && (
        <div>
          {!showSearch ? (
            <Button
              variant="outline"
              onClick={() => setShowSearch(true)}
              className="w-full"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              商品を追加 ({selectedProducts.length}/{maxProducts})
            </Button>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">商品を検索</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowSearch(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* 検索入力 */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="商品名、ブランド、カテゴリで検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* 検索結果 */}
                {loading && (
                  <div className="text-center py-4 text-gray-500">
                    検索中...
                  </div>
                )}

                {!loading && searchQuery && searchResults.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    検索結果が見つかりませんでした
                  </div>
                )}

                {!loading && searchResults.length > 0 && (
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {searchResults.map((product) => {
                      const isSelected = selectedProducts.find(p => p.id === product.id);
                      const canAdd = selectedProducts.length < maxProducts && !isSelected;

                      return (
                        <div
                          key={product.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50 border-blue-200'
                              : canAdd
                              ? 'hover:bg-gray-50'
                              : 'opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => canAdd && addProduct(product)}
                        >
                          <img
                            src={product.image_url || '/placeholder-image.png'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 mb-1">
                              {product.brand_name} • {formatPrice(product.price)}
                            </p>
                            <div className="flex items-center space-x-1">
                              <Badge variant="secondary" className="text-xs">
                                {product.category_name}
                              </Badge>
                              {product.is_featured && (
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              )}
                            </div>
                          </div>
                          {isSelected ? (
                            <Badge variant="default" className="text-xs">
                              選択済み
                            </Badge>
                          ) : canAdd ? (
                            <Button variant="ghost" size="sm">
                              <Plus className="w-4 h-4" />
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-400">
                              上限達成
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
