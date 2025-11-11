// Test database connection and check for email_templates table
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to database successfully!');
    
    // Check if email_templates table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'email_templates'
      ) AS table_exists;
    `);
    
    const tableExists = tableCheck.rows[0].table_exists;
    console.log(`\n📋 Table 'email_templates' exists: ${tableExists ? '✅ YES' : '❌ NO'}`);
    
    if (tableExists) {
      // Count rows
      const countResult = await client.query('SELECT COUNT(*) FROM email_templates');
      console.log(`📊 Number of templates: ${countResult.rows[0].count}`);
      
      // Show templates
      const templates = await client.query('SELECT id, template_name, template_type FROM email_templates ORDER BY template_type');
      console.log('\n📝 Templates in database:');
      templates.rows.forEach(t => {
        console.log(`  - ${t.id}: ${t.template_name} (${t.template_type})`);
      });
    } else {
      console.log('\n❌ The email_templates table does NOT exist!');
      console.log('\n🔧 To fix this:');
      console.log('1. Go to Supabase Dashboard → SQL Editor');
      console.log('2. Run the SQL from: check-table-exists.sql');
      console.log('3. Make sure you see "Success" message');
      console.log('4. Refresh your application');
    }
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('\n🔧 Check:');
    console.error('1. DATABASE_URL is correct in .env file');
    console.error('2. Database is accessible');
    console.error('3. Network connection is working');
    process.exit(1);
  }
}

testConnection();
