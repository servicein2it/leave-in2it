import { hybridFirestoreService } from './hybrid';
import { UserData, UserRole, Title, Gender } from '@/types';
import { getDefaultLeaveBalances } from './mock';

// Function to create initial admin user in Firebase
export const initializeAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingUsers = await hybridFirestoreService.users.get();
    const adminExists = existingUsers.some(user => user.role === UserRole.ADMIN);
    
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    // Create default admin user
    const adminUser: Omit<UserData, 'id'> = {
      username: "admin",
      password: "admin",
      role: UserRole.ADMIN,
      title: Title.NAI,
      nickname: "Admin",
      firstName: "ผู้ดูแล",
      lastName: "ระบบ",
      email: "admin@in2it.co.th",
      phone: "02-123-4567",
      position: "System Administrator",
      profilePicture: "",
      address: "",
      socialMedia: "",
      lineUserId: "",
      gender: Gender.MALE,
      leaveBalances: getDefaultLeaveBalances(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add admin user to Firebase
    await hybridFirestoreService.users.add(adminUser);
    console.log('Admin user created successfully');
    
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};

// Function to create sample employee for testing (optional)
export const createSampleEmployee = async () => {
  try {
    const sampleEmployee: Omit<UserData, 'id'> = {
      username: "employee",
      password: "123456",
      role: UserRole.EMPLOYEE,
      title: Title.NAI,
      nickname: "ปอย",
      firstName: "สมชาย",
      lastName: "ใจดี",
      email: "somchai@in2it.co.th",
      phone: "08-123-4567",
      position: "กรรมการผู้จัดการ",
      profilePicture: "",
      address: "123 ถนนรัชดาภิเษก เขตดินแดง กรุงเทพฯ 10400",
      socialMedia: "facebook.com/somchai",
      lineUserId: "somchai123",
      gender: Gender.MALE,
      leaveBalances: {
        accumulated: 5,
        sick: 10,
        maternity: 0,
        paternity: 3,
        personal: 3,
        vacation: 6,
        ordination: 5,
        military: 2,
        study: 30,
        international: 0,
        spouse: 2
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await hybridFirestoreService.users.add(sampleEmployee);
    console.log('Sample employee created successfully');
    
  } catch (error) {
    console.error('Error creating sample employee:', error);
  }
};