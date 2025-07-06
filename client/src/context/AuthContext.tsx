import React, { createContext, useState, useEffect } from 'react';
import { UserData, AuthContextType } from '@/types';
import { hybridAuthService } from '@/services/firebase/hybrid';
import { initializeAdminUser } from '@/services/firebase/adminSetup';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize admin user in Firebase if needed
        setTimeout(async () => {
          await initializeAdminUser();
        }, 1000); // Delay to ensure Firebase is ready
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await hybridAuthService.login(username, password);
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      hybridAuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
