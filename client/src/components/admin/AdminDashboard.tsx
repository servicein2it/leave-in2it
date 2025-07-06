import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { UserData, LeaveRequest, LeaveStatus } from '@/types';
import { hybridFirestoreService } from '@/services/firebase/hybrid';
import { Header } from '@/components/layout/Header';
import { EmployeeCard } from './EmployeeCard';
import { AllLeaveRequests } from './AllLeaveRequests';
import { EmployeeLeaveView } from './EmployeeLeaveView';
import { Card, CardContent } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';

export const AdminDashboard: React.FC = () => {
  const [, setLocation] = useLocation();
  const [employees, setEmployees] = useState<UserData[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewingEmployeeId, setViewingEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [allUsers, allRequests] = await Promise.all([
        hybridFirestoreService.users.get(),
        hybridFirestoreService.leaveRequests.get()
      ]);

      const employeeUsers = allUsers.filter(u => u.role === 'EMPLOYEE');
      const pendingRequests = allRequests.filter(r => r.status === LeaveStatus.PENDING);
      
      setEmployees(employeeUsers);
      setPendingRequestsCount(pendingRequests.length);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading className="h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => setLocation('/admin/employees')}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary/10 rounded-full">
                  <i className="fas fa-users text-primary text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">จัดการพนักงาน</h3>
                  <p className="text-sm text-gray-600">เพิ่ม แก้ไข ลบข้อมูลพนักงาน</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <i className="fas fa-calendar-check text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">คำขอรอพิจารณา</h3>
                  <p className="text-2xl font-bold text-green-600">{pendingRequestsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <i className="fas fa-chart-line text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">พนักงานทั้งหมด</h3>
                  <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Quick Access */}
        <Card className="shadow-sm mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">พนักงานในระบบ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {employees.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  ไม่มีพนักงานในระบบ
                </div>
              ) : (
                employees.map((employee) => (
                  <EmployeeCard 
                    key={employee.id} 
                    employee={employee}
                    onClick={() => setViewingEmployeeId(employee.id)}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* All Leave Requests */}
        <AllLeaveRequests />
      </div>

      {/* Employee Leave View */}
      <EmployeeLeaveView
        employeeId={viewingEmployeeId}
        onClose={() => setViewingEmployeeId(null)}
      />
    </div>
  );
};
