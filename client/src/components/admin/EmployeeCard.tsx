import { UserData, Gender } from '@/types';

interface EmployeeCardProps {
  employee: UserData;
  onClick?: () => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onClick }) => {
  const getAvatarColor = (gender: Gender) => {
    return gender === Gender.MALE ? 'bg-indigo-500' : 'bg-sky-500';
  };

  const getInitials = (nickname: string) => {
    return nickname.substring(0, 2);
  };

  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        {employee.profilePicture ? (
          <img 
            src={employee.profilePicture} 
            alt={employee.nickname || employee.firstName} 
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />
        ) : (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getAvatarColor(employee.gender)}`}>
            <span className="text-white font-medium">
              {getInitials(employee.nickname)}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium text-gray-800">{employee.nickname}</p>
          <p className="text-sm text-gray-600">{employee.position}</p>
        </div>
      </div>
    </div>
  );
};
