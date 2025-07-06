import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LeaveType } from '@/types';
import { mockFirestore } from '@/services/firebase/mock';
import { calculateDaysBetween } from '@/utils/dateHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export const LeaveRequestForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    contactNumber: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const totalDays = calculateDaysBetween(startDate, endDate);

      if (endDate < startDate) {
        toast({
          title: "วันที่ไม่ถูกต้อง",
          description: "วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น",
          variant: "destructive",
        });
        return;
      }

      await mockFirestore.leaveRequests.add({
        userId: user.id,
        employeeName: `${user.title}${user.firstName} ${user.lastName}`,
        leaveType: formData.leaveType as LeaveType,
        startDate,
        endDate,
        totalDays,
        reason: formData.reason,
        contactNumber: formData.contactNumber,
        status: 'รอพิจารณา' as any
      });

      toast({
        title: "ส่งคำขอลาสำเร็จ",
        description: "คำขอลาของคุณถูกส่งไปยังผู้ดูแลระบบเรียบร้อยแล้ว",
      });

      // Reset form
      setFormData({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
        contactNumber: ''
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งคำขอลาได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">ขอลาใหม่</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="leaveType" className="text-sm font-medium text-gray-700 mb-2">
                ประเภทการลา
              </Label>
              <Select value={formData.leaveType} onValueChange={(value) => handleInputChange('leaveType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภทการลา" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LeaveType.SICK}>ลาป่วย</SelectItem>
                  <SelectItem value={LeaveType.PERSONAL}>ลากิจส่วนตัว</SelectItem>
                  <SelectItem value={LeaveType.ANNUAL}>ลาพักร้อน</SelectItem>
                  <SelectItem value={LeaveType.MATERNITY}>ลาคลอดบุตร</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="contactNumber" className="text-sm font-medium text-gray-700 mb-2">
                เบอร์ติดต่อในระหว่างลา
              </Label>
              <Input
                id="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                placeholder="08X-XXX-XXXX"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-2">
                วันที่เริ่มต้น
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-2">
                วันที่สิ้นสุด
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="reason" className="text-sm font-medium text-gray-700 mb-2">
              เหตุผล
            </Label>
            <Textarea
              id="reason"
              rows={3}
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="ระบุเหตุผลการลา"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 transition-colors duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'กำลังส่งคำขอ...' : 'ส่งคำขอลา'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
