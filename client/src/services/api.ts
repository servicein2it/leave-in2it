import { UserData, LeaveRequest } from '@/types';

const API_BASE = '/api';

// Auth API
export const authAPI = {
  async login(username: string, password: string): Promise<UserData | null> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Login API error:', error);
      return null;
    }
  },
};

// Users API
export const usersAPI = {
  async getAll(): Promise<UserData[]> {
    const response = await fetch(`${API_BASE}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async create(userData: Partial<UserData>): Promise<UserData> {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  async update(id: string, updates: Partial<UserData>): Promise<UserData> {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },
};

// Leave Requests API
export const leaveRequestsAPI = {
  async getAll(): Promise<LeaveRequest[]> {
    const response = await fetch(`${API_BASE}/leave-requests`);
    if (!response.ok) throw new Error('Failed to fetch leave requests');
    return response.json();
  },

  async getByUserId(userId: string): Promise<LeaveRequest[]> {
    const response = await fetch(`${API_BASE}/leave-requests?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user leave requests');
    return response.json();
  },

  async create(requestData: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const response = await fetch(`${API_BASE}/leave-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    if (!response.ok) throw new Error('Failed to create leave request');
    return response.json();
  },

  async update(id: string, updates: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const response = await fetch(`${API_BASE}/leave-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update leave request');
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/leave-requests/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete leave request');
  },
};