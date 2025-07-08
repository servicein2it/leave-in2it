import { useState } from 'react';
import { useAuth } from '@/context/SimpleAuthContext';
import { LeaveType, LeaveStatus } from '@/types';
import { leaveRequestsAPI } from '@/services/api';
import { calculateDaysBetween } from '@/utils/dateHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export const LeaveRequestForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInsufficientBalanceModal, setShowInsufficientBalanceModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    contactNumber: '',
    document: null as File | null
  });
  const [totalDays, setTotalDays] = useState(0);

  const calculateAndUpdateDays = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end >= start) {
        const days = calculateDaysBetween(start, end);
        setTotalDays(days);
      } else {
        setTotalDays(0);
      }
    } else {
      setTotalDays(0);
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    calculateAndUpdateDays(newFormData.startDate, newFormData.endDate);
  };

  const getLeaveBalance = (leaveType: LeaveType) => {
    if (!user) return 0;
    
    const balanceMap = {
      [LeaveType.ACCUMULATED]: user.leaveBalances.accumulated,
      [LeaveType.SICK]: user.leaveBalances.sick,
      [LeaveType.MATERNITY]: user.leaveBalances.maternity,
      [LeaveType.PATERNITY]: user.leaveBalances.paternity,
      [LeaveType.PERSONAL]: user.leaveBalances.personal,
      [LeaveType.VACATION]: user.leaveBalances.vacation,
      [LeaveType.ORDINATION]: user.leaveBalances.ordination,
      [LeaveType.MILITARY]: user.leaveBalances.military,
      [LeaveType.STUDY]: user.leaveBalances.study,
      [LeaveType.INTERNATIONAL]: user.leaveBalances.international,
      [LeaveType.SPOUSE]: user.leaveBalances.spouse,
    };
    
    return balanceMap[leaveType] || 0;
  };

  const validateLeaveBalance = () => {
    if (!formData.leaveType || totalDays === 0) return true;
    
    const availableBalance = getLeaveBalance(formData.leaveType as LeaveType);
    return availableBalance >= totalDays;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate required fields
    if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason || !formData.contactNumber) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบถ้วน",
        variant: "destructive",
      });
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (endDate < startDate) {
      toast({
        title: "วันที่ไม่ถูกต้อง",
        description: "วันที่สิ้นสุดต้องมากกว่าหรือเท่ากับวันที่เริ่มต้น",
        variant: "destructive",
      });
      return;
    }

    // Check leave balance
    if (!validateLeaveBalance()) {
      setShowInsufficientBalanceModal(true);
      return;
    }

    // Check document requirement for sick leave
    if (formData.leaveType === LeaveType.SICK && !formData.document) {
      toast({
        title: "เอกสารไม่ครบถ้วน",
        description: "กรุณาแนบใบรับรองแพทย์สำหรับการลาป่วย",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await leaveRequestsAPI.create({
        userId: user.id,
        employeeName: `${user.title}${user.firstName} ${user.lastName}`,
        leaveType: formData.leaveType as LeaveType,
        startDate,
        endDate,
        totalDays,
        reason: formData.reason,
        contactNumber: formData.contactNumber,
        status: LeaveStatus.PENDING
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
        contactNumber: '',
        document: null
      });
      setTotalDays(0);

      // Trigger reload of leave history
      window.dispatchEvent(new CustomEvent('leaveRequestSubmitted'));
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
                  {Object.values(LeaveType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
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
                onChange={(e) => handleDateChange('startDate', e.target.value)}
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
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Date Summary */}
          {totalDays > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>จำนวนวันที่ขอลา: {totalDays} วัน</strong>
              </p>
              {formData.leaveType && (
                <p className="text-sm text-blue-600 mt-1">
                  วันลาคงเหลือ: {getLeaveBalance(formData.leaveType as LeaveType)} วัน
                </p>
              )}
            </div>
          )}

          {/* Document Upload for Sick Leave */}
          {formData.leaveType === LeaveType.SICK && (
            <div>
              <Label htmlFor="document" className="text-sm font-medium text-gray-700 mb-2">
                แนบใบรับรองแพทย์ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="document"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFormData(prev => ({ ...prev, document: e.target.files?.[0] || null }))}
                className="w-full"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                รองรับไฟล์ PDF, JPG, JPEG, PNG ขนาดไม่เกิน 5MB
              </p>
            </div>
          )}
          
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'กำลังส่งคำขอ...' : 'ส่งคำขอลา'}
          </Button>
        </form>
      </CardContent>

      {/* Insufficient Balance Modal */}
      <Dialog open={showInsufficientBalanceModal} onOpenChange={setShowInsufficientBalanceModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>วันลาไม่เพียงพอ</DialogTitle>
            <DialogDescription>
              คุณไม่มีวันลาคงเหลือ หากต้องการ Submit วันลากรุณาติดต่อเจ้าหน้าที่ HR
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowInsufficientBalanceModal(false)}
            >
              ปิด
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
