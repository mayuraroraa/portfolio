#!/usr/bin/env node

/**
 * PRIVATE ONE-TIME ADMINISTRATOR BOOTSTRAP SCRIPT
 * 
 * Allows the system owner to configure their private administrator email and password.
 * - Stores ONLY a salted bcrypt hash in MongoDB Atlas (never plaintext).
 * - Permanently disables initial-admin creation once an administrator exists.
 * - Completely prevents public/repeatable account takeover.
 * - Never logs passwords or password hashes.
 */

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import readline from 'readline';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

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
            let val = trimmed.slice(eqIdx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    }
  } catch {
    // Non-blocking fallback
  }
}

loadEnvLocal();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'mayur_portfolio';

function askQuestion(query, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (hidden) {
      process.stdout.write(query);
      let input = '';
      
      const onData = (char) => {
        char = char.toString();
        switch (char) {
          case '\n':
          case '\r':
          case '\u0004':
            process.stdin.removeListener('data', onData);
            break;
          case '\u0003':
            process.exit();
            break;
          case '\u007f':
          case '\b':
            if (input.length > 0) {
              input = input.slice(0, -1);
              process.stdout.write('\b \b');
            }
            break;
          default:
            input += char;
            process.stdout.write('*');
            break;
        }
      };

      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', onData);
      }

      rl.question('', () => {
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        console.log();
        rl.close();
        resolve(input);
      });
    } else {
      rl.question(query, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    }
  });
}

function parseCliArgs() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      params.email = args[i + 1];
      i++;
    } else if (args[i] === '--password' && args[i + 1]) {
      params.password = args[i + 1];
      i++;
    }
  }
  return params;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePasswordStrength(pwd) {
  if (!pwd || pwd.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  return null;
}

async function runBootstrap() {
  console.log('\n===============================================================');
  console.log('🔒 PRIVATE ADMINISTRATOR BOOTSTRAP SETUP');
  console.log('===============================================================');

  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is not set.');
    console.error('Please configure your MongoDB Atlas connection string in .env.local');
    console.error('Example: MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority"\n');
    process.exit(1);
  }

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
    const db = client.db(dbName);
    const adminCollection = db.collection('admin_users');

    // 1. Enforce permanent lockdown: Check if any admin already exists
    const adminCount = await adminCollection.countDocuments();
    if (adminCount > 0) {
      console.log('\n⚠️  SECURITY LOCK ACTIVE:');
      console.log('An administrator account has already been initialized in this MongoDB database.');
      console.log('Initial setup is permanently locked to prevent unauthorized account takeover.');
      console.log('To modify or recover credentials securely, run:');
      console.log('  npm run reset:admin\n');
      await client.close();
      process.exit(0);
    }

    // 2. Collect administrator credentials
    const cliArgs = parseCliArgs();
    let email = cliArgs.email || process.env.ADMIN_BOOTSTRAP_EMAIL;
    let password = cliArgs.password || process.env.ADMIN_BOOTSTRAP_PASSWORD;

    if (!email) {
      email = await askQuestion('Enter chosen Administrator Email: ');
    }

    email = email ? email.trim().toLowerCase() : '';

    if (!validateEmail(email)) {
      console.error('\n❌ Invalid email address provided.');
      process.exit(1);
    }

    if (!password) {
      password = await askQuestion('Enter chosen Master Password: ', true);
      const confirmPassword = await askQuestion('Confirm Master Password: ', true);

      if (password !== confirmPassword) {
        console.error('\n❌ Passwords do not match. Aborting bootstrap.');
        process.exit(1);
      }
    }

    const strengthError = validatePasswordStrength(password);
    if (strengthError) {
      console.error(`\n❌ Password validation error: ${strengthError}`);
      process.exit(1);
    }

    console.log('\n⏳ Hashing password with salted bcrypt (12 rounds)...');
    const passwordHash = await bcrypt.hash(password, 12);

    // 3. Create administrator in MongoDB Atlas
    const adminDoc = {
      id: crypto.randomUUID(),
      email,
      passwordHash,
      role: 'superadmin',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null
    };

    // Ensure unique index
    await adminCollection.createIndex({ email: 1 }, { unique: true });
    await adminCollection.insertOne(adminDoc);

    console.log('\n===============================================================');
    console.log('✅ ADMINISTRATOR BOOTSTRAP COMPLETED SUCCESSFULLY');
    console.log('===============================================================');
    console.log(`• Administrator Email: ${email}`);
    console.log('• Role: superadmin');
    console.log('• Storage: MongoDB Atlas (Collection: "admin_users")');
    console.log('• Password Security: Salted bcrypt hash stored securely (no plaintext)');
    console.log('• Lock Status: Initial admin registration is now permanently disabled.');
    console.log('\nYou can now access the private dashboard at:');
    console.log('  http://localhost:3000/admin/login\n');
  } catch (error) {
    console.error('\n❌ Bootstrap error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

runBootstrap();
