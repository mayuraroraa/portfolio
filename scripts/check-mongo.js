import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

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
  } catch {}
}

loadEnvLocal();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'mayur_portfolio';

console.log('---------------------------------------------------------');
console.log('MongoDB Atlas Diagnostics');
console.log('Target Database:', dbName);
console.log('URI configured:', uri ? 'Yes (configured)' : 'No (missing)');
console.log('---------------------------------------------------------');

if (!uri) {
  console.log('❌ MONGODB_URI is not set in .env.local');
  process.exit(1);
}

async function testConnection(testUri, label) {
  console.log(`\nTesting ${label}...`);
  const client = new MongoClient(testUri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 8000,
  });

  try {
    await client.connect();
    console.log(`✓ Connection successful!`);
    const db = client.db(dbName);
    const ping = await db.command({ ping: 1 });
    console.log(`✓ Ping response:`, ping);

    const collections = await db.listCollections().toArray();
    console.log(`✓ Found ${collections.length} collection(s):`, collections.map(c => c.name));

    for (const c of collections) {
      const count = await db.collection(c.name).countDocuments();
      console.log(`   - ${c.name}: ${count} document(s)`);
    }

    await client.close();
    return true;
  } catch (err) {
    console.error(`❌ ${label} failed:`);
    console.error(`   Error name: ${err.name}`);
    console.error(`   Message: ${err.message}`);
    if (err.message.includes('alert number 80')) {
      console.error('\n⚠️  DIAGNOSIS: SSL alert 80 indicates your IP is NOT whitelisted in MongoDB Atlas.');
      console.error('👉 Solution: Go to MongoDB Atlas -> Security -> Network Access -> Add IP Address.');
      console.error('👉 Add 0.0.0.0/0 (Allow access from anywhere) or your current IP.');
    } else if (err.message.includes('EBADRESP') || err.message.includes('querySrv')) {
      console.error('\n⚠️  DIAGNOSIS: DNS SRV resolution error (common on cellular hotspot/Windows).');
      console.error('👉 Solution: Use the direct 3-shard standard connection string in .env.local.');
    }
    return false;
  }
}

async function run() {
  const success = await testConnection(uri, 'Configured MONGODB_URI');
  if (!success && uri.startsWith('mongodb+srv://')) {
    // Generate the standard replica set equivalent
    const authMatch = uri.match(/mongodb\+srv:\/\/([^@]+)@/);
    if (authMatch) {
      const creds = authMatch[1];
      const standardUri = `mongodb://${creds}@ac-bzrotc1-shard-00-00.1vjjoyi.mongodb.net:27017,ac-bzrotc1-shard-00-01.1vjjoyi.mongodb.net:27017,ac-bzrotc1-shard-00-02.1vjjoyi.mongodb.net:27017/${dbName}?ssl=true&replicaSet=atlas-gf4b8q-shard-0&authSource=admin&retryWrites=true&w=majority`;
      console.log('\nRetrying with standard replica set URI (bypasses SRV lookup)...');
      await testConnection(standardUri, 'Direct Standard ReplicaSet URI');
    }
  }
}

run();
