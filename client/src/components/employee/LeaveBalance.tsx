import { useAuth } from '@/context/SimpleAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const LeaveBalance: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const balanceItems = [
    {
      type: 'วันลาสะสม',
      englishType: 'Accumulated Leave',
      balance: user.leaveBalances.accumulated,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      type: 'ลาป่วย',
      englishType: 'Sick Leave',
      balance: user.leaveBalances.sick,
      color: 'bg-red-50 text-red-600'
    },
    {
      type: 'ลาคลอดบุตร',
      englishType: 'Maternity Leave',
      balance: user.leaveBalances.maternity,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      type: 'ลาไปช่วยเหลือภริยาที่คลอดบุตร',
      englishType: 'Paternity Leave',
      balance: user.leaveBalances.paternity,
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      type: 'ลากิจส่วนตัว',
      englishType: 'Personal Leave',
      balance: user.leaveBalances.personal,
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      type: 'ลาพักผ่อน',
      englishType: 'Vacation Leave',
      balance: user.leaveBalances.vacation,
      color: 'bg-green-50 text-green-600'
    },
    {
      type: 'ลาอุปสมบทหรือการลาไปประกอบพิธีฮัจย์',
      englishType: 'Ordination Leave',
      balance: user.leaveBalances.ordination,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      type: 'ลาเข้ารับการตรวจเลือกทหาร',
      englishType: 'Military Leave',
      balance: user.leaveBalances.military,
      color: 'bg-gray-50 text-gray-600'
    },
    {
      type: 'ลาไปศึกษา ฝึกอบรม ปฏิบัติการวิจัย หรือดูงาน',
      englishType: 'Study Leave',
      balance: user.leaveBalances.study,
      color: 'bg-cyan-50 text-cyan-600'
    },
    {
      type: 'ลาไปปฏิบัติงานในองค์การระหว่างประเทศ',
      englishType: 'International Leave',
      balance: user.leaveBalances.international,
      color: 'bg-teal-50 text-teal-600'
    },
    {
      type: 'ลาติดตามคู่สมรส',
      englishType: 'Spouse Leave',
      balance: user.leaveBalances.spouse,
      color: 'bg-pink-50 text-pink-600'
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
