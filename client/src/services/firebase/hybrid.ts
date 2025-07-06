import { UserData, LeaveRequest, LeaveType, LeaveBalances } from '@/types';
import { isFirebaseConfigured } from './config';
import { firestoreService } from './firestore';
import { mockFirestore } from './mock';
import { authService } from './auth';
import { mockAuth } from './mock';

// Create a hybrid service that uses Firebase when configured, otherwise uses mock services
export const hybridAuthService = {
  login: async (username: string, password: string) => {
    if (isFirebaseConfigured) {
      return authService.login(username, password);
    } else {
      return mockAuth.login(username, password);
    }
  },
  
  logout: () => {
    if (isFirebaseConfigured) {
      authService.logout();
    } else {
      mockAuth.logout();
    }
  },
  
  getCurrentUser: () => {
    if (isFirebaseConfigured) {
      return authService.getCurrentUser();
    } else {
      return mockAuth.getCurrentUser();
    }
  }
};

export const hybridFirestoreService = {
  users: {
    get: async (): Promise<UserData[]> => {
      if (isFirebaseConfigured) {
        return firestoreService.users.get();
      } else {
        return mockFirestore.users.get();
      }
    },
    
    getById: async (id: string): Promise<UserData | null> => {
      if (isFirebaseConfigured) {
        return firestoreService.users.getById(id);
      } else {
        return mockFirestore.users.getById(id);
      }
    },
    
    add: async (user: Partial<UserData>): Promise<UserData> => {
      if (isFirebaseConfigured) {
        return firestoreService.users.add(user);
      } else {
        return mockFirestore.users.add(user);
      }
    },
    
    update: async (id: string, updates: Partial<UserData>): Promise<void> => {
      if (isFirebaseConfigured) {
        return firestoreService.users.update(id, updates);
      } else {
        return mockFirestore.users.update(id, updates);
      }
    },
    
    delete: async (id: string): Promise<void> => {
      if (isFirebaseConfigured) {
        return firestoreService.users.delete(id);
      } else {
        return mockFirestore.users.delete(id);
      }
    },
    
    onSnapshot: (callback: (users: UserData[]) => void) => {
      if (isFirebaseConfigured) {
        return firestoreService.users.onSnapshot(callback);
      } else {
        return mockFirestore.users.onSnapshot(callback);
      }
    }
  },
  
  leaveRequests: {
    get: async (): Promise<LeaveRequest[]> => {
      if (isFirebaseConfigured) {
        return firestoreService.leaveRequests.get();
      } else {
        return mockFirestore.leaveRequests.get();
      }
    },
    
    getByUserId: async (userId: string): Promise<LeaveRequest[]> => {
      if (isFirebaseConfigured) {
        return firestoreService.leaveRequests.getByUserId(userId);
      } else {
        return mockFirestore.leaveRequests.getByUserId(userId);
      }
    },
    
    getByMonth: async (year: number, month: number): Promise<LeaveRequest[]> => {
      if (isFirebaseConfigured) {
        return firestoreService.leaveRequests.getByMonth(year, month);
      } else {
        return mockFirestore.leaveRequests.getByMonth(year, month);
      }
    },
    
    add: async (request: Partial<LeaveRequest>): Promise<LeaveRequest> => {
      if (isFirebaseConfigured) {
        return firestoreService.leaveRequests.add(request);
      } else {
        return mockFirestore.leaveRequests.add(request);
      }
    },
    
    update: async (id: string, updates: Partial<LeaveRequest>): Promise<void> => {
      if (isFirebaseConfigured) {
        return firestoreService.leaveRequests.update(id, updates);
      } else {
        return mockFirestore.leaveRequests.update(id, updates);
      }
    },
    
    delete: async (id: string): Promise<void> => {
      if (isFirebaseConfigured) {
        return firestoreService.leaveRequests.delete(id);
      } else {
        return mockFirestore.leaveRequests.delete(id);
      }
    },
    
    onSnapshot: (callback: (requests: LeaveRequest[]) => void) => {
      if (isFirebaseConfigured) {
        return firestoreService.leaveRequests.onSnapshot(callback);
      } else {
        return mockFirestore.leaveRequests.onSnapshot(callback);
      }
    }
  }
};

export const getDefaultLeaveBalances = (): LeaveBalances => ({
  accumulated: 0,
  sick: 0,
  maternity: 0,
  paternity: 0,
  personal: 0,
  vacation: 0,
  ordination: 0,
  military: 0,
  study: 0,
  international: 0,
  spouse: 0
});

export const generateUsername = (firstName: string, lastName: string): string => {
  const firstInitial = firstName.charAt(0).toLowerCase();
  const lastNameLower = lastName.toLowerCase();
  return `${firstInitial}${lastNameLower}`;
};

// Initialize admin user if it doesn't exist
export const initializeAdminUser = async () => {
  try {
    const users = await hybridFirestoreService.users.get();
    const adminExists = users.some(user => user.username === 'admin');
    
    if (!adminExists) {
      console.log('Creating admin user...');
      await hybridFirestoreService.users.add({
        username: 'admin',
        password: 'admin',
        role: 'ADMIN',
        title: 'นาย',
        nickname: 'Admin',
        firstName: 'ผู้ดูแล',
        lastName: 'ระบบ',
        email: 'admin@in2it.co.th',
        phone: '02-123-4567',
        position: 'System Administrator',
        profilePicture: '',
        address: '',
        socialMedia: '',
        lineUserId: '',
        gender: 'MALE',
        leaveBalances: getDefaultLeaveBalances(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};