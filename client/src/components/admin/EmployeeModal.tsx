import { useState, useEffect, useRef } from 'react';
import { UserData, Title, Gender, UserRole } from '@/types';
import { usersAPI } from '@/services/api';

// Helper functions for employee creation
const generateUsername = (firstName: string, lastName: string): string => {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
};

const getDefaultLeaveBalances = () => ({
  accumulated: 0,
  sick: 0,
  maternity: 0,
  paternity: 0,
  personal: 0,
  vacation: 0,
  ordination: 0,
  military: 0,
  study: 0,
  international: 0,
  spouse: 0
});
import { imageUploadService } from '@/services/firebase/storage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: UserData | null;
  onSave: () => void;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({ 
  isOpen, 
  onClose, 
  employee, 
  onSave 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: Title.NAI,
    nickname: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    username: '',
    password: '',
    profilePicture: '',
    address: '',
    socialMedia: '',
    lineUserId: '',
    leaveBalances: getDefaultLeaveBalances()
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        title: employee.title,
        nickname: employee.nickname,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        position: employee.position,
        username: employee.username,
        password: employee.password,
        profilePicture: employee.profilePicture || '',
        address: employee.address || '',
        socialMedia: employee.socialMedia || '',
        lineUserId: employee.lineUserId || '',
        leaveBalances: employee.leaveBalances
      });
      // Set preview for existing profile picture
      if (employee.profilePicture) {
        setProfileImagePreview(employee.profilePicture);
      }
    } else {
      setFormData({
        title: Title.NAI,
        nickname: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        username: '',
        password: '',
        profilePicture: '',
        address: '',
        socialMedia: '',
        lineUserId: '',
        leaveBalances: getDefaultLeaveBalances()
      });
      setProfileImagePreview('');
      setProfileImageFile(null);
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let profilePictureUrl = formData.profilePicture;

      // Handle image upload if a new file is selected
      if (profileImageFile) {
        try {
          const userId = employee?.id || `temp-${Date.now()}`;
          profilePictureUrl = await imageUploadService.uploadProfileImage(profileImageFile, userId);
        } catch (uploadError) {
          toast({
            title: "ข้อผิดพลาดในการอัปโหลดรูปภาพ",
            description: "ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      if (employee) {
        // Update existing employee
        await usersAPI.update(employee.id, {
          title: formData.title,
          nickname: formData.nickname,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          username: formData.username,
          password: formData.password,
          profilePicture: profilePictureUrl,
          address: formData.address,
          socialMedia: formData.socialMedia,
          lineUserId: formData.lineUserId,
          leaveBalances: formData.leaveBalances
        });

        toast({
          title: "แก้ไขพนักงานสำเร็จ",
          description: "ข้อมูลพนักงานถูกแก้ไขเรียบร้อยแล้ว",
        });
      } else {
        // Add new employee
        const gender = formData.title === Title.NAI ? Gender.MALE : Gender.FEMALE;

        const newEmployee = await usersAPI.create({
          username: formData.username,
          password: formData.password,
          role: UserRole.EMPLOYEE,
          title: formData.title,
          nickname: formData.nickname,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          profilePicture: profilePictureUrl,
          address: formData.address,
          socialMedia: formData.socialMedia,
          lineUserId: formData.lineUserId,
          gender,
          leaveBalances: formData.leaveBalances
        });

        // If we uploaded a temporary image, update it with the real user ID
        if (profileImageFile && profilePictureUrl.includes('temp-')) {
          try {
            const finalImageUrl = await imageUploadService.uploadProfileImage(profileImageFile, newEmployee.id);
            await usersAPI.update(newEmployee.id, {
              profilePicture: finalImageUrl
            });
          } catch (finalUploadError) {
            console.warn('Failed to update profile picture with final user ID:', finalUploadError);
            // Don't fail the whole operation for this
          }
        }

        toast({
          title: "เพิ่มพนักงานสำเร็จ",
          description: `พนักงานใหม่ถูกเพิ่มเรียบร้อยแล้ว ชื่อผู้ใช้: ${formData.username}`,
        });
      }

      onSave();
      onClose();
      
      // Reset form and image states
      setProfileImageFile(null);
      setProfileImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลพนักงานได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('leaveBalances.')) {
      const balanceType = field.split('.')[1] as keyof typeof formData.leaveBalances;
      setFormData(prev => ({
        ...prev,
        leaveBalances: {
          ...prev.leaveBalances,
          [balanceType]: Number(value)
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "ข้อผิดพลาด",
          description: "กรุณาเลือกไฟล์รูปภาพเท่านั้น",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "ข้อผิดพลาด",
          description: "ขนาดไฟล์ต้องไม่เกิน 5MB",
          variant: "destructive",
        });
        return;
      }

      setProfileImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview('');
    setFormData(prev => ({ ...prev, profilePicture: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            {employee ? 'แก้ไขพนักงาน' : 'เพิ่มพนักงานใหม่'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2">
                คำนำหน้า
              </Label>
              <Select 
                value={formData.title} 
                onValueChange={(value) => handleInputChange('title', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกคำนำหน้า" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Title.NAI}>นาย</SelectItem>
                  <SelectItem value={Title.NANG}>นาง</SelectItem>
                  <SelectItem value={Title.NANGSAO}>นางสาว</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="nickname" className="text-sm font-medium text-gray-700 mb-2">
                ชื่อเล่น
              </Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                placeholder="ป้อนชื่อเล่น"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2">
                ชื่อจริง
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="ป้อนชื่อจริง"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2">
                นามสกุล
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="ป้อนนามสกุล"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2">
                อีเมล
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="example@in2it.co.th"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2">
                เบอร์โทรศัพท์
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="08X-XXX-XXXX"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="position" className="text-sm font-medium text-gray-700 mb-2">
              ตำแหน่ง
            </Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              placeholder="ป้อนตำแหน่งงาน"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-2">
                ชื่อผู้ใช้ *
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="ป้อนชื่อผู้ใช้"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2">
                รหัสผ่าน *
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="ป้อนรหัสผ่าน"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">
                รูปโปรไฟล์
              </Label>
              <div className="space-y-4">
                {profileImagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={profileImagePreview}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={removeProfileImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    เลือกรูปภาพ
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  รองรับไฟล์: JPG, PNG, GIF (ขนาดไม่เกิน 5MB)
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="lineUserId" className="text-sm font-medium text-gray-700 mb-2">
                Line User ID
              </Label>
              <Input
                id="lineUserId"
                value={formData.lineUserId}
                onChange={(e) => handleInputChange('lineUserId', e.target.value)}
                placeholder="Line User ID"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2">
              ที่อยู่
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="ป้อนที่อยู่"
            />
          </div>
          
          <div>
            <Label htmlFor="socialMedia" className="text-sm font-medium text-gray-700 mb-2">
              โซเชียลมีเดีย
            </Label>
            <Input
              id="socialMedia"
              value={formData.socialMedia}
              onChange={(e) => handleInputChange('socialMedia', e.target.value)}
              placeholder="Facebook, Instagram, หรือโซเชียลมีเดียอื่นๆ"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ตั้งค่าวันลา</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="accumulatedLeave" className="text-sm font-medium text-gray-700 mb-2">
                  วันลาสะสม
                </Label>
                <Input
                  id="accumulatedLeave"
                  type="number"
                  min="0"
                  value={formData.leaveBalances.accumulated}
                  onChange={(e) => handleInputChange('leaveBalances.accumulated', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sickLeave" className="text-sm font-medium text-gray-700 mb-2">
                  ลาป่วย
                </Label>
                <Input
                  id="sickLeave"
                  type="number"
                  min="0"
                  value={formData.leaveBalances.sick}
                  onChange={(e) => handleInputChange('leaveBalances.sick', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maternityLeave" className="text-sm font-medium text-gray-700 mb-2">
                  ลาคลอดบุตร
                </Label>
                <Input
                  id="maternityLeave"
                  type="number"
                  min="0"
                  value={formData.leaveBalances.maternity}
                  onChange={(e) => handleInputChange('leaveBalances.maternity', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="paternityLeave" className="text-sm font-medium text-gray-700 mb-2">
                  ลาไปช่วยเหลือภริยาที่คลอดบุตร
                </Label>
                <Input
                  id="paternityLeave"
                  type="number"
                  min="0"
                  value={formData.leaveBalances.paternity}
                  onChange={(e) => handleInputChange('leaveBalances.paternity', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="personalLeave" className="text-sm font-medium text-gray-700 mb-2">
                  ลากิจส่วนตัว
                </Label>
                <Input
                  id="personalLeave"
                  type="number"
                  min="0"
                  value={formData.leaveBalances.personal}
                  onChange={(e) => handleInputChange('leaveBalances.personal', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="vacationLeave" className="text-sm font-medium text-gray-700 mb-2">
                  ลาพักผ่อน
                </Label>
                <Input
                  id="vacationLeave"
                  type="number"
                  min="0"
                  value={formData.leaveBalances.vacation}
                  onChange={(e) => handleInputChange('leaveBalances.vacation', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ordinationLeave" className="text-sm font-medium text-gray-700 mb-2">
                  ลาอุปสมบทหรือการลาไปประกอบพิธีฮัจย์
                </Label>
                <Input
                  id="ordinationLeave"
                  type="number"
                  min="0"
                  value={formData.leaveBalances.ordination}
                  onChange={(e) => handleInputChange('leaveBalances.ordination', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="militaryLeave" className="text-sm font-medium text-gray-700 mb-2">
                  ลาเข้ารับการตรวจเลือกทหาร
                </Label>
                <Input
                  id="militaryLeave"
                  type="number"
                  min="0"
                  value={formData.leaveBalances.military}
                  onChange={(e) => handleInputChange('leaveBalances.military', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="studyLeave" className="text-sm font-medium text-gray-700 mb-2">
                  ลาไปศึกษา ฝึกอบรม ปฏิบัติการวิจัย หรือดูงาน
                </Label>
                <Input
                  id="studyLeave"
                  type="number"
                  min="0"
                  value={formData.leaveBalances.study}
                  onChange={(e) => handleInputChange('leaveBalances.study', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="internationalLeave" className="text-sm font-medium text-gray-700 mb-2">
                  ลาไปปฏิบัติงานในองค์การระหว่างประเทศ
                </Label>
                <Input
                  id="internationalLeave"
                  type="number"
                  min="0"
                  value={formData.leaveBalances.international}
                  onChange={(e) => handleInputChange('leaveBalances.international', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="spouseLeave" className="text-sm font-medium text-gray-700 mb-2">
                  ลาติดตามคู่สมรส
                </Label>
                <Input
                  id="spouseLeave"
                  type="number"
                  min="0"
                  value={formData.leaveBalances.spouse}
                  onChange={(e) => handleInputChange('leaveBalances.spouse', e.target.value)}
                />
              </div>
            </div>
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
