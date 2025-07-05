import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Camera, Upload } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface ProfileImageUploadProps {
  currentImage?: string | null;
  username: string;
  onImageUpdate: (imageUrl: string) => void;
  token: string;
}

export default function ProfileImageUpload({ 
  currentImage, 
  username, 
  onImageUpdate, 
  token 
}: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック (5MB制限)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "エラー",
        description: "ファイルサイズは5MB以下にしてください",
        variant: "destructive",
      });
      return;
    }

    // ファイルタイプチェック
    if (!file.type.startsWith('image/')) {
      toast({
        title: "エラー",
        description: "画像ファイルを選択してください",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('profile_image', file);

      const response = await fetch('http://localhost:8000/api/accounts/profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onImageUpdate(data.profile_image);
        toast({
          title: "成功",
          description: "プロフィール画像を更新しました",
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: "エラー",
        description: "画像のアップロードに失敗しました",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative group">
      <div className="relative">
        <Avatar className="w-24 h-24 cursor-pointer" onClick={handleImageClick}>
          <AvatarImage src={currentImage || undefined} />
          <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 text-white">
            {username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        {/* オーバーレイ */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={handleImageClick}
        >
          {uploading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>
      </div>
      
      {/* 隠しファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
      
      {/* アップロードボタン */}
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2 w-full"
        onClick={handleImageClick}
        disabled={uploading}
      >
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? '更新中...' : '画像を変更'}
      </Button>
    </div>
  );
}
