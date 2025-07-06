import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { LeaveRequestForm } from './LeaveRequestForm';
import { LeaveHistory } from './LeaveHistory';
import { LeaveBalance } from './LeaveBalance';
import { LeaveTypesOverview } from './LeaveTypesOverview';
import { ProfileModal } from './ProfileModal';
import { ProfileDashboard } from './ProfileDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const EmployeeDashboard: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onProfileClick={() => setShowProfile(true)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">แดชบอร์ด</TabsTrigger>
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
          
          <TabsContent value="profile" className="mt-8">
            <ProfileDashboard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
    </div>
  );
};
