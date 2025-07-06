import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authService } from "./auth";
import { sendLeaveApprovalNotification } from "./emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize admin user
  await authService.createDefaultAdmin();

  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await authService.login(username, password);
      
      if (user) {
        res.json(user);
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // User routes
  app.get('/api/users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const userData = req.body;
      
      // Convert date strings to Date objects
      if (userData.createdAt) {
        userData.createdAt = new Date(userData.createdAt);
      }
      if (userData.updatedAt) {
        userData.updatedAt = new Date(userData.updatedAt);
      }
      
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  });

  app.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Convert date strings to Date objects
      if (updates.createdAt) {
        updates.createdAt = new Date(updates.createdAt);
      }
      if (updates.updatedAt) {
        updates.updatedAt = new Date(updates.updatedAt);
      }
      
      const user = await storage.updateUser(id, updates);
      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  });

  app.delete('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteUser(id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  });

  // Leave request routes
  app.get('/api/leave-requests', async (req, res) => {
    try {
      const { userId } = req.query;
      let requests;
      
      if (userId) {
        requests = await storage.getLeaveRequestsByUserId(userId as string);
      } else {
        requests = await storage.getAllLeaveRequests();
      }
      
      res.json(requests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      res.status(500).json({ message: 'Failed to fetch leave requests' });
    }
  });

  app.post('/api/leave-requests', async (req, res) => {
    try {
      const requestData = req.body;
      
      // Convert date strings to Date objects
      if (requestData.startDate) {
        requestData.startDate = new Date(requestData.startDate);
      }
      if (requestData.endDate) {
        requestData.endDate = new Date(requestData.endDate);
      }
      if (requestData.requestDate) {
        requestData.requestDate = new Date(requestData.requestDate);
      }
      if (requestData.approvedDate) {
        requestData.approvedDate = new Date(requestData.approvedDate);
      }
      
      const request = await storage.createLeaveRequest(requestData);
      res.json(request);
    } catch (error) {
      console.error('Error creating leave request:', error);
      res.status(500).json({ message: 'Failed to create leave request' });
    }
  });

  app.put('/api/leave-requests/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Convert date strings to Date objects
      if (updates.startDate) {
        updates.startDate = new Date(updates.startDate);
      }
      if (updates.endDate) {
        updates.endDate = new Date(updates.endDate);
      }
      if (updates.requestDate) {
        updates.requestDate = new Date(updates.requestDate);
      }
      if (updates.approvedDate) {
        updates.approvedDate = new Date(updates.approvedDate);
      }
      
      const request = await storage.updateLeaveRequest(id, updates);
      
      // Send email notification if status changed
      if (updates.status && (updates.status === 'อนุมัติ' || updates.status === 'ปฏิเสธ')) {
        try {
          const user = await storage.getUser(request.userId);
          if (user) {
            await sendLeaveApprovalNotification(user, request, updates.status, updates.approvedBy, updates.rejectedReason);
          }
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
          // Don't fail the request if email fails
        }
      }
      
      res.json(request);
    } catch (error) {
      console.error('Error updating leave request:', error);
      res.status(500).json({ message: 'Failed to update leave request' });
    }
  });

  app.delete('/api/leave-requests/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteLeaveRequest(id);
      res.json({ message: 'Leave request deleted successfully' });
    } catch (error) {
      console.error('Error deleting leave request:', error);
      res.status(500).json({ message: 'Failed to delete leave request' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}