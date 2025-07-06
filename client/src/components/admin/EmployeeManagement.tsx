import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { UserData, UserRole, Gender } from '@/types';
import { usersAPI } from '@/services/api';
import { EmployeeModal } from './EmployeeModal';
import { EmployeeLeaveView } from './EmployeeLeaveView';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';

export const EmployeeManagement: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<UserData[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<UserData | null>(null);
  const [viewingEmployeeId, setViewingEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm]);

  const loadEmployees = async () => {
    try {
      const allUsers = await usersAPI.getAll();
      const employeeUsers = allUsers.filter(u => u.role === UserRole.EMPLOYEE);
      setEmployees(employeeUsers);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    if (!searchTerm) {
      setFilteredEmployees(employees);
      return;
    }

    const filtered = employees.filter(employee =>
      employee.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleEditEmployee = (employee: UserData) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (window.confirm('คุณต้องการลบพนักงานคนนี้ใช่หรือไม่?')) {
      try {
        await usersAPI.delete(employeeId);
        toast({
          title: "ลบพนักงานสำเร็จ",
          description: "ข้อมูลพนักงานถูกลบออกจากระบบเรียบร้อยแล้ว",
        });
        loadEmployees();
      } catch (error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถลบพนักงานได้ กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      }
    }
  };

  const handleResetPassword = async (employeeId: string) => {
    if (window.confirm('คุณต้องการรีเซ็ตรหัสผ่านเป็น "123456" ใช่หรือไม่?')) {
      try {
        await hybridFirestoreService.users.update(employeeId, { password: '123456' });
        toast({
          title: "รีเซ็ตรหัสผ่านสำเร็จ",
          description: "รหัสผ่านถูกเปลี่ยนเป็น '123456' เรียบร้อยแล้ว",
        });
      } catch (error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        });
      }
    }
  };

  const getAvatarColor = (gender: Gender) => {
    return gender === Gender.MALE ? 'bg-indigo-500' : 'bg-sky-500';
  };

  const getGenderIcon = (gender: Gender) => {
    return gender === Gender.MALE ? 'fas fa-mars text-blue-500' : 'fas fa-venus text-pink-500';
  };

  const getInitials = (nickname: string) => {
    return nickname.charAt(0);
  };

  if (loading) {
    return <Loading className="h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => setLocation('/admin')}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-arrow-left"></i>
              </Button>
              <img 
                src="https://in2it-service.com/IN2IT/logo/in2it-logo.png" 
                alt="IN2IT" 
                className="h-8 w-auto"
              />
              <h1 className="ml-4 text-xl font-semibold text-gray-800">จัดการพนักงาน</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleAddEmployee}
                className="bg-primary hover:bg-primary/90 text-white font-medium"
              >
                <i className="fas fa-plus mr-2"></i>
                เพิ่มพนักงาน
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">รายชื่อพนักงาน</h2>
              <div className="flex space-x-4">
                <Input
                  type="text"
                  placeholder="ค้นหาพนักงาน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">ชื่อ</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">ตำแหน่ง</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">อีเมล</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500">
                        {searchTerm ? 'ไม่พบพนักงานที่ค้นหา' : 'ไม่มีพนักงานในระบบ'}
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            {employee.profilePicture ? (
                              <img 
                                src={employee.profilePicture} 
                                alt={employee.nickname || employee.firstName} 
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                              />
                            ) : (
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(employee.gender)}`}>
                                <span className="text-white font-medium">
                                  {getInitials(employee.nickname)}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-semibold text-gray-800">{employee.nickname}</p>
                                <i className={getGenderIcon(employee.gender)}></i>
                              </div>
                              <p className="text-sm text-gray-600">
                                {employee.title}{employee.firstName} {employee.lastName}
                              </p>
                              <p className="text-sm text-gray-500">@{employee.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{employee.position}</td>
                        <td className="py-4 px-4 text-gray-600">{employee.email}</td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditEmployee(employee)}
                              className="text-primary hover:text-primary/80"
                            >
                              <i className="fas fa-edit mr-1"></i>
                              แก้ไข
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResetPassword(employee.id)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <i className="fas fa-key mr-1"></i>
                              รีเซ็ตรหัสผ่าน
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setViewingEmployeeId(employee.id)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <i className="fas fa-calendar-alt mr-1"></i>
                              ใบลา
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <i className="fas fa-trash mr-1"></i>
                              ลบ
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        employee={editingEmployee}
        onSave={loadEmployees}
      />

      {/* Employee Leave View */}
      <EmployeeLeaveView
        employeeId={viewingEmployeeId}
        onClose={() => setViewingEmployeeId(null)}
      />
    </div>
  );
};
