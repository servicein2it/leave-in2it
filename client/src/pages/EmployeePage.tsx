import { useEffect } from 'react';
import { useAuth } from '@/context/SimpleAuthContext';
import { useLocation } from 'wouter';
import { UserRole } from '@/types';
import { EmployeeDashboard } from '@/components/employee/EmployeeDashboard';
import { Loading } from '@/components/ui/loading';

export default function EmployeePage() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/');
    } else if (user && user.role !== UserRole.EMPLOYEE) {
      setLocation('/admin');
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return <Loading className="h-screen" />;
  }

  if (!user || user.role !== UserRole.EMPLOYEE) {
    return <Loading className="h-screen" />;
  }

  return <EmployeeDashboard />;
}
