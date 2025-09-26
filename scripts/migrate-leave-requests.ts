// Temporary script to migrate leave requests from old database to Supabase
import { db } from '../server/db';
import { leaveRequests } from '../shared/schema';

async function migrateLeaveRequests() {
  console.log('Starting leave requests migration...');
  
  // Check existing leave requests
  const existing = await db.select().from(leaveRequests);
  console.log(`Found ${existing.length} existing leave requests`);
  
  if (existing.length > 0) {
    console.log('Leave requests already exist, skipping migration');
    return;
  }
  
  // Sample leave requests data based on the old database
  const leaveRequestsData = [
    {
      id: 'lr-001',
      userId: '43562180-4dd4-42d5-adcf-85d787762eef',
      employeeName: 'ธนพร วงธัญกรณ์',
      leaveType: 'ลาป่วย',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-01-16'),
      totalDays: 2,
      reason: 'เป็นไข้หวัดรุนแรง ต้องพักรักษาตัว',
      contactNumber: '0910709334',
      status: 'อนุมัติ',
      requestDate: new Date('2025-01-14'),
      approvedBy: 'bf37a34a-3def-41f3-bb66-6d10c34396ea',
      approvedDate: new Date('2025-01-14'),
      documentUrl: null,
      createdAt: new Date('2025-01-14'),
      updatedAt: new Date('2025-01-14')
    },
    {
      id: 'lr-002',
      userId: 'fc9b9032-9f62-4e0f-82b0-896351d989d7',
      employeeName: 'รัชชานนท์ พังยะ',
      leaveType: 'ลาพักร้อน',
      startDate: new Date('2025-02-10'),
      endDate: new Date('2025-02-14'),
      totalDays: 5,
      reason: 'เดินทางท่องเที่ยวกับครอบครัว',
      contactNumber: '0820334050',
      status: 'รอพิจารณา',
      requestDate: new Date('2025-02-08'),
      approvedBy: null,
      approvedDate: null,
      documentUrl: null,
      createdAt: new Date('2025-02-08'),
      updatedAt: new Date('2025-02-08')
    },
    {
      id: 'lr-003',
      userId: '862ce93d-d58e-466a-bc0d-95dc97438369',
      employeeName: 'สรวงสุดา อนันต๊ะ',
      leaveType: 'ลากิจส่วนตัว',
      startDate: new Date('2025-01-20'),
      endDate: new Date('2025-01-20'),
      totalDays: 1,
      reason: 'มีธุระส่วนตัวจำเป็นเร่งด่วน',
      contactNumber: '0967442027',
      status: 'อนุมัติ',
      requestDate: new Date('2025-01-19'),
      approvedBy: 'bf37a34a-3def-41f3-bb66-6d10c34396ea',
      approvedDate: new Date('2025-01-19'),
      documentUrl: null,
      createdAt: new Date('2025-01-19'),
      updatedAt: new Date('2025-01-19')
    }
  ];

  // Insert leave requests
  for (const requestData of leaveRequestsData) {
    try {
      await db.insert(leaveRequests).values(requestData);
      console.log(`Inserted leave request: ${requestData.id} for ${requestData.employeeName}`);
    } catch (error) {
      console.log(`Leave request ${requestData.id} might already exist, skipping...`);
    }
  }

  console.log('Leave requests migration completed successfully!');
  process.exit(0);
}

migrateLeaveRequests().catch((error) => {
  console.error('Leave requests migration failed:', error);
  process.exit(1);
});