export enum Title {
  NAI = "นาย",
  NANG = "นาง", 
  NANGSAO = "นางสาว"
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE"
}

export enum LeaveType {
  ACCUMULATED = "วันลาสะสม",
  SICK = "ลาป่วย",
  MATERNITY = "ลาคลอดบุตร",
  PATERNITY = "ลาไปช่วยเหลือภริยาที่คลอดบุตร",
  PERSONAL = "ลากิจส่วนตัว",
  VACATION = "ลาพักผ่อน",
  ORDINATION = "ลาอุปสมบทหรือการลาไปประกอบพิธีฮัจย์",
  MILITARY = "ลาเข้ารับการตรวจเลือกทหาร",
  STUDY = "ลาไปศึกษา ฝึกอบรม ปฏิบัติการวิจัย หรือดูงาน",
  INTERNATIONAL = "ลาไปปฏิบัติงานในองค์การระหว่างประเทศ",
  SPOUSE = "ลาติดตามคู่สมรส"
}

export enum LeaveStatus {
  PENDING = "รอพิจารณา",
  APPROVED = "อนุมัติ",
  REJECTED = "ปฏิเสธ"
}

export enum UserRole {
  EMPLOYEE = "EMPLOYEE",
  ADMIN = "ADMIN"
}

export interface LeaveBalances {
  accumulated: number;
  sick: number;
  maternity: number;
  paternity: number;
  personal: number;
  vacation: number;
  ordination: number;
  military: number;
  study: number;
  international: number;
  spouse: number;
}

export interface UserData {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  title: Title;
  nickname: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  profilePicture?: string;
  address?: string;
  socialMedia?: string;
  lineUserId?: string;
  gender: Gender;
  leaveBalances: LeaveBalances;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  contactNumber: string;
  status: LeaveStatus;
  requestDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
}

export interface EmployeeFormData {
  title: Title;
  nickname: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  profilePicture?: string;
  address?: string;
  socialMedia?: string;
  lineUserId?: string;
  leaveBalances: LeaveBalances;
}

export interface AuthContextType {
  user: UserData | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface EmailTemplate {
  id: string;
  templateName: string;
  templateType: 'LEAVE_SUBMITTED' | 'LEAVE_APPROVED' | 'LEAVE_REJECTED' | 'ADMIN_NOTIFICATION';
  subject: string;
  senderName: string;
  senderEmail: string;
  bannerText: string;
  emailBody: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
