import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function createTables() {
  try {
    console.log('Starting table creation...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        links JSONB
      );
    `;
    console.log('Created "users" table');

    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        technologies TEXT[],
        link VARCHAR(255),
        github_repo VARCHAR(255)
      );
    `;
    console.log('Created "projects" table');

    await sql`
      CREATE TABLE IF NOT EXISTS education (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        institution VARCHAR(255) NOT NULL,
        degree VARCHAR(255) NOT NULL,
        start_year INT,
        end_year INT
      );
    `;
    console.log('Created "education" table');

    await sql`
      CREATE TABLE IF NOT EXISTS skills (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        skill VARCHAR(255) NOT NULL
      );
    `;
    console.log('Created "skills" table');
    
    console.log('✅ All tables created successfully!');

  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function main() {
  await createTables();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to create the database tables:',
    err,
  );
});