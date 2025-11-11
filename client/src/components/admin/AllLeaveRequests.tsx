import { useState, useEffect } from 'react';
import { LeaveRequest, LeaveStatus, UserData } from '@/types';
import { leaveRequestsAPI, usersAPI } from '@/services/api';
import { formatDateThai, getThaiMonths, getCurrentMonthYear } from '@/utils/dateHelpers';
import { generatePrintableLeaveForm } from '@/utils/pdfGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Check, X, Printer, Trash2 } from 'lucide-react';

export const AllLeaveRequests: React.FC = () => {
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const currentMonthYear = getCurrentMonthYear();
  const thaiMonths = getThaiMonths();

  useEffect(() => {
    setSelectedMonth(currentMonthYear.month.toString());
    setSelectedYear(currentMonthYear.year.toString());
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      loadLeaveRequests();
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    loadEmployees();
  }, []);

  // Email notifications are now handled automatically by the backend when updating leave requests

  const loadEmployees = async () => {
    try {
      const allUsers = await usersAPI.getAll();
      setEmployees(allUsers);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadLeaveRequests = async () => {
    try {
      const requests = await leaveRequestsAPI.getAll();
      
      // If no month/year selected, show all requests
      if (!selectedMonth || !selectedYear) {
        setLeaveRequests(requests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()));
        return;
      }
      
      // Filter requests by selected month and year
      const filteredRequests = requests.filter(request => {
        const requestDate = new Date(request.requestDate);
        const requestMonth = requestDate.getMonth() + 1; // getMonth() returns 0-11, so add 1
        const requestYear = requestDate.getFullYear() + 543; // Convert to Buddhist year
        
        const selectedMonthNum = parseInt(selectedMonth);
        const selectedYearNum = parseInt(selectedYear);
        
        return requestMonth === selectedMonthNum && requestYear === selectedYearNum;
      });
      setLeaveRequests(filteredRequests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()));
    } catch (error) {
      console.error('Error loading leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      // Find the leave request before updating
      const leaveRequest = leaveRequests.find(req => req.id === requestId);
      if (!leaveRequest) {
        throw new Error('Leave request not found');
      }

      await leaveRequestsAPI.update(requestId, {
        status: LeaveStatus.APPROVED,
        approvedDate: new Date()
      });

      toast({
        title: "อนุมัติคำขอลาสำเร็จ",
        description: "คำขอลาได้รับการอนุมัติและหักวันลาเรียบร้อยแล้ว",
      });

      // Email notification is handled automatically by the backend

      loadLeaveRequests();
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอนุมัติคำขอลาได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะปฏิเสธคำขอลานี้?')) {
      return;
    }

    try {
      await leaveRequestsAPI.update(requestId, {
        status: LeaveStatus.REJECTED,
        approvedDate: new Date()
      });

      toast({
        title: "ปฏิเสธคำขอลาสำเร็จ",
        description: "คำขอลาได้รับการปฏิเสธเรียบร้อยแล้ว",
      });

      loadLeaveRequests();
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถปฏิเสธคำขอลาได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRequest = async (requestId: string, status?: LeaveStatus) => {
    const isApproved = status === LeaveStatus.APPROVED;
    const confirmMessage = isApproved 
      ? 'คุณต้องการลบคำขอลาที่อนุมัติแล้วใช่หรือไม่?\n\n⚠️ การลบจะคืนวันลาให้พนักงานโดยอัตโนมัติ'
      : 'คุณต้องการลบคำขอลานี้ใช่หรือไม่?';
      
    if (window.confirm(confirmMessage)) {
      try {
        await leaveRequestsAPI.delete(requestId);

        const successMessage = isApproved 
          ? "คำขอลาถูกลบและคืนวันลาให้พนักงานเรียบร้อยแล้ว"
          : "คำขอลาถูกลบออกจากระบบเรียบร้อยแล้ว";
          
        toast({
          title: "ลบคำขอลาสำเร็จ",
          description: successMessage,
        });

        loadLeaveRequests();
      } catch (error) {
        console.error('Error deleting leave request:', error);
        let description = 'ไม่สามารถลบคำขอลาได้ กรุณาลองใหม่อีกครั้ง';
        
        if (error instanceof Error && error.message.includes('400:')) {
          // Extract the actual error message from the API response
          const match = error.message.match(/400: (.+)/);
          if (match) {
            description = match[1];
          } else if (error.message.includes('approved leave request') || error.message.includes('อนุมัติแล้ว')) {
            description = 'ไม่สามารถลบคำขอลาที่ได้รับการอนุมัติแล้ว เนื่องจากได้มีการหักวันลาแล้ว';
          }
        }
        
        toast({
          title: "เกิดข้อผิดพลาด",
          description,
          variant: "destructive",
        });
      }
    }
  };

  const handlePrintLeaveForm = (request: LeaveRequest) => {
    const employee = employees.find(e => e.id === request.userId);
    if (employee) {
      generatePrintableLeaveForm(request, employee);
    }
  };

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED:
        return <Badge className="bg-green-100 text-green-800">อนุมัติ</Badge>;
      case LeaveStatus.REJECTED:
        return <Badge className="bg-red-100 text-red-800">ปฏิเสธ</Badge>;
      case LeaveStatus.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-800">รอพิจารณา</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getEmployee = (userId: string) => {
    return employees.find(e => e.id === userId);
  };

  const getEmployeeAvatarColor = (userId: string) => {
    const employee = getEmployee(userId);
    if (!employee) return 'bg-gray-500';
    return employee.gender === 'MALE' ? 'bg-indigo-500' : 'bg-sky-500';
  };

  const getEmployeeInitials = (userId: string) => {
    const employee = getEmployee(userId);
    if (!employee) return '?';
    return employee.nickname.charAt(0);
  };

  if (loading) {
    return <Loading className="h-32" />;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gray-800">
            คำขอลาทั้งหมด
          </CardTitle>
          <div className="flex space-x-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="เลือกเดือน" />
              </SelectTrigger>
              <SelectContent>
                {thaiMonths.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="ปี" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = currentMonthYear.year - 2 + i;
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">พนักงาน</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">ประเภท</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">วันที่ลา</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">จำนวนวัน</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">สถานะ</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    ไม่มีคำขอลาในเดือนที่เลือก
                  </td>
                </tr>
              ) : (
                leaveRequests.map((request) => (
                  <tr key={request.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        {(() => {
                          const employee = getEmployee(request.userId);
                          const hasProfilePicture = employee?.profilePicture && employee.profilePicture.trim() !== '';
                          
                          if (hasProfilePicture) {
                            return (
                              <img
                                src={employee.profilePicture}
                                alt={employee.nickname}
                                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                              />
                            );
                          } else {
                            return (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getEmployeeAvatarColor(request.userId)}`}>
                                <span className="text-white text-sm font-medium">
                                  {getEmployeeInitials(request.userId)}
                                </span>
                              </div>
                            );
                          }
                        })()}
                        <span className="text-gray-700 font-medium">
                          {request.employeeName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{request.leaveType}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDateThai(request.startDate)} - {formatDateThai(request.endDate)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{request.totalDays}</td>
                    <td className="py-3 px-4">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {request.status === LeaveStatus.PENDING ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApproveRequest(request.id)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check size={14} className="mr-1" />
                              อนุมัติ
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRejectRequest(request.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={14} className="mr-1" />
                              ปฏิเสธ
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePrintLeaveForm(request)}
                              disabled={request.status !== LeaveStatus.APPROVED}
                              className="text-primary hover:text-primary/80"
                            >
                              <Printer size={14} className="mr-1" />
                              พิมพ์
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRequest(request.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={14} className="mr-1" />
                              ลบ
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
