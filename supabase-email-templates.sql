-- Email Templates Configuration Table
CREATE TABLE IF NOT EXISTS email_templates (
  id VARCHAR PRIMARY KEY NOT NULL,
  template_name VARCHAR UNIQUE NOT NULL,
  template_type VARCHAR NOT NULL, -- 'LEAVE_SUBMITTED', 'LEAVE_APPROVED', 'LEAVE_REJECTED', 'ADMIN_NOTIFICATION'
  subject VARCHAR NOT NULL,
  sender_name VARCHAR NOT NULL,
  sender_email VARCHAR NOT NULL,
  banner_text VARCHAR NOT NULL,
  email_body TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_email_templates_type ON email_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_email_templates_updated_at ON email_templates;
CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default email templates
INSERT INTO email_templates (
  id,
  template_name,
  template_type,
  subject,
  sender_name,
  sender_email,
  banner_text,
  email_body,
  is_active
) VALUES 
(
  'template-001',
  'Leave Request Submitted',
  'LEAVE_SUBMITTED',
  '[IN2IT] คำขอลาของคุณถูกส่งเรียบร้อยแล้ว',
  'IN2IT Leave Management',
  'noreply@in2it.co.th',
  '🏢 IN2IT Company - ระบบจัดการการลา',
  '<p>เรียน คุณ{{employeeName}}</p>
<p>คำขอลาของคุณได้ถูกส่งเรียบร้อยแล้ว และอยู่ระหว่างการพิจารณา</p>
<h3>รายละเอียดคำขอลา:</h3>
<ul>
  <li><strong>ประเภทการลา:</strong> {{leaveType}}</li>
  <li><strong>จำนวนวัน:</strong> {{totalDays}} วัน</li>
  <li><strong>วันที่เริ่มต้น:</strong> {{startDate}}</li>
  <li><strong>วันที่สิ้นสุด:</strong> {{endDate}}</li>
  <li><strong>เหตุผล:</strong> {{reason}}</li>
</ul>
<p>คุณจะได้รับการแจ้งเตือนเมื่อคำขอลาของคุณได้รับการพิจารณา</p>',
  true
),
(
  'template-002',
  'Leave Request Approved',
  'LEAVE_APPROVED',
  '[IN2IT] คำขอลาของคุณได้รับการอนุมัติแล้ว',
  'IN2IT Leave Management',
  'noreply@in2it.co.th',
  '🏢 IN2IT Company - ระบบจัดการการลา',
  '<p>เรียน คุณ{{employeeName}}</p>
<p>คำขอลาของคุณได้รับการ<strong style="color: #22c55e;">อนุมัติ</strong>แล้ว</p>
<h3>รายละเอียดคำขอลา:</h3>
<ul>
  <li><strong>ประเภทการลา:</strong> {{leaveType}}</li>
  <li><strong>จำนวนวัน:</strong> {{totalDays}} วัน</li>
  <li><strong>วันที่เริ่มต้น:</strong> {{startDate}}</li>
  <li><strong>วันที่สิ้นสุด:</strong> {{endDate}}</li>
  <li><strong>เหตุผล:</strong> {{reason}}</li>
  <li><strong>อนุมัติโดย:</strong> {{approver}}</li>
</ul>
<p>คุณสามารถเริ่มลาได้ตามวันที่ที่ระบุในคำขอ หากมีข้อสงสัยกรุณาติดต่อฝ่ายบุคคล</p>',
  true
),
(
  'template-003',
  'Leave Request Rejected',
  'LEAVE_REJECTED',
  '[IN2IT] คำขอลาของคุณไม่ได้รับการอนุมัติ',
  'IN2IT Leave Management',
  'noreply@in2it.co.th',
  '🏢 IN2IT Company - ระบบจัดการการลา',
  '<p>เรียน คุณ{{employeeName}}</p>
<p>คำขอลาของคุณ<strong style="color: #ef4444;">ไม่ได้รับการอนุมัติ</strong></p>
<h3>รายละเอียดคำขอลา:</h3>
<ul>
  <li><strong>ประเภทการลา:</strong> {{leaveType}}</li>
  <li><strong>จำนวนวัน:</strong> {{totalDays}} วัน</li>
  <li><strong>วันที่เริ่มต้น:</strong> {{startDate}}</li>
  <li><strong>วันที่สิ้นสุด:</strong> {{endDate}}</li>
  <li><strong>เหตุผล:</strong> {{reason}}</li>
  <li><strong>ปฏิเสธโดย:</strong> {{approver}}</li>
</ul>
<p>หากมีข้อสงสัยเกี่ยวกับการปฏิเสธคำขอลา กรุณาติดต่อฝ่ายบุคคลหรือผู้บังคับบัญชา</p>',
  true
),
(
  'template-004',
  'Admin Notification - New Leave Request',
  'ADMIN_NOTIFICATION',
  '[IN2IT] คำขอลาใหม่รอการอนุมัติ - {{employeeName}}',
  'IN2IT Leave Management',
  'noreply@in2it.co.th',
  '🔔 IN2IT Company - การแจ้งเตือนสำหรับแอดมิน',
  '<h2>🔔 คำขอลาใหม่รอการอนุมัติ</h2>
<p><strong>{{employeeName}}</strong> ได้ส่งคำขอลาใหม่</p>
<h3>รายละเอียดคำขอลา:</h3>
<ul>
  <li><strong>ชื่อพนักงาน:</strong> {{employeeName}}</li>
  <li><strong>ตำแหน่ง:</strong> {{position}}</li>
  <li><strong>ประเภทการลา:</strong> {{leaveType}}</li>
  <li><strong>จำนวนวัน:</strong> {{totalDays}} วัน</li>
  <li><strong>วันที่เริ่มต้น:</strong> {{startDate}}</li>
  <li><strong>วันที่สิ้นสุด:</strong> {{endDate}}</li>
  <li><strong>เหตุผลการลา:</strong> {{reason}}</li>
</ul>
<div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin: 20px 0;">
  <strong>⚠️ ข้อมูลการติดต่อ:</strong><br>
  อีเมล: {{email}}<br>
  เบอร์โทร: {{phone}}
</div>
<p><strong>กรุณาเข้าสู่ระบบเพื่อพิจารณาอนุมัติคำขอลาภายใน 24 ชั่วโมง</strong></p>',
  true
) ON CONFLICT (template_name) DO NOTHING;

-- Verify templates
SELECT 
  template_name,
  template_type,
  subject,
  sender_name,
  is_active
FROM email_templates
ORDER BY template_type;