import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { initialSeedData } from '../src/lib/db/seed-data.js';

// Helper to load .env.local if running directly with node
function loadEnvLocal() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    }
  } catch {
    // Ignore error
  }
}

loadEnvLocal();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'mayur_portfolio';

async function runSeed() {
  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is required to initialize the database.');
    console.error('Please configure your MongoDB Atlas connection string in .env.local');
    process.exit(1);
  }

  console.log(`[Seed] Connecting to MongoDB Atlas database: "${dbName}"...`);
  
  let client;
  try {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    await client.connect();
  } catch (err) {
    if (uri.startsWith('mongodb+srv://') && (err.message?.includes('querySrv') || err.message?.includes('EBADRESP'))) {
      const match = uri.match(/mongodb\+srv:\/\/([^@]+)@cluster0\.1vjjoyi\.mongodb\.net/);
      if (match) {
        const creds = match[1];
        const directUri = `mongodb://${creds}@ac-bzrotc1-shard-00-00.1vjjoyi.mongodb.net:27017,ac-bzrotc1-shard-00-01.1vjjoyi.mongodb.net:27017,ac-bzrotc1-shard-00-02.1vjjoyi.mongodb.net:27017/${dbName}?ssl=true&replicaSet=atlas-gf4b8q-shard-0&authSource=admin&retryWrites=true&w=majority`;
        console.log('[Seed] Retrying with direct shard replica set hosts...');
        client = new MongoClient(directUri, {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 10000,
        });
        await client.connect();
      } else {
        throw err;
      }
    } else {
      throw err;
    }
  }

  try {
    console.log(`✓ Connected to MongoDB Atlas. Database: ${dbName}`);
    const db = client.db(dbName);

    // 1. Site Settings
    const settingsCount = await db.collection('site_settings').countDocuments();
    if (settingsCount === 0) {
      await db.collection('site_settings').insertOne(initialSeedData.siteSettings);
      console.log('✓ Initialized default site settings & profile.');
    } else {
      console.log('ℹ Site settings collection already present.');
    }

    // 2. Projects
    const projectsCount = await db.collection('projects').countDocuments();
    if (projectsCount === 0) {
      await db.collection('projects').insertMany(initialSeedData.projects);
      console.log(`✓ Seeded ${initialSeedData.projects.length} initial portfolio projects.`);
    } else {
      console.log(`ℹ Projects collection already has ${projectsCount} items.`);
    }

    // 3. Services
    const servicesCount = await db.collection('services').countDocuments();
    if (servicesCount === 0) {
      await db.collection('services').insertMany(initialSeedData.services);
      console.log(`✓ Seeded ${initialSeedData.services.length} services.`);
    } else {
      console.log(`ℹ Services collection already has ${servicesCount} items.`);
    }

    // 4. Skill Categories
    const catCount = await db.collection('skill_categories').countDocuments();
    if (catCount === 0) {
      await db.collection('skill_categories').insertMany(initialSeedData.skillCategories);
      console.log(`✓ Seeded ${initialSeedData.skillCategories.length} skill categories.`);
    } else {
      console.log(`ℹ Skill categories already initialized.`);
    }

    // 5. Skills
    const skillsCount = await db.collection('skills').countDocuments();
    if (skillsCount === 0) {
      await db.collection('skills').insertMany(initialSeedData.skills);
      console.log(`✓ Seeded ${initialSeedData.skills.length} skills.`);
    } else {
      console.log(`ℹ Skills collection already has ${skillsCount} items.`);
    }

    // 6. Security & Performance Indexes
    await db.collection('projects').createIndex({ slug: 1 }, { unique: true });
    await db.collection('projects').createIndex({ status: 1, sortOrder: 1 });
    await db.collection('skills').createIndex({ categoryId: 1, sortOrder: 1 });
    await db.collection('admin_users').createIndex({ email: 1 }, { unique: true });
    await db.collection('contact_messages').createIndex({ status: 1, createdAt: -1 });
    await db.collection('audit_logs').createIndex({ timestamp: -1 });

    console.log('✓ Created necessary MongoDB unique and query indexes.');
    console.log('===============================================================');
    console.log('Database content initialized successfully!');
    console.log('To create your private administrator account securely, run:');
    console.log('  npm run bootstrap:admin');
    console.log('===============================================================');
  } catch (error) {
    console.error('❌ Seed script encountered an error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

runSeed();
