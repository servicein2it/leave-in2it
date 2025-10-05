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
    <div className="min-h-screen bg-[#fbfbfd]">
      <Header onProfileClick={handleProfileClick} />
      
      <div className="max-w-7xl mx-auto px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="inline-flex bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl border border-gray-200/50 shadow-sm">
              <TabsTrigger 
                value="dashboard"
                className="px-6 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="calendar"
                className="px-6 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
              >
                Calendar
              </TabsTrigger>
              <TabsTrigger 
                value="profile"
                className="px-6 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900"
              >
                Profile
              </TabsTrigger>
            </TabsList>
          </div>
          
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
