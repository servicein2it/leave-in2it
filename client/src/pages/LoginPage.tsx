import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { UserRole } from '@/types';
import { LoginForm } from '@/components/auth/LoginForm';
import { Loading } from '@/components/ui/loading';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user && !loading) {
      // Redirect based on user role
      if (user.role === UserRole.ADMIN) {
        setLocation('/admin');
      } else {
        setLocation('/employee');
      }
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return <Loading className="h-screen" />;
  }

  if (user) {
    return <Loading className="h-screen" />;
  }

  return <LoginForm />;
}
