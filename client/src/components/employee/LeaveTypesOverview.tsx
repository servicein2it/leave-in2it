import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaveType } from '@/types';
import { Calendar, Clock, Heart, Baby, Briefcase, Plane, Church, Shield, GraduationCap, Globe, Users } from 'lucide-react';

const leaveTypeInfo = [
  {
    type: LeaveType.ACCUMULATED,
    icon: Calendar,
    description: "วันลาสะสมที่ได้รับจากการทำงาน"
  },
  {
    type: LeaveType.SICK,
    icon: Heart,
    description: "ลาเนื่องจากการเจ็บป่วย"
  },
  {
    type: LeaveType.MATERNITY,
    icon: Baby,
    description: "ลาคลอดบุตรสำหรับผู้หญิง"
  },
  {
    type: LeaveType.PATERNITY,
    icon: Users,
    description: "ลาช่วยเหลือภริยาที่คลอดบุตร"
  },
  {
    type: LeaveType.PERSONAL,
    icon: Briefcase,
    description: "ลาเพื่อธุระส่วนตัว"
  },
  {
    type: LeaveType.VACATION,
    icon: Plane,
    description: "ลาพักผ่อนเพื่อการท่องเที่ยว"
  },
  {
    type: LeaveType.ORDINATION,
    icon: Church,
    description: "ลาสำหรับพิธีทางศาสนา"
  },
  {
    type: LeaveType.MILITARY,
    icon: Shield,
    description: "ลาเข้ารับการตรวจเลือกทหาร"
  },
  {
    type: LeaveType.STUDY,
    icon: GraduationCap,
    description: "ลาเพื่อการศึกษาและพัฒนาตนเอง"
  },
  {
    type: LeaveType.INTERNATIONAL,
    icon: Globe,
    description: "ลาเพื่อปฏิบัติงานระหว่างประเทศ"
  },
  {
    type: LeaveType.SPOUSE,
    icon: Users,
    description: "ลาเพื่อติดตามคู่สมรส"
  }
];

export const LeaveTypesOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          ประเภทการลาทั้งหมด
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaveTypeInfo.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {item.type}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">หมายเหตุ</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• วันลาแต่ละประเภทมีเงื่อนไขและสิทธิ์ต่างกัน</li>
            <li>• ควรยื่นคำขอล่วงหน้าตามระเบียบบริษัท</li>
            <li>• ติดต่อฝ่ายบุคคลหากมีข้อสงสัย</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};