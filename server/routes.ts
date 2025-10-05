import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authService } from "./auth";
import { sendLeaveApprovalNotification, sendAdminNotification } from "./emailService";

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

  // Get individual user by ID
  app.get('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  // PATCH route for partial user updates (used by profile dashboard)
  app.patch('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Convert date strings to Date objects if present
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
      
      // Send admin notification email for new leave request
      try {
        const employee = await storage.getUser(request.userId);
        if (employee) {
          await sendAdminNotification(employee, request);
          console.log(`Admin notification sent for new leave request by ${employee.firstName} ${employee.lastName}`);
        }
      } catch (emailError) {
        console.error('Failed to send admin notification email:', emailError);
        // Don't fail the request creation if email fails
      }
      
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
      
      // Handle leave balance deduction when request is approved
      if (updates.status === 'อนุมัติ') {
        try {
          const user = await storage.getUser(request.userId);
          if (user) {
            // Map Thai leave types to balance field names
            const leaveTypeMap: { [key: string]: keyof typeof user.leaveBalances } = {
              'วันลาสะสม': 'accumulated',
              'ลาป่วย': 'sick',
              'ลาคลอดบุตร': 'maternity',
              'ลาไปช่วยเหลือภริยาที่คลอดบุตร': 'paternity',
              'ลากิจส่วนตัว': 'personal',
              'ลาพักผ่อน': 'vacation',
              'ลาอุปสมบทหรือการลาไปประกอบพิธีฮัจย์': 'ordination',
              'ลาเข้ารับการตรวจเลือกทหาร': 'military',
              'ลาไปศึกษา ฝึกอบรม ปฏิบัติการวิจัย หรือดูงาน': 'study',
              'ลาไปปฏิบัติงานในองค์การระหว่างประเทศ': 'international',
              'ลาติดตามคู่สมรส': 'spouse'
            };

            const balanceField = leaveTypeMap[request.leaveType];
            if (balanceField) {
              const currentBalance = user.leaveBalances[balanceField];
              const newBalance = Math.max(0, currentBalance - request.totalDays);
              
              // Update user's leave balance
              await storage.updateUser(user.id, {
                leaveBalances: {
                  ...user.leaveBalances,
                  [balanceField]: newBalance
                }
              });
              
              console.log(`Deducted ${request.totalDays} days from ${request.leaveType} balance for user ${user.nickname || user.id}`);
            }
          }
        } catch (balanceError) {
          console.error('Failed to update leave balance:', balanceError);
          // Don't fail the request if balance update fails
        }
      }
      
      // Send email notification if status changed
      if (updates.status && (updates.status === 'อนุมัติ' || updates.status === 'ปฏิเสธ')) {
        try {
          const user = await storage.getUser(request.userId);
          if (user) {
            await sendLeaveApprovalNotification(user, request, updates.status, updates.approvedBy || 'แอดมิน');
            console.log(`Email notification sent to ${user.email} for ${updates.status} leave request ${request.id}`);
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
      
      // Get the leave request first to check its status
      const existingRequest = await storage.getLeaveRequest(id);
      if (!existingRequest) {
        return res.status(404).json({ message: 'Leave request not found' });
      }
      
      // If deleting an approved request, restore the leave balance
      if (existingRequest.status === 'อนุมัติ') {
        try {
          const user = await storage.getUser(existingRequest.userId);
          if (user) {
            // Map Thai leave types to balance field names
            const leaveTypeMap: { [key: string]: keyof typeof user.leaveBalances } = {
              'วันลาสะสม': 'accumulated',
              'ลาป่วย': 'sick',
              'ลาคลอดบุตร': 'maternity',
              'ลาไปช่วยเหลือภริยาที่คลอดบุตร': 'paternity',
              'ลากิจส่วนตัว': 'personal',
              'ลาพักผ่อน': 'vacation',
              'ลาอุปสมบทหรือการลาไปประกอบพิธีฮัจย์': 'ordination',
              'ลาเข้ารับการตรวจเลือกทหาร': 'military',
              'ลาไปศึกษา ฝึกอบรม ปฏิบัติการวิจัย หรือดูงาน': 'study',
              'ลาไปปฏิบัติงานในองค์การระหว่างประเทศ': 'international',
              'ลาติดตามคู่สมรส': 'spouse'
            };

            const balanceField = leaveTypeMap[existingRequest.leaveType];
            if (balanceField) {
              const currentBalance = user.leaveBalances[balanceField];
              const restoredBalance = currentBalance + existingRequest.totalDays;
              
              // Restore user's leave balance
              await storage.updateUser(user.id, {
                leaveBalances: {
                  ...user.leaveBalances,
                  [balanceField]: restoredBalance
                }
              });
              
              console.log(`Restored ${existingRequest.totalDays} days to ${existingRequest.leaveType} balance for user ${user.nickname || user.id}`);
            }
          }
        } catch (balanceError) {
          console.error('Failed to restore leave balance:', balanceError);
          // Continue with deletion even if balance restore fails
        }
      }
      
      await storage.deleteLeaveRequest(id);
      res.json({ message: 'Leave request deleted successfully' });
    } catch (error) {
      console.error('Error deleting leave request:', error);
      res.status(500).json({ message: 'Failed to delete leave request' });
    }
  });

  // Email notification endpoint
  app.post('/api/leave-approval-email', async (req, res) => {
    try {
      const { employee, leaveRequest, status, approver, rejectionReason } = req.body;
      
      await sendLeaveApprovalNotification(
        employee, 
        leaveRequest, 
        status, 
        approver
      );
      
      res.json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Email notification error:', error);
      res.status(500).json({ message: 'Failed to send email notification' });
    }
  });

  // Email template routes
  app.get('/api/email-templates', async (req, res) => {
    try {
      const templates = await storage.getAllEmailTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Error fetching email templates:', error);
      res.status(500).json({ message: 'Failed to fetch email templates' });
    }
  });

  app.get('/api/email-templates/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getEmailTemplate(id);
      
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }
      
      res.json(template);
    } catch (error) {
      console.error('Error fetching email template:', error);
      res.status(500).json({ message: 'Failed to fetch email template' });
    }
  });

  app.put('/api/email-templates/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const template = await storage.updateEmailTemplate(id, updates);
      res.json(template);
    } catch (error) {
      console.error('Error updating email template:', error);
      res.status(500).json({ message: 'Failed to update email template' });
    }
  });

  app.post('/api/email-templates/test', async (req, res) => {
    try {
      const { templateId, testEmail } = req.body;
      
      const template = await storage.getEmailTemplate(templateId);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }

      // Send test email with sample data
      const { sendTestEmail } = await import('./emailService');
      await sendTestEmail(template, testEmail);
      
      res.json({ message: 'Test email sent successfully' });
    } catch (error) {
      console.error('Error sending test email:', error);
      res.status(500).json({ message: 'Failed to send test email' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}