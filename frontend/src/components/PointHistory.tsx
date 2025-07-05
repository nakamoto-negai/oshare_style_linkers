import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CoinsIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

interface PointHistory {
  id: number;
  points: number;
  reason: string;
  balance_after: number;
  created_at: string;
}

export default function PointHistory() {
  const { token } = useAuth();
  const [history, setHistory] = useState<PointHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchPointHistory();
    }
  }, [token]);

  const fetchPointHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/point-history/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.results || data);
      }
    } catch (error) {
      console.error('Point history fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ポイント履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">読み込み中...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CoinsIcon className="w-5 h-5 text-yellow-500" />
          <span>ポイント履歴</span>
        </CardTitle>
        <CardDescription>
          ポイントの獲得・利用履歴です
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            まだポイント履歴がありません
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${item.points > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {item.points > 0 ? (
                      <TrendingUpIcon className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDownIcon className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{item.reason}</div>
                    <div className="text-xs text-gray-500">{formatDate(item.created_at)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${item.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.points > 0 ? '+' : ''}{item.points}pt
                  </div>
                  <div className="text-xs text-gray-500">
                    残高: {item.balance_after}pt
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
