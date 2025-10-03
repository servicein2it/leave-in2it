"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// netlify/functions/api.ts
var import_express = __toESM(require("express"), 1);
var import_serverless_http = __toESM(require("serverless-http"), 1);

// server/routes.ts
var import_http = require("http");

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertLeaveRequestSchema: () => insertLeaveRequestSchema,
  insertUserSchema: () => insertUserSchema,
  leaveRequests: () => leaveRequests,
  sessions: () => sessions,
  users: () => users
});
var import_pg_core = require("drizzle-orm/pg-core");
var import_drizzle_zod = require("drizzle-zod");
var users = (0, import_pg_core.pgTable)("users", {
  id: (0, import_pg_core.varchar)("id").primaryKey().notNull(),
  username: (0, import_pg_core.varchar)("username").unique().notNull(),
  password: (0, import_pg_core.varchar)("password").notNull(),
  role: (0, import_pg_core.varchar)("role").notNull(),
  // 'ADMIN' or 'EMPLOYEE'
  title: (0, import_pg_core.varchar)("title").notNull(),
  nickname: (0, import_pg_core.varchar)("nickname").notNull(),
  firstName: (0, import_pg_core.varchar)("first_name").notNull(),
  lastName: (0, import_pg_core.varchar)("last_name").notNull(),
  email: (0, import_pg_core.varchar)("email").unique().notNull(),
  phone: (0, import_pg_core.varchar)("phone").notNull(),
  position: (0, import_pg_core.varchar)("position").notNull(),
  profilePicture: (0, import_pg_core.varchar)("profile_picture"),
  address: (0, import_pg_core.text)("address"),
  socialMedia: (0, import_pg_core.varchar)("social_media"),
  lineUserId: (0, import_pg_core.varchar)("line_user_id"),
  gender: (0, import_pg_core.varchar)("gender").notNull(),
  // 'MALE' or 'FEMALE'
  leaveBalances: (0, import_pg_core.json)("leave_balances").$type().notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow().notNull()
});
var leaveRequests = (0, import_pg_core.pgTable)("leave_requests", {
  id: (0, import_pg_core.varchar)("id").primaryKey().notNull(),
  userId: (0, import_pg_core.varchar)("user_id").notNull(),
  employeeName: (0, import_pg_core.varchar)("employee_name").notNull(),
  leaveType: (0, import_pg_core.varchar)("leave_type").notNull(),
  startDate: (0, import_pg_core.timestamp)("start_date").notNull(),
  endDate: (0, import_pg_core.timestamp)("end_date").notNull(),
  totalDays: (0, import_pg_core.integer)("total_days").notNull(),
  reason: (0, import_pg_core.text)("reason").notNull(),
  contactNumber: (0, import_pg_core.varchar)("contact_number").notNull(),
  status: (0, import_pg_core.varchar)("status").notNull(),
  // 'รอพิจารณา', 'อนุมัติ', 'ปฏิเสธ'
  requestDate: (0, import_pg_core.timestamp)("request_date").defaultNow().notNull(),
  approvedBy: (0, import_pg_core.varchar)("approved_by"),
  approvedDate: (0, import_pg_core.timestamp)("approved_date"),
  documentUrl: (0, import_pg_core.varchar)("document_url"),
  // For sick leave documents
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull(),
  updatedAt: (0, import_pg_core.timestamp)("updated_at").defaultNow().notNull()
});
var sessions = (0, import_pg_core.pgTable)("sessions", {
  sid: (0, import_pg_core.varchar)("sid").primaryKey(),
  sess: (0, import_pg_core.json)("sess").notNull(),
  expire: (0, import_pg_core.timestamp)("expire").notNull()
});
var insertUserSchema = (0, import_drizzle_zod.createInsertSchema)(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertLeaveRequestSchema = (0, import_drizzle_zod.createInsertSchema)(leaveRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
var import_pg = require("pg");
var import_node_postgres = require("drizzle-orm/node-postgres");
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new import_pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
var db = (0, import_node_postgres.drizzle)({ client: pool, schema: schema_exports });

// server/storage.ts
var import_drizzle_orm = require("drizzle-orm");
var import_uuid = require("uuid");
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where((0, import_drizzle_orm.eq)(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const userId = (0, import_uuid.v4)();
    const userData = {
      ...insertUser,
      id: userId,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  async updateUser(id, updates) {
    const [user] = await db.update(users).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm.eq)(users.id, id)).returning();
    return user;
  }
  async getAllUsers() {
    return await db.select().from(users).orderBy((0, import_drizzle_orm.desc)(users.createdAt));
  }
  async deleteUser(id) {
    await db.delete(users).where((0, import_drizzle_orm.eq)(users.id, id));
  }
  // Leave request operations
  async getLeaveRequest(id) {
    const [request] = await db.select().from(leaveRequests).where((0, import_drizzle_orm.eq)(leaveRequests.id, id));
    return request || void 0;
  }
  async getLeaveRequestsByUserId(userId) {
    return await db.select().from(leaveRequests).where((0, import_drizzle_orm.eq)(leaveRequests.userId, userId)).orderBy((0, import_drizzle_orm.desc)(leaveRequests.createdAt));
  }
  async getAllLeaveRequests() {
    return await db.select().from(leaveRequests).orderBy((0, import_drizzle_orm.desc)(leaveRequests.createdAt));
  }
  async createLeaveRequest(insertRequest) {
    const requestId = (0, import_uuid.v4)();
    const requestData = {
      ...insertRequest,
      id: requestId,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    const [request] = await db.insert(leaveRequests).values(requestData).returning();
    return request;
  }
  async updateLeaveRequest(id, updates) {
    const [request] = await db.update(leaveRequests).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where((0, import_drizzle_orm.eq)(leaveRequests.id, id)).returning();
    return request;
  }
  async deleteLeaveRequest(id) {
    await db.delete(leaveRequests).where((0, import_drizzle_orm.eq)(leaveRequests.id, id));
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
var AuthService = class {
  async login(username, password) {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return null;
      }
      if (user.password === password) {
        return user;
      }
      return null;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  }
  async createDefaultAdmin() {
    try {
      const existingAdmin = await storage.getUserByUsername("admin");
      if (existingAdmin) {
        console.log("Admin user already exists");
        return;
      }
      const adminUser = {
        username: "admin",
        password: "admin",
        // In production, hash this
        role: "ADMIN",
        title: "\u0E19\u0E32\u0E22",
        nickname: "Admin",
        firstName: "\u0E1C\u0E39\u0E49\u0E14\u0E39\u0E41\u0E25",
        lastName: "\u0E23\u0E30\u0E1A\u0E1A",
        email: "admin@in2it.co.th",
        phone: "02-123-4567",
        position: "System Administrator",
        profilePicture: "",
        address: "",
        socialMedia: "",
        lineUserId: "",
        gender: "MALE",
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
        }
      };
      await storage.createUser(adminUser);
      console.log("Admin user created successfully");
    } catch (error) {
      console.error("Error creating admin user:", error);
    }
  }
};
var authService = new AuthService();

// server/emailService.ts
var import_nodemailer = __toESM(require("nodemailer"), 1);
var createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log("Gmail credentials not configured, email service disabled");
    return null;
  }
  return import_nodemailer.default.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
      // Use App Password, not regular password
    }
  });
};
async function sendEmail(params) {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log("Gmail credentials not configured, skipping email");
      return false;
    }
    const mailOptions = {
      from: `"IN2IT Leave Management" <${process.env.GMAIL_USER}>`,
      to: params.to,
      subject: params.subject,
      text: params.text || "",
      html: params.html
    };
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return true;
  } catch (error) {
    console.error("Gmail SMTP email error:", error);
    return false;
  }
}
function generateLeaveApprovalEmail(employee, leaveRequest, status, approver) {
  const isApproved = status === "\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34" /* APPROVED */;
  const statusText = isApproved ? "\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34" : "\u0E1B\u0E0F\u0E34\u0E40\u0E2A\u0E18";
  const statusColor = isApproved ? "#22c55e" : "#ef4444";
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Bangkok"
    }).format(date);
  };
  const subject = `[IN2IT] \u0E04\u0E33\u0E02\u0E2D\u0E25\u0E32\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13${statusText}\u0E41\u0E25\u0E49\u0E27 - ${leaveRequest.leaveType}`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px 20px; }
    .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
    .approved { background-color: #dcfce7; color: #166534; }
    .rejected { background-color: #fee2e2; color: #991b1b; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
    .info-item { padding: 15px; background: #f8fafc; border-radius: 6px; border-left: 4px solid ${statusColor}; }
    .info-label { font-weight: bold; color: #475569; margin-bottom: 5px; }
    .info-value { color: #1e293b; }
    .rejection-reason { background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin: 20px 0; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 0; color: #64748b; font-size: 14px; }
    @media (max-width: 600px) {
      .info-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>\u{1F3E2} IN2IT Company</h1>
      <p>\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E01\u0E32\u0E23\u0E25\u0E32</p>
    </div>
    
    <div class="content">
      <h2>\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35\u0E04\u0E38\u0E13${employee.firstName} ${employee.lastName}</h2>
      
      <p>\u0E04\u0E33\u0E02\u0E2D\u0E25\u0E32\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23<span class="status-badge ${isApproved ? "approved" : "rejected"}">${statusText}</span>\u0E41\u0E25\u0E49\u0E27</p>
      
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E01\u0E32\u0E23\u0E25\u0E32</div>
          <div class="info-value">${leaveRequest.leaveType}</div>
        </div>
        <div class="info-item">
          <div class="info-label">\u0E08\u0E33\u0E19\u0E27\u0E19\u0E27\u0E31\u0E19</div>
          <div class="info-value">${leaveRequest.totalDays} \u0E27\u0E31\u0E19</div>
        </div>
        <div class="info-item">
          <div class="info-label">\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19</div>
          <div class="info-value">${formatDate(leaveRequest.startDate)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E34\u0E49\u0E19\u0E2A\u0E38\u0E14</div>
          <div class="info-value">${formatDate(leaveRequest.endDate)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25</div>
          <div class="info-value">${leaveRequest.reason}</div>
        </div>
        <div class="info-item">
          <div class="info-label">${isApproved ? "\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E42\u0E14\u0E22" : "\u0E1B\u0E0F\u0E34\u0E40\u0E2A\u0E18\u0E42\u0E14\u0E22"}</div>
          <div class="info-value">${approver}</div>
        </div>
      </div>
      

      
      <p>
        ${isApproved ? "\u0E04\u0E38\u0E13\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E23\u0E34\u0E48\u0E21\u0E25\u0E32\u0E44\u0E14\u0E49\u0E15\u0E32\u0E21\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E17\u0E35\u0E48\u0E23\u0E30\u0E1A\u0E38\u0E43\u0E19\u0E04\u0E33\u0E02\u0E2D \u0E2B\u0E32\u0E01\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E2A\u0E07\u0E2A\u0E31\u0E22\u0E01\u0E23\u0E38\u0E13\u0E32\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E1D\u0E48\u0E32\u0E22\u0E1A\u0E38\u0E04\u0E04\u0E25" : "\u0E2B\u0E32\u0E01\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E2A\u0E07\u0E2A\u0E31\u0E22\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E1B\u0E0F\u0E34\u0E40\u0E2A\u0E18\u0E04\u0E33\u0E02\u0E2D\u0E25\u0E32 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E1D\u0E48\u0E32\u0E22\u0E1A\u0E38\u0E04\u0E04\u0E25\u0E2B\u0E23\u0E37\u0E2D\u0E1C\u0E39\u0E49\u0E1A\u0E31\u0E07\u0E04\u0E31\u0E1A\u0E1A\u0E31\u0E0D\u0E0A\u0E32"}
      </p>
    </div>
    
    <div class="footer">
      <p>\xA9 2025 IN2IT Company - \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E01\u0E32\u0E23\u0E25\u0E32</p>
      <p>\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E19\u0E35\u0E49\u0E16\u0E39\u0E01\u0E2A\u0E48\u0E07\u0E42\u0E14\u0E22\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E2D\u0E22\u0E48\u0E32\u0E15\u0E2D\u0E1A\u0E01\u0E25\u0E31\u0E1A</p>
    </div>
  </div>
</body>
</html>
  `;
  const text2 = `
\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35\u0E04\u0E38\u0E13${employee.firstName} ${employee.lastName}

\u0E04\u0E33\u0E02\u0E2D\u0E25\u0E32\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23${statusText}\u0E41\u0E25\u0E49\u0E27

\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E04\u0E33\u0E02\u0E2D\u0E25\u0E32:
- \u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E01\u0E32\u0E23\u0E25\u0E32: ${leaveRequest.leaveType}
- \u0E08\u0E33\u0E19\u0E27\u0E19\u0E27\u0E31\u0E19: ${leaveRequest.totalDays} \u0E27\u0E31\u0E19
- \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19: ${formatDate(leaveRequest.startDate)}
- \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E34\u0E49\u0E19\u0E2A\u0E38\u0E14: ${formatDate(leaveRequest.endDate)}
- \u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25: ${leaveRequest.reason}
- ${isApproved ? "\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E42\u0E14\u0E22" : "\u0E1B\u0E0F\u0E34\u0E40\u0E2A\u0E18\u0E42\u0E14\u0E22"}: ${approver}



${isApproved ? "\u0E04\u0E38\u0E13\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E23\u0E34\u0E48\u0E21\u0E25\u0E32\u0E44\u0E14\u0E49\u0E15\u0E32\u0E21\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E17\u0E35\u0E48\u0E23\u0E30\u0E1A\u0E38\u0E43\u0E19\u0E04\u0E33\u0E02\u0E2D \u0E2B\u0E32\u0E01\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E2A\u0E07\u0E2A\u0E31\u0E22\u0E01\u0E23\u0E38\u0E13\u0E32\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E1D\u0E48\u0E32\u0E22\u0E1A\u0E38\u0E04\u0E04\u0E25" : "\u0E2B\u0E32\u0E01\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E2A\u0E07\u0E2A\u0E31\u0E22\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E1B\u0E0F\u0E34\u0E40\u0E2A\u0E18\u0E04\u0E33\u0E02\u0E2D\u0E25\u0E32 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E1D\u0E48\u0E32\u0E22\u0E1A\u0E38\u0E04\u0E04\u0E25\u0E2B\u0E23\u0E37\u0E2D\u0E1C\u0E39\u0E49\u0E1A\u0E31\u0E07\u0E04\u0E31\u0E1A\u0E1A\u0E31\u0E0D\u0E0A\u0E32"}

IN2IT Company
\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E01\u0E32\u0E23\u0E25\u0E32
  `;
  return {
    to: employee.email,
    from: process.env.GMAIL_USER || "noreply@company.com",
    subject,
    text: text2,
    html
  };
}
async function sendLeaveApprovalNotification(employee, leaveRequest, status, approver) {
  try {
    const emailParams = generateLeaveApprovalEmail(employee, leaveRequest, status, approver);
    const success = await sendEmail(emailParams);
    if (success) {
      console.log(`Email notification sent to ${employee.email} for leave request ${leaveRequest.id}`);
    } else {
      console.error(`Failed to send email notification to ${employee.email}`);
    }
    return success;
  } catch (error) {
    console.error("Error sending leave approval notification:", error);
    return false;
  }
}
function generateAdminNotificationEmail(employee, leaveRequest) {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Bangkok"
    }).format(date);
  };
  const subject = `[IN2IT] \u0E04\u0E33\u0E02\u0E2D\u0E25\u0E32\u0E43\u0E2B\u0E21\u0E48 - ${employee.firstName} ${employee.lastName} (${leaveRequest.leaveType})`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px 20px; }
    .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; background-color: #fef3c7; color: #92400e; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
    .info-item { padding: 15px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #3b82f6; }
    .info-label { font-weight: bold; color: #475569; margin-bottom: 5px; }
    .info-value { color: #1e293b; }
    .urgent { background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin: 20px 0; }
    .action-buttons { text-align: center; margin: 30px 0; }
    .button { display: inline-block; padding: 12px 24px; margin: 0 10px; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .approve-btn { background-color: #22c55e; color: white; }
    .reject-btn { background-color: #ef4444; color: white; }
    .footer { background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 0; color: #64748b; font-size: 14px; }
    @media (max-width: 600px) {
      .info-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>\u{1F3E2} IN2IT Company</h1>
      <p>\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E01\u0E32\u0E23\u0E25\u0E32 - \u0E01\u0E32\u0E23\u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E41\u0E2D\u0E14\u0E21\u0E34\u0E19</p>
    </div>
    
    <div class="content">
      <h2>\u{1F514} \u0E04\u0E33\u0E02\u0E2D\u0E25\u0E32\u0E43\u0E2B\u0E21\u0E48\u0E23\u0E2D\u0E01\u0E32\u0E23\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34</h2>
      
      <p><strong>${employee.firstName} ${employee.lastName}</strong> (${employee.title}) \u0E44\u0E14\u0E49\u0E2A\u0E48\u0E07\u0E04\u0E33\u0E02\u0E2D\u0E25\u0E32\u0E43\u0E2B\u0E21\u0E48</p>
      
      <span class="status-badge">\u0E23\u0E2D\u0E1E\u0E34\u0E08\u0E32\u0E23\u0E13\u0E32</span>
      
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">\u0E0A\u0E37\u0E48\u0E2D\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19</div>
          <div class="info-value">${employee.firstName} ${employee.lastName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">\u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07</div>
          <div class="info-value">${employee.title}</div>
        </div>
        <div class="info-item">
          <div class="info-label">\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E01\u0E32\u0E23\u0E25\u0E32</div>
          <div class="info-value">${leaveRequest.leaveType}</div>
        </div>
        <div class="info-item">
          <div class="info-label">\u0E08\u0E33\u0E19\u0E27\u0E19\u0E27\u0E31\u0E19</div>
          <div class="info-value">${leaveRequest.totalDays} \u0E27\u0E31\u0E19</div>
        </div>
        <div class="info-item">
          <div class="info-label">\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19</div>
          <div class="info-value">${formatDate(leaveRequest.startDate)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E34\u0E49\u0E19\u0E2A\u0E38\u0E14</div>
          <div class="info-value">${formatDate(leaveRequest.endDate)}</div>
        </div>
      </div>
      
      <div class="info-item" style="grid-column: 1 / -1;">
        <div class="info-label">\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E25\u0E32</div>
        <div class="info-value">${leaveRequest.reason}</div>
      </div>
      
      <div class="urgent">
        <strong>\u26A0\uFE0F \u0E02\u0E49\u0E2D\u0E21\u0E38\u0E25\u0E01\u0E32\u0E23\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D:</strong><br>
        \u0E2D\u0E35\u0E40\u0E21\u0E25: ${employee.email}
      </div>
      
      <p><strong>\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1E\u0E34\u0E08\u0E32\u0E23\u0E13\u0E32\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E04\u0E33\u0E02\u0E2D\u0E25\u0E32\u0E20\u0E32\u0E22\u0E43\u0E19 24 \u0E0A\u0E31\u0E48\u0E27\u0E42\u0E21\u0E07</strong></p>
      
      <p style="color: #64748b; font-size: 14px;">
        ID \u0E04\u0E33\u0E02\u0E2D: ${leaveRequest.id}<br>
        \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E07\u0E04\u0E33\u0E02\u0E2D: ${formatDate(/* @__PURE__ */ new Date())}
      </p>
    </div>
    
    <div class="footer">
      <p>\xA9 2025 IN2IT Company - \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E01\u0E32\u0E23\u0E25\u0E32</p>
      <p>\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E19\u0E35\u0E49\u0E16\u0E39\u0E01\u0E2A\u0E48\u0E07\u0E42\u0E14\u0E22\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E2D\u0E22\u0E48\u0E32\u0E15\u0E2D\u0E1A\u0E01\u0E25\u0E31\u0E1A</p>
    </div>
  </div>
</body>
</html>
  `;
  const text2 = `
\u{1F514} \u0E04\u0E33\u0E02\u0E2D\u0E25\u0E32\u0E43\u0E2B\u0E21\u0E48\u0E23\u0E2D\u0E01\u0E32\u0E23\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34 - IN2IT Company

${employee.firstName} ${employee.lastName} (${employee.title}) \u0E44\u0E14\u0E49\u0E2A\u0E48\u0E07\u0E04\u0E33\u0E02\u0E2D\u0E25\u0E32\u0E43\u0E2B\u0E21\u0E48

\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E04\u0E33\u0E02\u0E2D\u0E25\u0E32:
- \u0E0A\u0E37\u0E48\u0E2D\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19: ${employee.firstName} ${employee.lastName}
- \u0E15\u0E33\u0E41\u0E2B\u0E19\u0E48\u0E07: ${employee.title}
- \u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E01\u0E32\u0E23\u0E25\u0E32: ${leaveRequest.leaveType}
- \u0E08\u0E33\u0E19\u0E27\u0E19\u0E27\u0E31\u0E19: ${leaveRequest.totalDays} \u0E27\u0E31\u0E19
- \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19: ${formatDate(leaveRequest.startDate)}
- \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E34\u0E49\u0E19\u0E2A\u0E38\u0E14: ${formatDate(leaveRequest.endDate)}
- \u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E25\u0E32: ${leaveRequest.reason}

\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D:
- \u0E2D\u0E35\u0E40\u0E21\u0E25: ${employee.email}

\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1E\u0E34\u0E08\u0E32\u0E23\u0E13\u0E32\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E04\u0E33\u0E02\u0E2D\u0E25\u0E32\u0E20\u0E32\u0E22\u0E43\u0E19 24 \u0E0A\u0E31\u0E48\u0E27\u0E42\u0E21\u0E07

ID \u0E04\u0E33\u0E02\u0E2D: ${leaveRequest.id}
\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E07\u0E04\u0E33\u0E02\u0E2D: ${formatDate(/* @__PURE__ */ new Date())}

IN2IT Company - \u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E01\u0E32\u0E23\u0E25\u0E32
  `;
  return {
    to: process.env.ADMIN_EMAIL || "admin@company.com",
    // Admin email
    from: process.env.GMAIL_USER || "noreply@company.com",
    subject,
    text: text2,
    html
  };
}
async function sendAdminNotification(employee, leaveRequest) {
  try {
    const emailParams = generateAdminNotificationEmail(employee, leaveRequest);
    const success = await sendEmail(emailParams);
    if (success) {
      console.log(`Admin notification email sent for leave request ${leaveRequest.id} by ${employee.firstName} ${employee.lastName}`);
    } else {
      console.error(`Failed to send admin notification email for leave request ${leaveRequest.id}`);
    }
    return success;
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return false;
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  await authService.createDefaultAdmin();
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await authService.login(username, password);
      if (user) {
        res.json(user);
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.get("/api/users", async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = req.body;
      if (userData.createdAt) {
        userData.createdAt = new Date(userData.createdAt);
      }
      if (userData.updatedAt) {
        userData.updatedAt = new Date(userData.updatedAt);
      }
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.put("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (updates.createdAt) {
        updates.createdAt = new Date(updates.createdAt);
      }
      if (updates.updatedAt) {
        updates.updatedAt = new Date(updates.updatedAt);
      }
      const user = await storage.updateUser(id, updates);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  app2.delete("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.patch("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (updates.createdAt) {
        updates.createdAt = new Date(updates.createdAt);
      }
      if (updates.updatedAt) {
        updates.updatedAt = new Date(updates.updatedAt);
      }
      const user = await storage.updateUser(id, updates);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  app2.get("/api/leave-requests", async (req, res) => {
    try {
      const { userId } = req.query;
      let requests;
      if (userId) {
        requests = await storage.getLeaveRequestsByUserId(userId);
      } else {
        requests = await storage.getAllLeaveRequests();
      }
      res.json(requests);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      res.status(500).json({ message: "Failed to fetch leave requests" });
    }
  });
  app2.post("/api/leave-requests", async (req, res) => {
    try {
      const requestData = req.body;
      if (requestData.startDate) {
        requestData.startDate = new Date(requestData.startDate);
      }
      if (requestData.endDate) {
        requestData.endDate = new Date(requestData.endDate);
      }
      if (requestData.requestDate) {
        requestData.requestDate = new Date(requestData.requestDate);
      }
      if (requestData.approvedDate) {
        requestData.approvedDate = new Date(requestData.approvedDate);
      }
      const request = await storage.createLeaveRequest(requestData);
      try {
        const employee = await storage.getUser(request.userId);
        if (employee) {
          await sendAdminNotification(employee, request);
          console.log(`Admin notification sent for new leave request by ${employee.firstName} ${employee.lastName}`);
        }
      } catch (emailError) {
        console.error("Failed to send admin notification email:", emailError);
      }
      res.json(request);
    } catch (error) {
      console.error("Error creating leave request:", error);
      res.status(500).json({ message: "Failed to create leave request" });
    }
  });
  app2.put("/api/leave-requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (updates.startDate) {
        updates.startDate = new Date(updates.startDate);
      }
      if (updates.endDate) {
        updates.endDate = new Date(updates.endDate);
      }
      if (updates.requestDate) {
        updates.requestDate = new Date(updates.requestDate);
      }
      if (updates.approvedDate) {
        updates.approvedDate = new Date(updates.approvedDate);
      }
      const request = await storage.updateLeaveRequest(id, updates);
      if (updates.status === "\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34") {
        try {
          const user = await storage.getUser(request.userId);
          if (user) {
            const leaveTypeMap = {
              "\u0E27\u0E31\u0E19\u0E25\u0E32\u0E2A\u0E30\u0E2A\u0E21": "accumulated",
              "\u0E25\u0E32\u0E1B\u0E48\u0E27\u0E22": "sick",
              "\u0E25\u0E32\u0E04\u0E25\u0E2D\u0E14\u0E1A\u0E38\u0E15\u0E23": "maternity",
              "\u0E25\u0E32\u0E44\u0E1B\u0E0A\u0E48\u0E27\u0E22\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E20\u0E23\u0E34\u0E22\u0E32\u0E17\u0E35\u0E48\u0E04\u0E25\u0E2D\u0E14\u0E1A\u0E38\u0E15\u0E23": "paternity",
              "\u0E25\u0E32\u0E01\u0E34\u0E08\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27": "personal",
              "\u0E25\u0E32\u0E1E\u0E31\u0E01\u0E1C\u0E48\u0E2D\u0E19": "vacation",
              "\u0E25\u0E32\u0E2D\u0E38\u0E1B\u0E2A\u0E21\u0E1A\u0E17\u0E2B\u0E23\u0E37\u0E2D\u0E01\u0E32\u0E23\u0E25\u0E32\u0E44\u0E1B\u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A\u0E1E\u0E34\u0E18\u0E35\u0E2E\u0E31\u0E08\u0E22\u0E4C": "ordination",
              "\u0E25\u0E32\u0E40\u0E02\u0E49\u0E32\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E17\u0E2B\u0E32\u0E23": "military",
              "\u0E25\u0E32\u0E44\u0E1B\u0E28\u0E36\u0E01\u0E29\u0E32 \u0E1D\u0E36\u0E01\u0E2D\u0E1A\u0E23\u0E21 \u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E27\u0E34\u0E08\u0E31\u0E22 \u0E2B\u0E23\u0E37\u0E2D\u0E14\u0E39\u0E07\u0E32\u0E19": "study",
              "\u0E25\u0E32\u0E44\u0E1B\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E07\u0E32\u0E19\u0E43\u0E19\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E32\u0E23\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28": "international",
              "\u0E25\u0E32\u0E15\u0E34\u0E14\u0E15\u0E32\u0E21\u0E04\u0E39\u0E48\u0E2A\u0E21\u0E23\u0E2A": "spouse"
            };
            const balanceField = leaveTypeMap[request.leaveType];
            if (balanceField) {
              const currentBalance = user.leaveBalances[balanceField];
              const newBalance = Math.max(0, currentBalance - request.totalDays);
              await storage.updateUser(user.id, {
                leaveBalances: {
                  ...user.leaveBalances,
                  [balanceField]: newBalance
                }
              });
              console.log(`Deducted ${request.totalDays} days from ${request.leaveType} balance for user ${user.nickname || user.id}`);
            }
          }
        } catch (balanceError) {
          console.error("Failed to update leave balance:", balanceError);
        }
      }
      if (updates.status && (updates.status === "\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34" || updates.status === "\u0E1B\u0E0F\u0E34\u0E40\u0E2A\u0E18")) {
        try {
          const user = await storage.getUser(request.userId);
          if (user) {
            await sendLeaveApprovalNotification(user, request, updates.status, updates.approvedBy || "\u0E41\u0E2D\u0E14\u0E21\u0E34\u0E19");
            console.log(`Email notification sent to ${user.email} for ${updates.status} leave request ${request.id}`);
          }
        } catch (emailError) {
          console.error("Email notification failed:", emailError);
        }
      }
      res.json(request);
    } catch (error) {
      console.error("Error updating leave request:", error);
      res.status(500).json({ message: "Failed to update leave request" });
    }
  });
  app2.delete("/api/leave-requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const existingRequest = await storage.getLeaveRequest(id);
      if (!existingRequest) {
        return res.status(404).json({ message: "Leave request not found" });
      }
      if (existingRequest.status === "\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34") {
        try {
          const user = await storage.getUser(existingRequest.userId);
          if (user) {
            const leaveTypeMap = {
              "\u0E27\u0E31\u0E19\u0E25\u0E32\u0E2A\u0E30\u0E2A\u0E21": "accumulated",
              "\u0E25\u0E32\u0E1B\u0E48\u0E27\u0E22": "sick",
              "\u0E25\u0E32\u0E04\u0E25\u0E2D\u0E14\u0E1A\u0E38\u0E15\u0E23": "maternity",
              "\u0E25\u0E32\u0E44\u0E1B\u0E0A\u0E48\u0E27\u0E22\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E20\u0E23\u0E34\u0E22\u0E32\u0E17\u0E35\u0E48\u0E04\u0E25\u0E2D\u0E14\u0E1A\u0E38\u0E15\u0E23": "paternity",
              "\u0E25\u0E32\u0E01\u0E34\u0E08\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27": "personal",
              "\u0E25\u0E32\u0E1E\u0E31\u0E01\u0E1C\u0E48\u0E2D\u0E19": "vacation",
              "\u0E25\u0E32\u0E2D\u0E38\u0E1B\u0E2A\u0E21\u0E1A\u0E17\u0E2B\u0E23\u0E37\u0E2D\u0E01\u0E32\u0E23\u0E25\u0E32\u0E44\u0E1B\u0E1B\u0E23\u0E30\u0E01\u0E2D\u0E1A\u0E1E\u0E34\u0E18\u0E35\u0E2E\u0E31\u0E08\u0E22\u0E4C": "ordination",
              "\u0E25\u0E32\u0E40\u0E02\u0E49\u0E32\u0E23\u0E31\u0E1A\u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E17\u0E2B\u0E32\u0E23": "military",
              "\u0E25\u0E32\u0E44\u0E1B\u0E28\u0E36\u0E01\u0E29\u0E32 \u0E1D\u0E36\u0E01\u0E2D\u0E1A\u0E23\u0E21 \u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E27\u0E34\u0E08\u0E31\u0E22 \u0E2B\u0E23\u0E37\u0E2D\u0E14\u0E39\u0E07\u0E32\u0E19": "study",
              "\u0E25\u0E32\u0E44\u0E1B\u0E1B\u0E0F\u0E34\u0E1A\u0E31\u0E15\u0E34\u0E07\u0E32\u0E19\u0E43\u0E19\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E32\u0E23\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28": "international",
              "\u0E25\u0E32\u0E15\u0E34\u0E14\u0E15\u0E32\u0E21\u0E04\u0E39\u0E48\u0E2A\u0E21\u0E23\u0E2A": "spouse"
            };
            const balanceField = leaveTypeMap[existingRequest.leaveType];
            if (balanceField) {
              const currentBalance = user.leaveBalances[balanceField];
              const restoredBalance = currentBalance + existingRequest.totalDays;
              await storage.updateUser(user.id, {
                leaveBalances: {
                  ...user.leaveBalances,
                  [balanceField]: restoredBalance
                }
              });
              console.log(`Restored ${existingRequest.totalDays} days to ${existingRequest.leaveType} balance for user ${user.nickname || user.id}`);
            }
          }
        } catch (balanceError) {
          console.error("Failed to restore leave balance:", balanceError);
        }
      }
      await storage.deleteLeaveRequest(id);
      res.json({ message: "Leave request deleted successfully" });
    } catch (error) {
      console.error("Error deleting leave request:", error);
      res.status(500).json({ message: "Failed to delete leave request" });
    }
  });
  app2.post("/api/leave-approval-email", async (req, res) => {
    try {
      const { employee, leaveRequest, status, approver, rejectionReason } = req.body;
      await sendLeaveApprovalNotification(
        employee,
        leaveRequest,
        status,
        approver
      );
      res.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Email notification error:", error);
      res.status(500).json({ message: "Failed to send email notification" });
    }
  });
  const httpServer = (0, import_http.createServer)(app2);
  return httpServer;
}

// netlify/functions/api.ts
var app = (0, import_express.default)();
app.use(import_express.default.json({ limit: "10mb" }));
app.use(import_express.default.urlencoded({ extended: false, limit: "10mb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }
    if (logLine.length > 80) {
      logLine = logLine.slice(0, 79) + "\u2026";
    }
    console.log(logLine);
  });
  next();
});
var routesInitialized = false;
var initializeRoutes = async () => {
  if (!routesInitialized) {
    try {
      await registerRoutes(app);
      routesInitialized = true;
      console.log("Routes initialized successfully");
    } catch (error) {
      console.error("Failed to initialize routes:", error);
      throw error;
    }
  }
};
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("API Error:", err);
  res.status(status).json({ message });
});
var createHandler = async () => {
  await initializeRoutes();
  return (0, import_serverless_http.default)(app);
};
exports.handler = async (event, context) => {
  try {
    const handler = await createHandler();
    return await handler(event, context);
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" })
    };
  }
};
