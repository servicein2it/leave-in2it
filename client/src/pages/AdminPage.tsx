import { useEffect } from 'react';
import { useAuth } from '@/context/SimpleAuthContext';
import { useLocation } from 'wouter';
import { UserRole } from '@/types';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Loading } from '@/components/ui/loading';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/');
    } else if (user && user.role !== UserRole.ADMIN) {
      setLocation('/employee');
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return <Loading className="h-screen" />;
  }

  if (!user || user.role !== UserRole.ADMIN) {
    return <Loading className="h-screen" />;
  }

  return <AdminDashboard />;
}
