import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LeaveBalance: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const balanceItems = [
    {
      type: 'ลาป่วย',
      englishType: 'Sick Leave',
      balance: user.leaveBalances.sick,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      type: 'ลาพักร้อน',
      englishType: 'Annual Leave',
      balance: user.leaveBalances.annual,
      color: 'bg-green-50 text-green-600'
    },
    {
      type: 'ลากิจส่วนตัว',
      englishType: 'Personal Leave',
      balance: user.leaveBalances.personal,
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      type: 'ลาคลอดบุตร',
      englishType: 'Maternity Leave',
      balance: user.leaveBalances.maternity,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">ยอดวันลาคงเหลือ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {balanceItems.map((item, index) => (
            <div 
              key={index}
              className={`flex justify-between items-center p-4 rounded-lg ${item.color.split(' ')[0]}`}
            >
              <div>
                <p className="font-medium text-gray-800">{item.type}</p>
                <p className="text-sm text-gray-600">{item.englishType}</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${item.color.split(' ')[1]}`}>
                  {item.balance}
                </p>
                <p className="text-sm text-gray-600">วัน</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
