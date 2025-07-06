import { useState, useEffect } from 'react';
import { UserData, Title, Gender, UserRole } from '@/types';
import { hybridFirestoreService, generateUsername, getDefaultLeaveBalances } from '@/services/firebase/hybrid';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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
  const [formData, setFormData] = useState({
    title: Title.NAI,
    nickname: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
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
        leaveBalances: employee.leaveBalances
      });
    } else {
      setFormData({
        title: Title.NAI,
        nickname: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        leaveBalances: {
          sick: 30,
          annual: 15,
          personal: 6,
          maternity: 90
        }
      });
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (employee) {
        // Update existing employee
        await hybridFirestoreService.users.update(employee.id, {
          title: formData.title,
          nickname: formData.nickname,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          leaveBalances: formData.leaveBalances
        });

        toast({
          title: "แก้ไขพนักงานสำเร็จ",
          description: "ข้อมูลพนักงานถูกแก้ไขเรียบร้อยแล้ว",
        });
      } else {
        // Add new employee
        const username = generateUsername(formData.firstName, formData.lastName);
        const gender = formData.title === Title.NAI ? Gender.MALE : Gender.FEMALE;

        await hybridFirestoreService.users.add({
          username,
          password: '123456', // Default password
          role: UserRole.EMPLOYEE,
          title: formData.title,
          nickname: formData.nickname,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          position: formData.position,
          gender,
          leaveBalances: formData.leaveBalances
        });

        toast({
          title: "เพิ่มพนักงานสำเร็จ",
          description: `พนักงานใหม่ถูกเพิ่มเรียบร้อยแล้ว รหัสผ่านเริ่มต้นคือ '123456'`,
        });
      }

      onSave();
      onClose();
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
                placeholder="example@in2it.com"
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
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ตั้งค่าวันลา</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="annualLeave" className="text-sm font-medium text-gray-700 mb-2">
                  ลาพักร้อน
                </Label>
                <Input
                  id="annualLeave"
                  type="number"
                  min="0"
                  value={formData.leaveBalances.annual}
                  onChange={(e) => handleInputChange('leaveBalances.annual', e.target.value)}
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
