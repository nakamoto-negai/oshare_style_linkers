
import Header from './Header';
import { Toaster } from './ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
      <Header />
      <main>{children}</main>
      
      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            おしゃれアンサーズ
          </h3>
          <p className="text-gray-400 mb-6">
            ファッションの壁を取り払い、誰もが気軽に自己表現できる社会を実現
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">プライバシーポリシー</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">利用規約</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">お問い合わせ</a>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            © 2024 おしゃれアンサーズ. All rights reserved.
          </p>
        </div>
      </footer>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default Layout;
