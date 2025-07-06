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
  SICK = "ลาป่วย",
  ANNUAL = "ลาพักร้อน",
  PERSONAL = "ลากิจส่วนตัว",
  MATERNITY = "ลาคลอดบุตร",
  OTHER = "อื่นๆ"
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
  sick: number;
  annual: number;
  personal: number;
  maternity: number;
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
  rejectedReason?: string;
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
  leaveBalances: LeaveBalances;
}

export interface AuthContextType {
  user: UserData | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}
