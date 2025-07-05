import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  profile_image?: string;
  points: number;
  total_earned_points: number;
  is_premium: boolean;
  questions_count: number;
  answers_count: number;
  helpful_answers_count: number;
  date_joined: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // ローカルストレージからトークンを読み込み
  useEffect(() => {
    const savedToken = localStorage.getItem('access_token');
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/me/', {
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // トークンが無効な場合はクリア
        localStorage.removeItem('access_token');
        setToken(null);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      localStorage.removeItem('access_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', Object.fromEntries(response.headers.entries()));

      // レスポンスのContent-Typeを確認
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        return { success: false, message: 'サーバーから予期しないレスポンスが返されました' };
      }

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('access_token', data.token); // 'access_token'キーに統一
        return { success: true, message: data.message };
      } else {
        // エラーハンドリングの改善
        if (data.error) {
          return { success: false, message: data.error };
        } else if (typeof data === 'object') {
          const errorMessages = Object.entries(data)
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`;
              }
              return `${field}: ${errors}`;
            })
            .join('\n');
          return { success: false, message: errorMessages };
        } else {
          return { success: false, message: data.message || 'ログインに失敗しました' };
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'ネットワークエラーが発生しました' };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch('http://localhost:8000/api/accounts/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('Registration response status:', response.status);
      console.log('Registration response headers:', Object.fromEntries(response.headers.entries()));

      // レスポンスのContent-Typeを確認
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        return { success: false, message: 'サーバーから予期しないレスポンスが返されました' };
      }

      const responseData = await response.json();

      if (response.ok) {
        setUser(responseData.user);
        setToken(responseData.token);
        localStorage.setItem('access_token', responseData.token); // 'access_token'キーに統一
        return { success: true, message: responseData.message };
      } else {
        // サーバーからのエラーを適切にフォーマット
        if (responseData.error) {
          return { success: false, message: responseData.error };
        } else if (typeof responseData === 'object') {
          // フィールドごとのエラーを文字列に変換
          const errorMessages = Object.entries(responseData)
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`;
              }
              return `${field}: ${errors}`;
            })
            .join('\n');
          return { success: false, message: errorMessages };
        } else {
          return { success: false, message: responseData.message || '登録に失敗しました' };
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'ネットワークエラーが発生しました' };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('http://localhost:8000/api/accounts/logout/', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('access_token'); // 'access_token'キーに統一
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
