import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot,
  Unsubscribe,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db } from './config';
import { UserData, LeaveRequest, UserRole, Title, Gender, LeaveType, LeaveStatus, LeaveBalances } from '@/types';

// Convert Firebase Timestamp to Date
const convertTimestamp = (timestamp: any) => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return timestamp instanceof Date ? timestamp : new Date(timestamp);
};

// Convert data for Firebase (Date to Timestamp)
const convertForFirebase = (data: any) => {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Date) {
      converted[key] = Timestamp.fromDate(converted[key]);
    }
  });
  return converted;
};

// Convert data from Firebase (Timestamp to Date)
const convertFromFirebase = (data: any) => {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] && typeof converted[key] === 'object' && converted[key].toDate) {
      converted[key] = convertTimestamp(converted[key]);
    }
  });
  return converted;
};

// Firestore service
export const firestoreService = {
  // Users collection
  users: {
    get: async (): Promise<UserData[]> => {
      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollection);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertFromFirebase(doc.data())
      })) as UserData[];
    },

    getById: async (id: string): Promise<UserData | null> => {
      const userDoc = doc(db, 'users', id);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...convertFromFirebase(docSnap.data())
        } as UserData;
      }
      return null;
    },

    getByUsername: async (username: string): Promise<UserData | null> => {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...convertFromFirebase(doc.data())
        } as UserData;
      }
      return null;
    },

    add: async (userData: Omit<UserData, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserData> => {
      const usersCollection = collection(db, 'users');
      const now = new Date();
      const newUser = {
        ...userData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(usersCollection, convertForFirebase(newUser));
      return {
        id: docRef.id,
        ...newUser
      };
    },

    update: async (id: string, updateData: Partial<UserData>): Promise<UserData | null> => {
      const userDoc = doc(db, 'users', id);
      const updateDataWithTimestamp = {
        ...updateData,
        updatedAt: new Date()
      };
      
      await updateDoc(userDoc, convertForFirebase(updateDataWithTimestamp));
      
      // Return updated user
      return await firestoreService.users.getById(id);
    },

    delete: async (id: string): Promise<boolean> => {
      try {
        const userDoc = doc(db, 'users', id);
        await deleteDoc(userDoc);
        return true;
      } catch (error) {
        console.error('Error deleting user:', error);
        return false;
      }
    },

    onSnapshot: (callback: (users: UserData[]) => void): Unsubscribe => {
      const usersCollection = collection(db, 'users');
      return onSnapshot(usersCollection, (snapshot) => {
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...convertFromFirebase(doc.data())
        })) as UserData[];
        callback(users);
      });
    }
  },

  // Leave requests collection
  leaveRequests: {
    get: async (): Promise<LeaveRequest[]> => {
      const requestsCollection = collection(db, 'leaveRequests');
      const q = query(requestsCollection, orderBy('requestDate', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertFromFirebase(doc.data())
      })) as LeaveRequest[];
    },

    getByUserId: async (userId: string): Promise<LeaveRequest[]> => {
      const requestsCollection = collection(db, 'leaveRequests');
      const q = query(
        requestsCollection, 
        where('userId', '==', userId),
        orderBy('requestDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertFromFirebase(doc.data())
      })) as LeaveRequest[];
    },

    getByMonth: async (year: number, month: number): Promise<LeaveRequest[]> => {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const requestsCollection = collection(db, 'leaveRequests');
      const q = query(
        requestsCollection,
        where('requestDate', '>=', Timestamp.fromDate(startDate)),
        where('requestDate', '<=', Timestamp.fromDate(endDate)),
        orderBy('requestDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertFromFirebase(doc.data())
      })) as LeaveRequest[];
    },

    add: async (leaveRequestData: Omit<LeaveRequest, 'id' | 'requestDate'>): Promise<LeaveRequest> => {
      const requestsCollection = collection(db, 'leaveRequests');
      const newRequest = {
        ...leaveRequestData,
        requestDate: new Date()
      };
      
      const docRef = await addDoc(requestsCollection, convertForFirebase(newRequest));
      return {
        id: docRef.id,
        ...newRequest
      };
    },

    update: async (id: string, updateData: Partial<LeaveRequest>): Promise<LeaveRequest | null> => {
      const requestDoc = doc(db, 'leaveRequests', id);
      await updateDoc(requestDoc, convertForFirebase(updateData));

      // If approving, deduct from user's leave balance
      if (updateData.status === LeaveStatus.APPROVED) {
        const request = await firestoreService.leaveRequests.getById(id);
        if (request) {
          const user = await firestoreService.users.getById(request.userId);
          if (user) {
            const leaveTypeKey = getLeaveTypeKey(request.leaveType);
            if (leaveTypeKey && user.leaveBalances[leaveTypeKey] >= request.totalDays) {
              const updatedBalances = {
                ...user.leaveBalances,
                [leaveTypeKey]: user.leaveBalances[leaveTypeKey] - request.totalDays
              };
              await firestoreService.users.update(user.id, { leaveBalances: updatedBalances });
            }
          }
        }
      }

      return await firestoreService.leaveRequests.getById(id);
    },

    getById: async (id: string): Promise<LeaveRequest | null> => {
      const requestDoc = doc(db, 'leaveRequests', id);
      const docSnap = await getDoc(requestDoc);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...convertFromFirebase(docSnap.data())
        } as LeaveRequest;
      }
      return null;
    },

    delete: async (id: string): Promise<boolean> => {
      try {
        const requestDoc = doc(db, 'leaveRequests', id);
        await deleteDoc(requestDoc);
        return true;
      } catch (error) {
        console.error('Error deleting leave request:', error);
        return false;
      }
    },

    onSnapshot: (callback: (requests: LeaveRequest[]) => void): Unsubscribe => {
      const requestsCollection = collection(db, 'leaveRequests');
      const q = query(requestsCollection, orderBy('requestDate', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...convertFromFirebase(doc.data())
        })) as LeaveRequest[];
        callback(requests);
      });
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

// Helper function to generate username from name
export const generateUsername = (firstName: string, lastName: string): string => {
  const cleaned = `${firstName}.${lastName}`.toLowerCase().replace(/\s+/g, '');
  return cleaned;
};