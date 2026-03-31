import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';
import fs from 'fs';

// Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const NODE_ENV = process.env.NODE_ENV || 'development';
const MIGRATIONS_DIR = join(__dirname, '../src/db/migrations');

// Environment detection
const isCI = process.env.VERCEL === '1' || process.env.CI === 'true' || process.env.CI === '1';
const shouldRunDbInitOnCI = process.env.RUN_DB_INIT_ON_BUILD === 'true';

// Default admin credentials (should be changed in production)
const DEFAULT_ADMIN = {
  username: 'hieubhadmin@slice.com',
  password: 'hieubh',
  role: 'admin'
};

/**
 * Loads environment variables from the appropriate .env file
 * @returns {Record<string, string>} Parsed environment variables
 */
function loadEnvFile() {
  const envFileName = NODE_ENV === 'production' ? '.env' : '.env.local';
  const envPath = join(__dirname, '..', envFileName);

  console.log(`📂 Loading environment from: ${envFileName} (NODE_ENV: ${NODE_ENV})`);

  try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    return parseEnvContent(envContent);
  } catch (error) {
    console.warn(`⚠️ Could not load ${envFileName}: ${error.message}`);
    return {};
  }
}

/**
 * Parses .env file content into key-value pairs
 * @param {string} content - Raw .env file content
 * @returns {Record<string, string>} Parsed environment variables
 */
function parseEnvContent(content) {
  const envVars = {};

  for (const line of content.split('\n')) {
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) continue;

    const equalsIndex = trimmedLine.indexOf('=');
    if (equalsIndex === -1) continue;

    const key = trimmedLine.slice(0, equalsIndex).trim();
    const value = trimmedLine.slice(equalsIndex + 1).trim();

    if (key) {
      envVars[key] = value;
    }
  }

  return envVars;
}

/**
 * Creates and returns a Turso database client
 * @param {string} url - Database URL
 * @param {string} authToken - Authentication token
 * @returns {import('@libsql/client').Client} Database client
 */
function createDatabaseClient(url, authToken) {
  return createClient({ url, authToken });
}

/**
 * Executes a single migration file
 * @param {import('@libsql/client').Client} client - Database client
 * @param {string} filename - Migration filename
 * @param {string} sql - SQL content
 */
async function runMigration(client, filename, sql) {
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);

  try {
    for (const statement of statements) {
      await client.execute(statement);
    }
    console.log(`  ✓ ${filename} applied successfully`);
  } catch (error) {
    // Handle idempotent migration errors gracefully
    const isAlreadyApplied =
      error.message?.includes('duplicate column') ||
      error.message?.includes('already exists') ||
      error.message?.includes('no such column');

    if (isAlreadyApplied) {
      console.log(`  ⊘ ${filename} skipped (already applied)`);
      return;
    }

    console.error(`  ✗ Error in ${filename}:`, error.message);
    throw error;
  }
}

/**
 * Loads all migration files from the migrations directory
 * @returns {Promise<Array<{filename: string, sql: string}>>} Array of migrations
 */
async function loadMigrations() {
  try {
    const files = await readdir(MIGRATIONS_DIR);
    const sqlFiles = files.filter(file => file.endsWith('.sql')).sort();

    const migrations = await Promise.all(
      sqlFiles.map(async (filename) => {
        const filePath = join(MIGRATIONS_DIR, filename);
        const sql = await readFile(filePath, 'utf-8');
        return { filename, sql };
      })
    );

    return migrations;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn('⚠️ Migrations directory not found');
      return [];
    }
    throw error;
  }
}

/**
 * Gets the current user count from the database
 * @param {import('@libsql/client').Client} client - Database client
 * @returns {Promise<number>} User count
 */
async function getUserCount(client) {
  try {
    const result = await client.execute('SELECT COUNT(*) as count FROM users');
    return Number(result.rows?.[0]?.count) || 0;
  } catch (error) {
    console.error('Error getting user count:', error.message);
    return 0;
  }
}

/**
 * Creates a new user in the database
 * @param {import('@libsql/client').Client} client - Database client
 * @param {string} username - Username
 * @param {string} password - Password
 * @param {string} role - User role
 * @returns {Promise<object|null>} Created user or null
 */
async function createUser(client, username, password, role = 'user') {
  try {
    await client.execute({
      sql: 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      args: [username, password, role]
    });

    const result = await client.execute({
      sql: 'SELECT id, username, role, created_at FROM users WHERE username = ?',
      args: [username]
    });

    return result.rows?.[0] || null;
  } catch (error) {
    if (error.message?.includes('UNIQUE constraint') || error.message?.includes('already exists')) {
      throw new Error(`Username "${username}" already exists`);
    }
    throw error;
  }
}

/**
 * Runs all database migrations
 * @param {import('@libsql/client').Client} client - Database client
 */
async function runMigrations(client) {
  const migrations = await loadMigrations();
  console.log(`📋 Found ${migrations.length} migration(s)`);

  for (const { filename, sql } of migrations) {
    await runMigration(client, filename, sql);
  }
}

/**
 * Seeds the database with initial data
 * @param {import('@libsql/client').Client} client - Database client
 */
async function seedDatabase(client) {
  const userCount = await getUserCount(client);

  if (userCount > 0) {
    console.log(`👥 Found ${userCount} existing user(s), skipping seed`);
    return;
  }

  console.log('👤 Creating default admin user...');

  try {
    await createUser(client, DEFAULT_ADMIN.username, DEFAULT_ADMIN.password, DEFAULT_ADMIN.role);
    console.log(`✅ Default admin created: ${DEFAULT_ADMIN.username}`);
  } catch (error) {
    console.error('❌ Failed to create default admin:', error.message);
  }
}

/**
 * Main initialization function
 */
async function initDatabase() {
  // Skip on CI unless explicitly enabled
  if (isCI && !shouldRunDbInitOnCI) {
    console.log('Skipping database initialization on CI/Vercel');
    process.exit(0);
  }

  // Load environment variables
  const envVars = loadEnvFile();
  const databaseUrl = envVars.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL;
  const authToken = envVars.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

  // Validate required configuration
  if (!databaseUrl || !authToken) {
    console.error('❌ Missing required environment variables:');
    if (!databaseUrl) console.error('   - TURSO_DATABASE_URL');
    if (!authToken) console.error('   - TURSO_AUTH_TOKEN');
    process.exit(1);
  }

  console.log('🚀 Starting database initialization...\n');

  const client = createDatabaseClient(databaseUrl, authToken);

  try {
    // Run migrations
    console.log('📦 Running migrations...');
    await runMigrations(client);

    // Seed database
    console.log('\n🌱 Seeding database...');
    await seedDatabase(client);

    console.log('\n✨ Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

// Run initialization
initDatabase();
