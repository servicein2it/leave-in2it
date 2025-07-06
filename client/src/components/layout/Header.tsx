import { useAuth } from '@/context/SimpleAuthContext';
import { UserRole, Gender } from '@/types';
import { useLocation } from 'wouter';

interface HeaderProps {
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const getAvatarColor = (gender: Gender) => {
    return gender === Gender.MALE ? 'bg-indigo-500' : 'bg-sky-500';
  };

  const getInitials = (nickname: string) => {
    return nickname.charAt(0);
  };

  const getTitle = () => {
    if (!user) return '';
    return user.role === UserRole.ADMIN ? 'ระบบจัดการการลา - ผู้ดูแลระบบ' : 'ระบบจัดการการลา';
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img 
              src="https://in2it-service.com/IN2IT/logo/in2it-logo.png" 
              alt="IN2IT" 
              className="h-8 w-auto"
            />
            <h1 className="ml-4 text-xl font-semibold text-gray-800">
              {getTitle()}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt={user.nickname || user.firstName || ''} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getAvatarColor(user?.gender || Gender.MALE)} border-2 border-gray-200 shadow-sm`}>
                  <span className="text-white text-sm font-medium">
                    {getInitials(user?.nickname || '')}
                  </span>
                </div>
              )}
              <span className="text-gray-700 font-medium">
                {user?.nickname || ''}
              </span>
            </div>
            
            {user?.role === UserRole.EMPLOYEE && onProfileClick && (
              <button 
                onClick={onProfileClick}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <i className="fas fa-cog"></i>
              </button>
            )}
            
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
