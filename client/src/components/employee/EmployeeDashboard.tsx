import { useState, useEffect } from 'react';
import { useAuth } from '@/context/SimpleAuthContext';
import { LeaveRequest } from '@/types';
import { leaveRequestsAPI } from '@/services/api';
import { Header } from '@/components/layout/Header';
import { LeaveRequestForm } from './LeaveRequestForm';
import { LeaveHistory } from './LeaveHistory';
import { LeaveBalance } from './LeaveBalance';
import { LeaveTypesOverview } from './LeaveTypesOverview';

import { ProfileDashboard } from './ProfileDashboard';
import { CalendarView } from '../shared/CalendarView';
import { LeaveRequestModal } from '../shared/LeaveRequestModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userLeaveRequests, setUserLeaveRequests] = useState<LeaveRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadUserLeaveRequests();
  }, [user]);

  const loadUserLeaveRequests = async () => {
    if (!user) return;
    try {
      const requests = await leaveRequestsAPI.getByUserId(user.id);
      setUserLeaveRequests(requests);
    } catch (error) {
      console.error('Error loading user leave requests:', error);
    }
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onProfileClick={handleProfileClick} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">แดชบอร์ด</TabsTrigger>
            <TabsTrigger value="calendar">ปฏิทินการลา</TabsTrigger>
            <TabsTrigger value="profile">ข้อมูลส่วนตัว</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Forms and History */}
              <div className="lg:col-span-2 space-y-8">
                <LeaveRequestForm />
                <LeaveHistory />
              </div>

              {/* Right Column - Leave Balance and Types */}
              <div className="space-y-8">
                <LeaveBalance />
                <LeaveTypesOverview />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-8">
            <CalendarView 
              leaveRequests={userLeaveRequests}
              isAdmin={false}
              onEventClick={(event) => {
                setSelectedRequest(event.resource);
                setIsModalOpen(true);
              }}
            />
          </TabsContent>
          
          <TabsContent value="profile" className="mt-8">
            <ProfileDashboard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Leave Request Modal */}
      <LeaveRequestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
        employee={user}
        showActions={false}
      />
    </div>
  );
};
