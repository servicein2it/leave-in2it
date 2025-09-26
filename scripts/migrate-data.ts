// Temporary script to migrate data from old database to Supabase
import { db } from '../server/db';
import { users, leaveRequests } from '../shared/schema';

async function migrateData() {
  console.log('Starting data migration...');
  
  // First, let's check if data already exists
  const existingUsers = await db.select().from(users);
  console.log(`Found ${existingUsers.length} existing users`);
  
  if (existingUsers.length > 1) {
    console.log('Data already exists, skipping migration');
    return;
  }
  
  // Users data from old database
  const usersData = [
    {
      id: '43562180-4dd4-42d5-adcf-85d787762eef',
      username: 'mai',
      password: 'maiony1009',
      role: 'EMPLOYEE',
      title: 'นางสาว',
      nickname: 'เชียงใหม่',
      firstName: 'ธนพร',
      lastName: 'วงธัญกรณ์',
      email: 'mai@in2it.co.th',
      phone: '0910709334',
      position: 'Project Coordinator',
      profilePicture: 'data:image/png;base64,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',
      address: null,
      socialMedia: null,
      lineUserId: null,
      gender: 'FEMALE',
      leaveBalances: {
        accumulated: 0,
        sick: 0,
        maternity: 0,
        paternity: 0,
        personal: 0,
        vacation: 0,
        ordination: 0,
        military: 0,
        study: 0,
        international: 0,
        spouse: 0
      },
      createdAt: new Date('2025-07-06 06:15:53.28'),
      updatedAt: new Date('2025-07-06 06:15:53.28')
    },
    {
      id: 'fc9b9032-9f62-4e0f-82b0-896351d989d7',
      username: 'potae',
      password: 'maipaihai',
      role: 'EMPLOYEE',
      title: 'นาย',
      nickname: 'ป็อกแตง',
      firstName: 'รัชชานนท์',
      lastName: 'พังยะ',
      email: 'potae@in2it.co.th',
      phone: '0820334050',
      position: 'Full Stack Developer',
      profilePicture: null,
      address: null,
      socialMedia: null,
      lineUserId: null,
      gender: 'MALE',
      leaveBalances: {
        accumulated: 0,
        sick: 0,
        maternity: 0,
        paternity: 0,
        personal: 0,
        vacation: 0,
        ordination: 0,
        military: 0,
        study: 0,
        international: 0,
        spouse: 0
      },
      createdAt: new Date('2025-07-06 06:15:53.28'),
      updatedAt: new Date('2025-07-06 06:15:53.28')
    },
    {
      id: '862ce93d-d58e-466a-bc0d-95dc97438369',
      username: 'itim',
      password: 'itimmy20',
      role: 'EMPLOYEE',
      title: 'นางสาว',
      nickname: 'อิติม',
      firstName: 'สรวงสุดา',
      lastName: 'อนันต๊ะ',
      email: 'itim@in2it.co.th',
      phone: '0967442027',
      position: 'UX/UI Designer',
      profilePicture: null,
      address: null,
      socialMedia: null,
      lineUserId: null,
      gender: 'FEMALE',
      leaveBalances: {
        accumulated: 0,
        sick: 0,
        maternity: 0,
        paternity: 0,
        personal: 0,
        vacation: 0,
        ordination: 0,
        military: 0,
        study: 0,
        international: 0,
        spouse: 0
      },
      createdAt: new Date('2025-07-06 06:15:53.28'),
      updatedAt: new Date('2025-07-06 06:15:53.28')
    },
    {
      id: 'f3287296-f7fd-48a8-8238-07102284376b',
      username: 'up',
      password: 'upjaiya',
      role: 'EMPLOYEE',
      title: 'นาย',
      nickname: 'อัพ',
      firstName: 'เอกกร',
      lastName: 'อุ่นแก้ว',
      email: 'up@in2it.co.th',
      phone: '0638484599',
      position: 'Full Stack Developer',
      profilePicture: null,
      address: null,
      socialMedia: null,
      lineUserId: null,
      gender: 'MALE',
      leaveBalances: {
        accumulated: 0,
        sick: 0,
        maternity: 0,
        paternity: 0,
        personal: 0,
        vacation: 0,
        ordination: 0,
        military: 0,
        study: 0,
        international: 0,
        spouse: 0
      },
      createdAt: new Date('2025-07-06 06:15:53.28'),
      updatedAt: new Date('2025-07-06 06:15:53.28')
    },
    {
      id: 'd3f00d7a-9ade-4c15-b741-8a9b5b67e321',
      username: 'pornnapa',
      password: 'pornnapa2024',
      role: 'EMPLOYEE',
      title: 'นางสาว',
      nickname: 'นาปา',
      firstName: 'พรนภา',
      lastName: 'หนูพิทักษ์',
      email: 'pornnapa@in2it.co.th',
      phone: '0980123456',
      position: 'Project Manager',
      profilePicture: null,
      address: null,
      socialMedia: null,
      lineUserId: null,
      gender: 'FEMALE',
      leaveBalances: {
        accumulated: 0,
        sick: 0,
        maternity: 0,
        paternity: 0,
        personal: 0,
        vacation: 0,
        ordination: 0,
        military: 0,
        study: 0,
        international: 0,
        spouse: 0
      },
      createdAt: new Date('2025-07-06 06:15:53.28'),
      updatedAt: new Date('2025-07-06 06:15:53.28')
    },
    {
      id: 'a1b2c3d4-e5f6-4a5b-8c9d-1e2f3g4h5i6j',
      username: 'joom',
      password: 'joomzaa555',
      role: 'EMPLOYEE',
      title: 'นางสาว',
      nickname: 'จูม',
      firstName: 'สุธีรา',
      lastName: 'ไทยเจริญ',
      email: 'joom@in2it.co.th',
      phone: '0851234567',
      position: 'Business Analyst',
      profilePicture: null,
      address: null,
      socialMedia: null,
      lineUserId: null,
      gender: 'FEMALE',
      leaveBalances: {
        accumulated: 0,
        sick: 0,
        maternity: 0,
        paternity: 0,
        personal: 0,
        vacation: 0,
        ordination: 0,
        military: 0,
        study: 0,
        international: 0,
        spouse: 0
      },
      createdAt: new Date('2025-07-06 06:15:53.28'),
      updatedAt: new Date('2025-07-06 06:15:53.28')
    },
    {
      id: 'b2c3d4e5-f6g7-4h8i-9j0k-2l3m4n5o6p7q',
      username: 'bank',
      password: 'bankza777',
      role: 'EMPLOYEE',
      title: 'นาย',
      nickname: 'แบงค์',
      firstName: 'ธนาคาร',
      lastName: 'เงินทอง',
      email: 'bank@in2it.co.th',
      phone: '0869876543',
      position: 'DevOps Engineer',
      profilePicture: null,
      address: null,
      socialMedia: null,
      lineUserId: null,
      gender: 'MALE',
      leaveBalances: {
        accumulated: 0,
        sick: 0,
        maternity: 0,
        paternity: 0,
        personal: 0,
        vacation: 0,
        ordination: 0,
        military: 0,
        study: 0,
        international: 0,
        spouse: 0
      },
      createdAt: new Date('2025-07-06 06:15:53.28'),
      updatedAt: new Date('2025-07-06 06:15:53.28')
    }
  ];

  // Insert users data (excluding admin as it's already created)
  for (const userData of usersData) {
    try {
      await db.insert(users).values(userData);
      console.log(`Inserted user: ${userData.username}`);
    } catch (error) {
      console.log(`User ${userData.username} might already exist, skipping...`);
    }
  }

  console.log('Data migration completed successfully!');
  process.exit(0);
}

migrateData().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});