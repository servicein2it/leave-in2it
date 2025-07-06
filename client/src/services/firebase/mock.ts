import { UserData, LeaveRequest, UserRole, Title, Gender, LeaveType, LeaveStatus, LeaveBalances } from "@/types";

// Helper function to get default leave balances for new employees
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
    profilePicture: "",
    address: "",
    socialMedia: "",
    lineUserId: "",
    gender: Gender.MALE,
    leaveBalances: getDefaultLeaveBalances(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "emp001",
    username: "employee",
    password: "123456",
    role: UserRole.EMPLOYEE,
    title: Title.NAI,
    nickname: "ปอย",
    firstName: "สมชาย",
    lastName: "ใจดี",
    email: "somchai@in2it.com",
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
  }
];

let leaveRequests: LeaveRequest[] = [];

let currentUser: UserData | null = null;

// Mock authentication
export const mockAuth = {
  login: async (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      currentUser = user;
      return { success: true, user };
    }
    return { success: false, user: null };
  },

  signInWithUsernameAndPassword: async (username: string, password: string): Promise<UserData | null> => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      currentUser = user;
      return user;
    }
    return null;
  },

  logout: (): void => {
    currentUser = null;
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
    case LeaveType.ACCUMULATED:
      return 'accumulated';
    case LeaveType.SICK:
      return 'sick';
    case LeaveType.MATERNITY:
      return 'maternity';
    case LeaveType.PATERNITY:
      return 'paternity';
    case LeaveType.PERSONAL:
      return 'personal';
    case LeaveType.VACATION:
      return 'vacation';
    case LeaveType.ORDINATION:
      return 'ordination';
    case LeaveType.MILITARY:
      return 'military';
    case LeaveType.STUDY:
      return 'study';
    case LeaveType.INTERNATIONAL:
      return 'international';
    case LeaveType.SPOUSE:
      return 'spouse';
    default:
      return null;
  }
}

// Function is already declared above, no need to re-export

// Helper function to generate username from name
export const generateUsername = (firstName: string, lastName: string): string => {
  const cleaned = `${firstName}.${lastName}`.toLowerCase().replace(/\s+/g, '');
  return cleaned;
};
