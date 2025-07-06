import { MailService } from '@sendgrid/mail';

// Define interfaces for email service (avoiding client-side imports)
interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
}

interface LeaveRequest {
  id: string;
  userId: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
}

enum LeaveStatus {
  PENDING = "รอพิจารณา",
  APPROVED = "อนุมัติ",
  REJECTED = "ปฏิเสธ"
}

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export function generateLeaveApprovalEmail(
  employee: UserData,
  leaveRequest: LeaveRequest,
  status: LeaveStatus,
  approver: string,
  rejectionReason?: string
): EmailParams {
  const isApproved = status === LeaveStatus.APPROVED;
  const statusText = isApproved ? 'อนุมัติ' : 'ปฏิเสธ';
  const statusColor = isApproved ? '#22c55e' : '#ef4444';
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Bangkok'
    }).format(date);
  };

  const subject = `[IN2IT] คำขอลาของคุณ${statusText}แล้ว - ${leaveRequest.leaveType}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px 20px; }
    .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
    .approved { background-color: #dcfce7; color: #166534; }
    .rejected { background-color: #fee2e2; color: #991b1b; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
    .info-item { padding: 15px; background: #f8fafc; border-radius: 6px; border-left: 4px solid ${statusColor}; }
    .info-label { font-weight: bold; color: #475569; margin-bottom: 5px; }
    .info-value { color: #1e293b; }
    .rejection-reason { background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin: 20px 0; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 0; color: #64748b; font-size: 14px; }
    @media (max-width: 600px) {
      .info-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏢 IN2IT Company</h1>
      <p>ระบบจัดการการลา</p>
    </div>
    
    <div class="content">
      <h2>สวัสดีคุณ${employee.firstName} ${employee.lastName}</h2>
      
      <p>คำขอลาของคุณได้รับการ<span class="status-badge ${isApproved ? 'approved' : 'rejected'}">${statusText}</span>แล้ว</p>
      
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">ประเภทการลา</div>
          <div class="info-value">${leaveRequest.leaveType}</div>
        </div>
        <div class="info-item">
          <div class="info-label">จำนวนวัน</div>
          <div class="info-value">${leaveRequest.totalDays} วัน</div>
        </div>
        <div class="info-item">
          <div class="info-label">วันที่เริ่มต้น</div>
          <div class="info-value">${formatDate(leaveRequest.startDate)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">วันที่สิ้นสุด</div>
          <div class="info-value">${formatDate(leaveRequest.endDate)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">เหตุผล</div>
          <div class="info-value">${leaveRequest.reason}</div>
        </div>
        <div class="info-item">
          <div class="info-label">${isApproved ? 'อนุมัติโดย' : 'ปฏิเสธโดย'}</div>
          <div class="info-value">${approver}</div>
        </div>
      </div>
      
      ${!isApproved && rejectionReason ? `
      <div class="rejection-reason">
        <div class="info-label">เหตุผลในการปฏิเสธ:</div>
        <div class="info-value">${rejectionReason}</div>
      </div>
      ` : ''}
      
      <p>
        ${isApproved 
          ? 'คุณสามารถเริ่มลาได้ตามวันที่ที่ระบุในคำขอ หากมีข้อสงสัยกรุณาติดต่อฝ่ายบุคคล'
          : 'หากมีข้อสงสัยเกี่ยวกับการปฏิเสธคำขอลา กรุณาติดต่อฝ่ายบุคคลหรือผู้บังคับบัญชา'
        }
      </p>
    </div>
    
    <div class="footer">
      <p>© 2025 IN2IT Company - ระบบจัดการการลา</p>
      <p>อีเมลนี้ถูกส่งโดยอัตโนมัติ กรุณาอย่าตอบกลับ</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
สวัสดีคุณ${employee.firstName} ${employee.lastName}

คำขอลาของคุณได้รับการ${statusText}แล้ว

รายละเอียดคำขอลา:
- ประเภทการลา: ${leaveRequest.leaveType}
- จำนวนวัน: ${leaveRequest.totalDays} วัน
- วันที่เริ่มต้น: ${formatDate(leaveRequest.startDate)}
- วันที่สิ้นสุด: ${formatDate(leaveRequest.endDate)}
- เหตุผล: ${leaveRequest.reason}
- ${isApproved ? 'อนุมัติโดย' : 'ปฏิเสธโดย'}: ${approver}

${!isApproved && rejectionReason ? `เหตุผลในการปฏิเสธ: ${rejectionReason}` : ''}

${isApproved 
  ? 'คุณสามารถเริ่มลาได้ตามวันที่ที่ระบุในคำขอ หากมีข้อสงสัยกรุณาติดต่อฝ่ายบุคคล'
  : 'หากมีข้อสงสัยเกี่ยวกับการปฏิเสธคำขอลา กรุณาติดต่อฝ่ายบุคคลหรือผู้บังคับบัญชา'
}

IN2IT Company
ระบบจัดการการลา
  `;

  return {
    to: employee.email,
    from: 'noreply@in2it.co.th', // You can customize this sender email
    subject,
    text,
    html
  };
}

export async function sendLeaveApprovalNotification(
  employee: UserData,
  leaveRequest: LeaveRequest,
  status: LeaveStatus,
  approver: string,
  rejectionReason?: string
): Promise<boolean> {
  try {
    const emailParams = generateLeaveApprovalEmail(employee, leaveRequest, status, approver, rejectionReason);
    const success = await sendEmail(emailParams);
    
    if (success) {
      console.log(`Email notification sent to ${employee.email} for leave request ${leaveRequest.id}`);
    } else {
      console.error(`Failed to send email notification to ${employee.email}`);
    }
    
    return success;
  } catch (error) {
    console.error('Error sending leave approval notification:', error);
    return false;
  }
}