import { storage } from './storage';
import bcrypt from 'bcrypt';
import { User } from '../shared/schema';

export class AuthService {
  async login(username: string, password: string): Promise<User | null> {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return null;
      }

      // For demo, we'll use simple password comparison
      // In production, use bcrypt.compare(password, user.password)
      if (user.password === password) {
        return user;
      }

      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async createDefaultAdmin(): Promise<void> {
    try {
      const existingAdmin = await storage.getUserByUsername('admin');
      if (existingAdmin) {
        console.log('Admin user already exists');
        return;
      }

      const adminUser = {
        username: 'admin',
        password: 'admin', // In production, hash this
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
        leaveBalances: {
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
          spouse: 0,
        },
      };

      await storage.createUser(adminUser);
      console.log('Admin user created successfully');
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  }
}

export const authService = new AuthService();