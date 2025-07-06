import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { hybridFirestoreService } from '@/services/firebase/hybrid';
import { Gender } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: '',
    address: '',
    socialMedia: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nickname: user.nickname || '',
        address: user.address || '',
        socialMedia: user.socialMedia || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);

    try {
      await hybridFirestoreService.users.update(user.id, {
        nickname: formData.nickname,
        address: formData.address,
        socialMedia: formData.socialMedia
      });

      toast({
        title: "อัปเดตโปรไฟล์สำเร็จ",
        description: "ข้อมูลโปรไฟล์ของคุณถูกอัปเดตเรียบร้อยแล้ว",
      });

      onClose();
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getAvatarColor = (gender: Gender) => {
    return gender === Gender.MALE ? 'bg-indigo-500' : 'bg-sky-500';
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            แก้ไขโปรไฟล์
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${getAvatarColor(user.gender)}`}>
              <span className="text-white text-xl font-medium">
                {user.nickname.charAt(0)}
              </span>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              id="profileImage"
            />
            <Label 
              htmlFor="profileImage" 
              className="text-primary hover:text-primary/80 cursor-pointer text-sm font-medium"
            >
              เปลี่ยนรูปโปรไฟล์
            </Label>
          </div>
          
          <div>
            <Label htmlFor="nickname" className="text-sm font-medium text-gray-700 mb-2">
              ชื่อเล่น
            </Label>
            <Input
              id="nickname"
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2">
              ที่อยู่
            </Label>
            <Textarea
              id="address"
              rows={3}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="ที่อยู่ปัจจุบัน"
            />
          </div>
          
          <div>
            <Label htmlFor="socialMedia" className="text-sm font-medium text-gray-700 mb-2">
              โซเชียลมีเดีย
            </Label>
            <Input
              id="socialMedia"
              type="url"
              value={formData.socialMedia}
              onChange={(e) => handleInputChange('socialMedia', e.target.value)}
              placeholder="https://facebook.com/username"
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              ยกเลิก
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
