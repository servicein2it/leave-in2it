import { useState, useEffect } from 'react';
import { useAuth } from '@/context/SimpleAuthContext';
import { LeaveRequest, LeaveStatus } from '@/types';
import { leaveRequestsAPI } from '@/services/api';
import { formatDateThai } from '@/utils/dateHelpers';
import { generatePrintableLeaveForm } from '@/utils/pdfGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';

export const LeaveHistory: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadLeaveHistory();
    }
  }, [user]);

  useEffect(() => {
    const handleLeaveRequestSubmitted = () => {
      loadLeaveHistory();
    };

    window.addEventListener('leaveRequestSubmitted', handleLeaveRequestSubmitted);
    return () => {
      window.removeEventListener('leaveRequestSubmitted', handleLeaveRequestSubmitted);
    };
  }, []);

  const loadLeaveHistory = async () => {
    if (!user) return;

    try {
      console.log('Loading leave history for user ID:', user.id);
      const requests = await leaveRequestsAPI.getByUserId(user.id);
      console.log('Found leave requests:', requests);
      setLeaveRequests(requests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()));
    } catch (error) {
      console.error('Error loading leave history:', error);
    } finally {
      setLoading(false);
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

  const handlePrintLeaveForm = (request: LeaveRequest) => {
    if (user) {
      generatePrintableLeaveForm(request, user);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบคำขอลานี้?')) {
      return;
    }

    setDeletingRequestId(requestId);
    try {
      await leaveRequestsAPI.delete(requestId);
      await loadLeaveHistory(); // Refresh the list
      toast({
        title: "สำเร็จ",
        description: "ลบคำขอลาเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Error deleting leave request:', error);
      let description = 'ไม่สามารถลบคำขอลาได้';
      
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
    } finally {
      setDeletingRequestId(null);
    }
  };

  if (loading) {
    return <Loading className="h-32" />;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">ประวัติการลา</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">วันที่ยื่น</th>
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
                    ไม่พบประวัติการลา
                  </td>
                </tr>
              ) : (
                leaveRequests.map((request) => (
                  <tr key={request.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-600">
                      {formatDateThai(request.requestDate)}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrintLeaveForm(request)}
                          disabled={request.status === LeaveStatus.PENDING || request.status === LeaveStatus.REJECTED}
                          className="text-primary hover:text-primary/80"
                        >
                          <i className="fas fa-print mr-1"></i>
                          พิมพ์
                        </Button>
                        {(request.status === LeaveStatus.PENDING || request.status === LeaveStatus.REJECTED) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRequest(request.id)}
                            disabled={deletingRequestId === request.id}
                            className="text-red-600 hover:text-red-800"
                          >
                            <i className="fas fa-trash mr-1"></i>
                            {deletingRequestId === request.id ? 'กำลังลบ...' : 'ลบ'}
                          </Button>
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
