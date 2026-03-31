import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const NODE_ENV = process.env.NODE_ENV || 'development';
const isVercelOrCiBuild =
  process.env.VERCEL === '1' ||
  process.env.CI === 'true' ||
  process.env.CI === '1';
const shouldRunDbInitOnCi = process.env.RUN_DB_INIT_ON_BUILD === 'true';

function loadEnvFile() {
  const envFileName = NODE_ENV === 'production' ? '.env' : '.env.local';
  const envPath = join(__dirname, `../${envFileName}`);
  
  console.log(`📂 Loading environment from: ${envFileName} (NODE_ENV: ${NODE_ENV})`);
  
  try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    return envVars;
  } catch (error) {
    console.warn(`⚠️ Could not load ${envFileName}: ${error.message}`);
    return {};
  }
}

const envVars = loadEnvFile();
const TURSO_DATABASE_URL = envVars.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = envVars.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

if (isVercelOrCiBuild && !shouldRunDbInitOnCi) {
  console.warn('⚠️ Skipping database initialization on CI/Vercel');
  process.exit(0);
}

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error('❌ Missing required environment variables: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN');
  process.exit(1);
}

const tursoClient = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

async function runMigrationFile(filename, sql) {
  try {
    const statements = sql.split(';').map(stmt => stmt.trim()).filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      if (statement) {
        await tursoClient.execute(statement);
      }
    }
    
    console.log(`  ✓ Migration ${filename} applied successfully`);
  } catch (error) {
    if (error.message?.includes("duplicate column") ||
        error.message?.includes("already exists") ||
        error.message?.includes("no such column")) {
      console.log(`  ⊘ Migration ${filename} skipped (already applied)`);
      return;
    }
    console.error(`  ✗ Error running migration ${filename}:`, error.message);
    throw error;
  }
}

async function loadMigrations() {
  const migrationsDir = join(__dirname, '../src/db/migrations');
  
  try {
    const files = await readdir(migrationsDir);
    const sqlFiles = files.filter(file => file.endsWith('.sql')).sort();
    
    const migrations = [];
    for (const file of sqlFiles) {
      const filePath = join(migrationsDir, file);
      const sql = await readFile(filePath, 'utf-8');
      migrations.push({ filename: file, sql });
    }
    return migrations;
  } catch (error) {
    console.error('Error loading migrations:', error);
    return [];
  }
}

async function checkUserCount() {
  try {
    const result = await tursoClient.execute('SELECT COUNT(*) as count FROM users');
    return result.rows?.[0]?.count || 0;
  } catch (error) {
    console.error('Error getting user count:', error);
    return 0;
  }
}

async function createUser(username, password, role = 'user') {
  try {
    await tursoClient.execute({
      sql: 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      args: [username, password, role]
    });
    
    const result = await tursoClient.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: [username]
    });
    
    return result.rows?.[0] || null;
  } catch (error) {
    if (error.message?.includes('UNIQUE constraint') || error.message?.includes('already exists')) {
      throw new Error('Username already exists');
    }
    console.error('Error creating user:', error);
    throw error;
  }
}

async function initDatabase() {
  console.log('📦 Starting database initialization...');
  
  const migrations = await loadMigrations();
  console.log(`📋 Found ${migrations.length} migration(s) to run`);
  
  for (const migration of migrations) {
    console.log(`  → Running ${migration.filename}...`);
    await runMigrationFile(migration.filename, migration.sql);
  }
  
  const userCount = await checkUserCount();
  if (userCount === 0) {
    try {
      console.log('👤 Creating default admin user...');
      await createUser('hieubhadmin@slice.com', 'hieubh', 'admin');
      console.log('✅ Default admin user created: hieubhadmin@slice.com');
    } catch (error) {
      console.error('❌ Error creating default admin user:', error);
    }
  } else {
    console.log(`👥 Found ${userCount} existing user(s), skipping default user creation`);
  }
  
  console.log('✨ Database initialization completed!');
}

async function main() {
  try {
    console.log('🚀 Starting database initialization...');
    await initDatabase();
    console.log('✅ Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

main();

