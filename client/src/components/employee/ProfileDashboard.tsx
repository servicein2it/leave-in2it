import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { User, Edit2, Save, X, Camera } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/context/SimpleAuthContext';
import { Title, Gender, type UserData } from '@/types';

export const ProfileDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<Partial<UserData>>({});
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: userData, isLoading, error } = useQuery<UserData>({
    queryKey: [`/api/users/${user?.id}`],
    enabled: !!user?.id,
    retry: false,
  });



  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserData>) => {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'อัพเดตโปรไฟล์สำเร็จ',
        description: 'ข้อมูลโปรไฟล์ของคุณได้รับการอัพเดตเรียบร้อยแล้ว',
      });
      setIsEditing(false);
      setProfileData({});
      setProfilePictureFile(null);
      setPreviewUrl(null);
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}`] });
    },
    onError: (error) => {
      console.error('Profile update error:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถอัพเดตโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง',
        variant: 'destructive',
      });
    },
  });

  const handleEditClick = () => {
    setIsEditing(true);
    // Initialize form data with current user data
    setProfileData({});
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData({});
    setProfilePictureFile(null);
    setPreviewUrl(null);
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'ไฟล์ไม่ถูกต้อง',
          description: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'ไฟล์ใหญ่เกินไป',
          description: 'กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 2MB',
          variant: 'destructive',
        });
        return;
      }

      setProfilePictureFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSaveProfile = async () => {
    try {
      let updateData = { ...profileData };

      // Handle profile picture upload
      if (profilePictureFile) {
        const base64String = await convertFileToBase64(profilePictureFile);
        updateData.profilePicture = base64String;
      }

      // Filter out undefined values but allow empty strings
      const filteredData: Partial<UserData> = {};
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          filteredData[key as keyof UserData] = value as any;
        }
      });

      console.log('Saving profile data:', filteredData);
      updateProfileMutation.mutate(filteredData);
    } catch (error) {
      console.error('Save profile error:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถอัพโหลดรูปภาพได้',
        variant: 'destructive',
      });
    }
  };

  const getAvatarColor = (gender: Gender) => {
    switch (gender) {
      case Gender.MALE:
        return 'bg-blue-500';
      case Gender.FEMALE:
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          โหลดใหม่
        </Button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">ไม่พบข้อมูลผู้ใช้</p>
      </div>
    );
  }



  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <User className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">ข้อมูลส่วนตัว</h1>
        </div>
        {!isEditing ? (
          <Button onClick={handleEditClick} className="flex items-center space-x-2">
            <Edit2 className="h-4 w-4" />
            <span>แก้ไขข้อมูล</span>
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              onClick={handleSaveProfile}
              disabled={updateProfileMutation.isPending}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>บันทึก</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={updateProfileMutation.isPending}
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>ยกเลิก</span>
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>ข้อมูลพื้นฐาน</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              {(previewUrl || userData.profilePicture) ? (
                <img
                  src={previewUrl || userData.profilePicture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                />
              ) : (
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-lg ${getAvatarColor(userData.gender || Gender.MALE)}`}>
                  {getInitials(userData.firstName, userData.lastName)}
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
                  <Camera className="h-3 w-3" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <p className="font-semibold text-lg">{userData.firstName || ''} {userData.lastName || ''}</p>
              <p className="text-gray-600">{userData.position || 'ไม่ระบุตำแหน่ง'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Read-only fields */}
            <div>
              <Label className="text-sm font-medium text-gray-700">ชื่อผู้ใช้</Label>
              <Input value={userData.username || ''} disabled className="mt-1" />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">อีเมล</Label>
              <Input value={userData.email || ''} disabled className="mt-1" />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">ชื่อ-นามสกุล</Label>
              <Input value={`${userData.firstName || ''} ${userData.lastName || ''}`.trim()} disabled className="mt-1" />
            </div>

            {/* Editable fields */}
            <div>
              <Label className="text-sm font-medium text-gray-700">คำนำหน้า</Label>
              {isEditing ? (
                <Select
                  value={profileData.title || userData.title || ''}
                  onValueChange={(value) => setProfileData({...profileData, title: value as Title})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="เลือกคำนำหน้า" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Title.NAI}>{Title.NAI}</SelectItem>
                    <SelectItem value={Title.NANG}>{Title.NANG}</SelectItem>
                    <SelectItem value={Title.NANGSAO}>{Title.NANGSAO}</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input value={userData.title || ''} disabled className="mt-1" />
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">ชื่อเล่น</Label>
              {isEditing ? (
                <Input
                  value={profileData.nickname !== undefined ? profileData.nickname : userData.nickname || ''}
                  onChange={(e) => setProfileData({...profileData, nickname: e.target.value})}
                  className="mt-1"
                />
              ) : (
                <Input value={userData.nickname || ''} disabled className="mt-1" />
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">ตำแหน่ง</Label>
              {isEditing ? (
                <Input
                  value={profileData.position !== undefined ? profileData.position : userData.position || ''}
                  onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                  className="mt-1"
                />
              ) : (
                <Input value={userData.position || ''} disabled className="mt-1" />
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">เบอร์โทร</Label>
              {isEditing ? (
                <Input
                  value={profileData.phone !== undefined ? profileData.phone : userData.phone || ''}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="mt-1"
                />
              ) : (
                <Input value={userData.phone || ''} disabled className="mt-1" />
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">เพศ</Label>
              {isEditing ? (
                <Select
                  value={profileData.gender !== undefined ? profileData.gender : userData.gender || ''}
                  onValueChange={(value) => setProfileData({...profileData, gender: value as Gender})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="เลือกเพศ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Gender.MALE}>ชาย</SelectItem>
                    <SelectItem value={Gender.FEMALE}>หญิง</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input value={userData.gender === Gender.MALE ? 'ชาย' : userData.gender === Gender.FEMALE ? 'หญิง' : ''} disabled className="mt-1" />
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Line User ID</Label>
              {isEditing ? (
                <Input
                  value={profileData.lineUserId !== undefined ? profileData.lineUserId : userData.lineUserId || ''}
                  onChange={(e) => setProfileData({...profileData, lineUserId: e.target.value})}
                  className="mt-1"
                  placeholder="เว้นว่างได้หากไม่มี"
                />
              ) : (
                <Input value={userData.lineUserId || ''} disabled className="mt-1" />
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Social Media</Label>
              {isEditing ? (
                <Input
                  value={profileData.socialMedia !== undefined ? profileData.socialMedia : userData.socialMedia || ''}
                  onChange={(e) => setProfileData({...profileData, socialMedia: e.target.value})}
                  className="mt-1"
                  placeholder="เว้นว่างได้หากไม่มี"
                />
              ) : (
                <Input value={userData.socialMedia || ''} disabled className="mt-1" />
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">ที่อยู่</Label>
            {isEditing ? (
              <Textarea
                value={profileData.address !== undefined ? profileData.address : userData.address || ''}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                className="mt-1"
                rows={3}
                placeholder="เว้นว่างได้หากไม่มี"
              />
            ) : (
              <Textarea value={userData.address || ''} disabled className="mt-1" rows={3} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};