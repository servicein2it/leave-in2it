import { UserData, LeaveRequest, UserRole, Title, Gender, LeaveType, LeaveStatus, LeaveBalances } from "@/types";

// Mock data storage
let users: UserData[] = [
  {
    id: "admin",
    username: "admin",
    password: "admin",
    role: UserRole.ADMIN,
    title: Title.NAI,
    nickname: "Admin",
    firstName: "ผู้ดูแล",
    lastName: "ระบบ",
    email: "admin@in2it.com",
    phone: "02-123-4567",
    position: "System Administrator",
    gender: Gender.MALE,
    leaveBalances: {
      sick: 30,
      annual: 15,
      personal: 6,
      maternity: 0
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

let leaveRequests: LeaveRequest[] = [];

let currentUser: UserData | null = null;

// Mock authentication
export const mockAuth = {
  signInWithUsernameAndPassword: async (username: string, password: string): Promise<UserData | null> => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      currentUser = user;
      return user;
    }
    return null;
  },

  signOut: async (): Promise<void> => {
    currentUser = null;
  },

  onAuthStateChanged: (callback: (user: UserData | null) => void) => {
    callback(currentUser);
    return () => {}; // Unsubscribe function
  },

  getCurrentUser: (): UserData | null => {
    return currentUser;
  }
};

// Mock Firestore
export const mockFirestore = {
  // Users collection
  users: {
    get: async (): Promise<UserData[]> => {
      return [...users];
    },

    getById: async (id: string): Promise<UserData | null> => {
      return users.find(u => u.id === id) || null;
    },

    add: async (userData: Omit<UserData, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserData> => {
      const newUser: UserData = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      users.push(newUser);
      return newUser;
    },

    update: async (id: string, updateData: Partial<UserData>): Promise<UserData | null> => {
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex === -1) return null;

      users[userIndex] = {
        ...users[userIndex],
        ...updateData,
        updatedAt: new Date()
      };
      return users[userIndex];
    },

    delete: async (id: string): Promise<boolean> => {
      const userIndex = users.findIndex(u => u.id === id);
      if (userIndex === -1) return false;

      users.splice(userIndex, 1);
      return true;
    },

    onSnapshot: (callback: (users: UserData[]) => void) => {
      callback([...users]);
      return () => {}; // Unsubscribe function
    }
  },

  // Leave requests collection
  leaveRequests: {
    get: async (): Promise<LeaveRequest[]> => {
      return [...leaveRequests];
    },

    getByUserId: async (userId: string): Promise<LeaveRequest[]> => {
      return leaveRequests.filter(lr => lr.userId === userId);
    },

    getByMonth: async (year: number, month: number): Promise<LeaveRequest[]> => {
      return leaveRequests.filter(lr => {
        const requestDate = new Date(lr.requestDate);
        return requestDate.getFullYear() === year && requestDate.getMonth() === month;
      });
    },

    add: async (leaveRequestData: Omit<LeaveRequest, 'id' | 'requestDate'>): Promise<LeaveRequest> => {
      const newRequest: LeaveRequest = {
        ...leaveRequestData,
        id: Date.now().toString(),
        requestDate: new Date()
      };
      leaveRequests.push(newRequest);
      return newRequest;
    },

    update: async (id: string, updateData: Partial<LeaveRequest>): Promise<LeaveRequest | null> => {
      const requestIndex = leaveRequests.findIndex(lr => lr.id === id);
      if (requestIndex === -1) return null;

      leaveRequests[requestIndex] = {
        ...leaveRequests[requestIndex],
        ...updateData
      };

      // If approving, deduct from user's leave balance
      if (updateData.status === LeaveStatus.APPROVED) {
        const request = leaveRequests[requestIndex];
        const user = users.find(u => u.id === request.userId);
        if (user) {
          const leaveTypeKey = getLeaveTypeKey(request.leaveType);
          if (leaveTypeKey && user.leaveBalances[leaveTypeKey] >= request.totalDays) {
            user.leaveBalances[leaveTypeKey] -= request.totalDays;
          }
        }
      }

      return leaveRequests[requestIndex];
    },

    delete: async (id: string): Promise<boolean> => {
      const requestIndex = leaveRequests.findIndex(lr => lr.id === id);
      if (requestIndex === -1) return false;

      leaveRequests.splice(requestIndex, 1);
      return true;
    },

    onSnapshot: (callback: (requests: LeaveRequest[]) => void) => {
      callback([...leaveRequests]);
      return () => {}; // Unsubscribe function
    }
  }
};

// Helper function to map leave types to balance keys
function getLeaveTypeKey(leaveType: LeaveType): keyof LeaveBalances | null {
  switch (leaveType) {
    case LeaveType.SICK:
      return 'sick';
    case LeaveType.ANNUAL:
      return 'annual';
    case LeaveType.PERSONAL:
      return 'personal';
    case LeaveType.MATERNITY:
      return 'maternity';
    default:
      return null;
  }
}

// Helper function to get default leave balances for new employees
export const getDefaultLeaveBalances = (): LeaveBalances => ({
  sick: 0,
  annual: 0,
  personal: 0,
  maternity: 0
});

// Helper function to generate username from name
export const generateUsername = (firstName: string, lastName: string): string => {
  const cleaned = `${firstName}.${lastName}`.toLowerCase().replace(/\s+/g, '');
  return cleaned;
};
