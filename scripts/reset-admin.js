#!/usr/bin/env node

/**
 * PRIVATE ADMINISTRATOR RECOVERY / PASSWORD RESET SCRIPT
 * 
 * Allows the verified server administrator with CLI access to reset an administrator password.
 * - Stores ONLY a salted bcrypt hash in MongoDB Atlas (never plaintext).
 * - Requires explicit administrator email verification.
 * - Never logs passwords or password hashes.
 */

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import readline from 'readline';
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
    // Non-blocking
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

async function runReset() {
  console.log('\n===============================================================');
  console.log('🔑 PRIVATE ADMINISTRATOR PASSWORD RESET');
  console.log('===============================================================');

  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is not set in .env.local');
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

    const cliArgs = parseCliArgs();
    let email = cliArgs.email || process.env.ADMIN_RESET_EMAIL;

    if (!email) {
      email = await askQuestion('Enter Administrator Email to reset: ');
    }

    email = email ? email.trim().toLowerCase() : '';

    const existingAdmin = await adminCollection.findOne({ email });
    if (!existingAdmin) {
      console.error(`\n❌ No administrator account found with email: "${email}".`);
      process.exit(1);
    }

    let password = cliArgs.password || process.env.ADMIN_RESET_PASSWORD;
    if (!password) {
      password = await askQuestion('Enter New Master Password: ', true);
      const confirmPassword = await askQuestion('Confirm New Master Password: ', true);

      if (password !== confirmPassword) {
        console.error('\n❌ Passwords do not match. Aborting reset.');
        process.exit(1);
      }
    }

    if (!password || password.length < 8) {
      console.error('\n❌ Password must be at least 8 characters long.');
      process.exit(1);
    }

    console.log('\n⏳ Hashing new password with salted bcrypt (12 rounds)...');
    const newPasswordHash = await bcrypt.hash(password, 12);

    await adminCollection.updateOne(
      { email },
      { $set: { passwordHash: newPasswordHash, updatedAt: new Date() } }
    );

    console.log('\n===============================================================');
    console.log('✅ MASTER PASSWORD RESET COMPLETED');
    console.log('===============================================================');
    console.log(`• Administrator Email: ${email}`);
    console.log('• Storage: Updated in MongoDB Atlas');
    console.log('• Password Security: Salted bcrypt hash updated (no plaintext)');
    console.log('\nYou can now sign in with your new password at:');
    console.log('  http://localhost:3000/admin/login\n');
  } catch (error) {
    console.error('\n❌ Reset error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

runReset();
