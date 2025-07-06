import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './config';
import { firestoreService } from './firestore';
import { UserData } from '@/types';

export const authService = {
  // Custom sign in with username and password (we'll use email field to store username)
  signInWithUsernameAndPassword: async (username: string, password: string): Promise<UserData | null> => {
    try {
      // First, get user by username from Firestore
      const userData = await firestoreService.users.getByUsername(username);
      
      if (!userData) {
        throw new Error('User not found');
      }

      // Check password (in a real app, you'd use Firebase Auth properly)
      if (userData.password !== password) {
        throw new Error('Invalid password');
      }

      // For demo purposes, we'll sign in with a dummy email
      // In production, you'd implement proper Firebase Auth
      const dummyEmail = `${username}@in2it.com`;
      
      try {
        // Try to sign in (this will fail the first time)
        await signInWithEmailAndPassword(auth, dummyEmail, password);
      } catch (error: any) {
        // If user doesn't exist in Firebase Auth, create them
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          // For demo purposes, we'll simulate successful authentication
          // In production, you'd create the user in Firebase Auth first
          console.warn('Demo mode: simulating Firebase Auth for user:', username);
        }
      }

      return userData;
    } catch (error) {
      console.error('Sign in error:', error);
      return null;
    }
  },

  signOut: async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  onAuthStateChanged: (callback: (user: UserData | null) => void) => {
    // For demo purposes, we'll simulate auth state
    // In production, you'd properly integrate with Firebase Auth
    return () => {}; // Return unsubscribe function
  },

  getCurrentUser: (): UserData | null => {
    // This would normally get the current Firebase user
    // For demo, we'll return null and handle auth in the context
    return null;
  }
};

// Initialize admin user if it doesn't exist
export const initializeAdminUser = async () => {
  try {
    const existingAdmin = await firestoreService.users.getByUsername('admin');
    
    if (!existingAdmin) {
      console.log('Creating admin user...');
      await firestoreService.users.add({
        username: 'admin',
        password: 'admin',
        role: 'ADMIN' as any,
        title: 'นาย' as any,
        nickname: 'Admin',
        firstName: 'ผู้ดูแล',
        lastName: 'ระบบ',
        email: 'admin@in2it.com',
        phone: '02-123-4567',
        position: 'System Administrator',
        gender: 'MALE' as any,
        leaveBalances: {
          sick: 30,
          annual: 15,
          personal: 6,
          maternity: 0
        }
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};