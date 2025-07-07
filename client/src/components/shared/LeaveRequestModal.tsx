import { LeaveRequest, LeaveStatus } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateThai } from '@/utils/dateHelpers';
import { generatePrintableLeaveForm } from '@/utils/pdfGenerator';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LeaveRequest | null;
  employee?: any;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  isOpen,
  onClose,
  request,
  employee,
  showActions = false,
  onApprove,
  onReject,
  onDelete
}) => {
  if (!request) return null;

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.PENDING:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">รอพิจารณา</Badge>;
      case LeaveStatus.APPROVED:
        return <Badge variant="secondary" className="bg-green-100 text-green-800">อนุมัติ</Badge>;
      case LeaveStatus.REJECTED:
        return <Badge variant="secondary" className="bg-red-100 text-red-800">ปฏิเสธ</Badge>;
      default:
        return <Badge variant="secondary">ไม่ทราบสถานะ</Badge>;
    }
  };

  const handlePrint = () => {
    if (employee) {
      generatePrintableLeaveForm(request, employee);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            รายละเอียดการลา
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">ชื่อผู้ขอลา</label>
              <p className="text-gray-900">{request.employeeName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">ประเภทการลา</label>
              <p className="text-gray-900">{request.leaveType}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">วันที่เริ่มลา</label>
              <p className="text-gray-900">{formatDateThai(request.startDate)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">วันที่สิ้นสุดลา</label>
              <p className="text-gray-900">{formatDateThai(request.endDate)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">จำนวนวัน</label>
              <p className="text-gray-900">{request.totalDays} วัน</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">สถานะ</label>
              <div>{getStatusBadge(request.status as LeaveStatus)}</div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">เหตุผลการลา</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{request.reason}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">เบอร์โทรติดต่อ</label>
            <p className="text-gray-900">{request.contactNumber}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">วันที่ยื่นคำขอ</label>
              <p className="text-gray-900">{formatDateThai(request.requestDate)}</p>
            </div>
            {request.approvedDate && (
              <div>
                <label className="text-sm font-medium text-gray-700">วันที่อนุมัติ</label>
                <p className="text-gray-900">{formatDateThai(request.approvedDate)}</p>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <div className="space-x-2">
              {request.status === LeaveStatus.APPROVED && employee && (
                <Button
                  variant="outline"
                  onClick={handlePrint}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <i className="fas fa-print mr-2"></i>
                  พิมพ์ใบลา
                </Button>
              )}
            </div>
            
            {showActions && (
              <div className="space-x-2">
                {request.status === LeaveStatus.PENDING && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => onReject?.(request.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ปฏิเสธ
                    </Button>
                    <Button
                      onClick={() => onApprove?.(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      อนุมัติ
                    </Button>
                  </>
                )}
                {(request.status === LeaveStatus.PENDING || request.status === LeaveStatus.REJECTED) && (
                  <Button
                    variant="outline"
                    onClick={() => onDelete?.(request.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <i className="fas fa-trash mr-2"></i>
                    ลบ
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};