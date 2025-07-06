import { useState, useEffect } from 'react';
import { UserData, LeaveRequest, LeaveStatus } from '@/types';
import { leaveRequestsAPI, usersAPI } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { formatDateRangeThai } from '@/utils/dateHelpers';
import { ArrowLeft, Calendar, Clock, User, FileText } from 'lucide-react';

interface EmployeeLeaveViewProps {
  employeeId: string | null;
  onClose: () => void;
}

export const EmployeeLeaveView: React.FC<EmployeeLeaveViewProps> = ({ employeeId, onClose }) => {
  const [employee, setEmployee] = useState<UserData | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employeeId) {
      loadEmployeeData();
    }
  }, [employeeId]);

  const loadEmployeeData = async () => {
    if (!employeeId) return;
    
    try {
      setLoading(true);
      
      // Load employee details
      const users = await usersAPI.getAll();
      const employeeData = users.find(u => u.id === employeeId);
      setEmployee(employeeData || null);

      // Load leave requests for this employee
      const allRequests = await leaveRequestsAPI.getByUserId(employeeId);
      setLeaveRequests(allRequests);
    } catch (error) {
      console.error('Error loading employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.PENDING:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">รอพิจารณา</Badge>;
      case LeaveStatus.APPROVED:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">อนุมัติ</Badge>;
      case LeaveStatus.REJECTED:
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">ปฏิเสธ</Badge>;
      default:
        return <Badge variant="outline">ไม่ทราบ</Badge>;
    }
  };

  if (!employeeId) return null;

  return (
    <Dialog open={!!employeeId} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <User className="h-5 w-5" />
            รายการขอลาของพนักงาน
          </DialogTitle>
          <DialogDescription>
            ดูข้อมูลและประวัติการลาของพนักงาน
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <Loading className="h-64" />
        ) : (
          <div className="space-y-6">
            {/* Employee Info */}
            {employee && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ข้อมูลพนักงาน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    {employee.profilePicture ? (
                      <img 
                        src={employee.profilePicture} 
                        alt={employee.nickname || employee.firstName} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-white text-lg font-medium">
                          {employee.nickname?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{employee.nickname}</h3>
                      <p className="text-gray-600">{employee.title}{employee.firstName} {employee.lastName}</p>
                      <p className="text-gray-500">{employee.position}</p>
                      <p className="text-sm text-gray-500">@{employee.username}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leave Balance Summary */}
            {employee && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    สรุปยอดวันลาคงเหลือ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(employee.leaveBalances).map(([key, value]) => {
                      const labels: Record<string, string> = {
                        accumulated: 'วันลาสะสม',
                        sick: 'ลาป่วย',
                        maternity: 'ลาคลอดบุตร',
                        paternity: 'ลาช่วยภริยาคลอด',
                        personal: 'ลากิจส่วนตัว',
                        vacation: 'ลาพักผ่อน',
                        ordination: 'ลาอุปสมบท',
                        military: 'ลาตรวจเลือกทหาร',
                        study: 'ลาศึกษา',
                        international: 'ลาต่างประเทศ',
                        spouse: 'ลาติดตามคู่สมรส'
                      };
                      
                      return (
                        <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{value}</div>
                          <div className="text-sm text-gray-600">{labels[key] || key}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leave Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  ประวัติการขอลา ({leaveRequests.length} รายการ)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaveRequests.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    ยังไม่มีการขอลา
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leaveRequests
                      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
                      .map((request) => (
                        <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{request.leaveType}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <Calendar className="h-4 w-4" />
                                {formatDateRangeThai(request.startDate, request.endDate)}
                                <span className="text-gray-400">•</span>
                                <Clock className="h-4 w-4" />
                                {request.totalDays} วัน
                              </div>
                            </div>
                            {getStatusBadge(request.status)}
                          </div>
                          
                          {request.reason && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700">เหตุผล:</p>
                              <p className="text-sm text-gray-600">{request.reason}</p>
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-500">
                            ยื่นคำขอเมื่อ: {new Date(request.requestDate).toLocaleDateString('th-TH')}
                            {request.contactNumber && (
                              <>
                                <span className="mx-2">•</span>
                                ติดต่อ: {request.contactNumber}
                              </>
                            )}
                          </div>
                          

                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};