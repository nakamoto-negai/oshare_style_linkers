
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Menu, X, Sparkles, MessageCircle, Users, Recycle, Star, User, LogOut, Settings, Coins, ShoppingCart } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              おしゃれアンサーズ
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors hover:text-blue-600 ${isActive('/') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            >
              ホーム
            </Link>
            <Link 
              to="/features" 
              className={`transition-colors hover:text-blue-600 ${isActive('/features') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            >
              機能
            </Link>
            <Link 
              to="/items" 
              className={`transition-colors hover:text-blue-600 ${isActive('/items') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            >
              商品一覧
            </Link>
            <Link 
              to="/qa" 
              className={`transition-colors hover:text-blue-600 ${isActive('/qa') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            >
              Q&A
            </Link>
            <Link 
              to="/community" 
              className={`transition-colors hover:text-blue-600 ${isActive('/community') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            >
              コミュニティ
            </Link>
            <Link 
              to="/recycle" 
              className={`transition-colors hover:text-blue-600 ${isActive('/recycle') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            >
              リサイクル
            </Link>
            <Link 
              to="/about" 
              className={`transition-colors hover:text-blue-600 ${isActive('/about') ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            >
              サービスについて
            </Link>
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* カートアイコン */}
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {/* カート内商品数のバッジ（後で実装） */}
                  </Button>
                </Link>
                
                {/* ポイント表示 */}
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span>{user.points}pt</span>
                </div>
                
                {/* ユーザーメニュー */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profile_image || undefined} alt={user.username} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.username}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        プロフィール
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        設定
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      ログアウト
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">ログイン</Link>
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white" asChild>
                  <Link to="/register">新規登録</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>ホーム</Link>
            <Link to="/features" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>機能</Link>
            <Link to="/qa" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>Q&A</Link>
            <Link to="/community" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>コミュニティ</Link>
            <Link to="/recycle" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>リサイクル</Link>
            <Link to="/about" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>サービスについて</Link>
            
            {isAuthenticated && user ? (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profile_image || undefined} alt={user.username} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user.username}</p>
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Coins className="w-3 h-3 text-yellow-500" />
                      <span>{user.points}pt</span>
                    </div>
                  </div>
                </div>
                <Link to="/profile" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>プロフィール</Link>
                <Link to="/settings" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>設定</Link>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start p-2 text-gray-700 hover:text-blue-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  ログアウト
                </Button>
              </div>
            ) : (
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <Button variant="ghost" className="w-full" asChild onClick={() => setIsOpen(false)}>
                  <Link to="/login">ログイン</Link>
                </Button>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white" asChild onClick={() => setIsOpen(false)}>
                  <Link to="/register">新規登録</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
