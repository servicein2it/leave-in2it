import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendLeaveApprovalNotification } from "./emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Email notification endpoint for leave approvals
  app.post('/api/leave-approval-email', async (req, res) => {
    try {
      const { employee, leaveRequest, status, approver, rejectionReason } = req.body;
      
      if (!employee || !leaveRequest || !status || !approver) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }

      const emailSent = await sendLeaveApprovalNotification(
        employee,
        leaveRequest,
        status,
        approver,
        rejectionReason
      );

      if (emailSent) {
        res.json({ 
          success: true, 
          message: 'Email notification sent successfully' 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: 'Failed to send email notification' 
        });
      }
    } catch (error) {
      console.error('Error in leave approval email endpoint:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
