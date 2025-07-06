import { LeaveRequest, UserData, LeaveType } from '@/types';
import { formatDateThai } from './dateHelpers';

export const generatePrintableLeaveForm = (
  request: LeaveRequest,
  employee: UserData
): void => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('กรุณาอนุญาตให้เปิดหน้าต่างใหม่เพื่อพิมพ์ใบลา');
    return;
  }

  const isOtherLeaveType = !Object.values(LeaveType).includes(request.leaveType);
  const sickChecked = request.leaveType === LeaveType.SICK ? '✓' : '';
  const personalChecked = request.leaveType === LeaveType.PERSONAL ? '✓' : '';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ใบลา - IN2IT Company</title>
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Kanit', sans-serif; font-size: 14px; line-height: 1.6; color: #333; background: white; }
            .container { max-width: 210mm; margin: 0 auto; padding: 20mm; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .logo { height: 60px; width: auto; }
            .title { font-size: 24px; font-weight: 700; text-align: center; flex: 1; }
            .date { text-align: right; font-size: 14px; }
            .form-section { margin-bottom: 25px; }
            .form-row { display: flex; margin-bottom: 15px; align-items: center; }
            .form-label { min-width: 120px; font-weight: 500; }
            .form-input { flex: 1; border-bottom: 1px solid #333; padding: 5px 10px; margin-left: 10px; }
            .checkbox-group { display: flex; gap: 30px; margin: 15px 0; }
            .checkbox-item { display: flex; align-items: center; gap: 10px; }
            .checkbox { width: 20px; height: 20px; border: 2px solid #333; display: inline-block; text-align: center; line-height: 16px; font-weight: bold; }
            .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-box { width: 45%; text-align: center; }
            .signature-line { border-bottom: 1px solid #333; margin: 40px 0 10px 0; }
            .approval-section { margin-top: 20px; text-align: left; }
            .approval-options { display: flex; gap: 20px; margin-top: 10px; }
            .approval-checkbox { width: 15px; height: 15px; border: 1px solid #333; display: inline-block; margin-right: 10px; }
            @media print {
                .container { padding: 15mm; }
                body { -webkit-print-color-adjust: exact; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://in2it-service.com/IN2IT/logo/in2it-logo.png" alt="IN2IT Company" class="logo">
                <div class="title">ใบลา</div>
                <div class="date">วันที่ ${formatDateThai(request.requestDate)}</div>
            </div>
            
            <div class="form-section">
                <div class="form-row">
                    <span class="form-label">ข้าพเจ้า</span>
                    <span class="form-input">${employee.title}${employee.firstName} ${employee.lastName}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">ตำแหน่ง</span>
                    <span class="form-input">${employee.position}</span>
                </div>
            </div>
            
            <div class="form-section">
                <div style="margin-bottom: 15px;">
                    <strong>ขอลา:</strong>
                </div>
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <span class="checkbox">${sickChecked}</span>
                        <span>ป่วย</span>
                    </div>
                    <div class="checkbox-item">
                        <span class="checkbox">${personalChecked}</span>
                        <span>กิจส่วนตัว</span>
                    </div>
                </div>
                ${isOtherLeaveType ? `
                <div class="form-row">
                    <span class="form-label">เรื่อง</span>
                    <span class="form-input">${request.leaveType}</span>
                </div>
                ` : ''}
                <div class="form-row">
                    <span class="form-label">เหตุผล</span>
                    <span class="form-input">${request.reason}</span>
                </div>
            </div>
            
            <div class="form-section">
                <div class="form-row">
                    <span class="form-label">ตั้งแต่วันที่</span>
                    <span class="form-input">${formatDateThai(request.startDate)}</span>
                    <span class="form-label" style="margin-left: 20px;">ถึงวันที่</span>
                    <span class="form-input">${formatDateThai(request.endDate)}</span>
                </div>
                <div class="form-row">
                    <span class="form-label">รวม</span>
                    <span class="form-input">${request.totalDays} วัน</span>
                </div>
                <div class="form-row">
                    <span class="form-label">เบอร์โทรติดต่อ</span>
                    <span class="form-input">${request.contactNumber}</span>
                </div>
            </div>
            
            <div class="signature-section">
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div>ลายเซ็นผู้ขอลา</div>
                    <div style="margin-top: 10px;">( ${employee.title}${employee.firstName} ${employee.lastName} )</div>
                </div>
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div>ลายเซ็นผู้อนุมัติ</div>
                    <div style="margin-top: 10px;">( ............................. )</div>
                    <div class="approval-section">
                        <strong>ความเห็น:</strong>
                        <div class="approval-options">
                            <div>
                                <span class="approval-checkbox"></span>
                                <span>อนุมัติ</span>
                            </div>
                            <div>
                                <span class="approval-checkbox"></span>
                                <span>ไม่อนุมัติ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
};
