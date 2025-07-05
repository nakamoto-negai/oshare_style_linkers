// Django APIとの通信用ユーティリティ

const API_BASE_URL = 'http://localhost:8000/api';

// トークンを取得する関数
const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

export const apiClient = {
  // 基本的なGETリクエスト
  get: async (endpoint: string) => {
    try {
      const fullUrl = `${API_BASE_URL}${endpoint}`;
      console.log(`API Request: GET ${fullUrl}`);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // 認証トークンがあれば追加
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers,
        mode: 'cors', // CORS mode を明示的に設定
        credentials: 'include', // CORS credentials
      });
      
      console.log(`API Response Status: ${response.status}`);
      console.log(`API Response Headers:`, Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API Response Data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // ネットワークエラーの場合はより詳細な情報を提供
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('サーバーに接続できません。Django サーバーが起動しているか確認してください。');
      }
      
      throw error;
    }
  },

  // POSTリクエスト
  post: async (endpoint: string, data: any) => {
    try {
      const fullUrl = `${API_BASE_URL}${endpoint}`;
      console.log(`API Request: POST ${fullUrl}`);
      console.log('POST data type:', data instanceof FormData ? 'FormData' : typeof data);
      if (data instanceof FormData) {
        console.log('FormData contents:');
        for (const [key, value] of data.entries()) {
          console.log(`  ${key}:`, value);
        }
      } else {
        console.log('POST data:', data);
      }
      
      const isFormData = data instanceof FormData;
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      
      // FormDataの場合は Content-Type を設定しない（ブラウザが自動設定）
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      // 認証トークンがあれば追加
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers,
        credentials: 'include',
        mode: 'cors',
        body: isFormData ? data : JSON.stringify(data),
      });
      
      console.log(`API Response Status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('API Response Data:', responseData);
      return responseData;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
};

// 具体的なAPI関数
export const styleAPI = {
  // スタイル一覧を取得
  getStyles: () => apiClient.get('/styles/'),
  
  // API接続テスト
  testConnection: () => apiClient.get('/test/'),
};

// 商品API
export const itemAPI = {
  // 商品一覧を取得
  getItems: (params?: Record<string, any>) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiClient.get(`/items/${queryString}`);
  },
  
  // 商品詳細を取得
  getItem: (id: number) => apiClient.get(`/items/${id}/`),
  
  // おすすめ商品を取得
  getFeaturedItems: () => apiClient.get('/items/featured/'),
  
  // ブランド一覧を取得
  getBrands: () => apiClient.get('/brands/'),
  
  // カテゴリ一覧を取得
  getCategories: () => apiClient.get('/categories/'),
};

// ユーザー・Q&A API
export const accountAPI = {
  // テスト用API
  testAPI: () => apiClient.get('/accounts/test/'),
  
  // 質問一覧を取得
  getQuestions: (params?: Record<string, any>) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const endpoint = `/questions/${queryString}`;
    console.log('Calling getQuestions with endpoint:', endpoint);
    return apiClient.get(endpoint);
  },
  
  // 質問詳細を取得
  getQuestion: (id: number) => apiClient.get(`/questions/${id}/`),
  
  // 質問を投稿
  createQuestion: (data: any) => apiClient.post('/questions/', data),
  
  // 質問に対する回答一覧を取得
  getQuestionAnswers: (questionId: number) => apiClient.get(`/answers/?question=${questionId}`),
  
  // 回答を投稿
  createAnswer: (data: any) => apiClient.post('/answers/create/', data),
  
  // 自分の質問一覧
  getMyQuestions: () => apiClient.get('/questions/?user=me'),
  
  // 自分の回答一覧
  getMyAnswers: () => apiClient.get('/answers/?user=me'),
  
  // ユーザープロフィール取得
  getUserProfile: () => apiClient.get('/accounts/profile/'),
  
  // 回答に投票
  voteAnswer: (answerId: number, isHelpful: boolean) => 
    apiClient.post(`/accounts/answers/${answerId}/vote/`, { is_helpful: isHelpful }),
  
  // ベストアンサーをマーク
  markBestAnswer: (answerId: number) => 
    apiClient.post(`/accounts/answers/${answerId}/best/`, {}),
};
