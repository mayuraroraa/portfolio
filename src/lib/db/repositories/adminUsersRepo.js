import { getDb } from '../mongodb.js';
import crypto from 'crypto';

const COLLECTION = 'admin_users';

/**
 * Normalizes email address to lowercase and trimmed string.
 * @param {string} email 
 * @returns {string}
 */
export function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Finds an administrator account in MongoDB Atlas by normalized email.
 * Strictly queries the database; NEVER falls back to hardcoded/default credentials.
 * @param {string} email 
 * @returns {Promise<object|null>}
 */
export async function findAdminByEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  const db = await getDb();
  if (!db) {
    // If database is not connected, admin authentication cannot proceed.
    return null;
  }

  try {
    const user = await db.collection(COLLECTION).findOne({ email: normalized });
    if (!user) {
      return null;
    }
    return {
      _id: user._id.toString(),
      id: user.id || user._id.toString(),
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role || 'superadmin',
      status: user.status || 'active',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt || null
    };
  } catch (error) {
    console.error('[AdminUsersRepo Error] findAdminByEmail failed:', error.name || 'QueryError');
    return null;
  }
}

/**
 * Creates a new administrator account in MongoDB Atlas.
 * Validates uniqueness and normalizes email.
 * @param {object} param0
 * @param {string} param0.email
 * @param {string} param0.passwordHash
 * @param {string} [param0.role='superadmin']
 * @returns {Promise<object>}
 */
export async function createAdminUser({ email, passwordHash, role = 'superadmin' }) {
  const normalized = normalizeEmail(email);
  if (!normalized || !passwordHash) {
    throw new Error('Email and passwordHash are required to create an administrator.');
  }

  const db = await getDb();
  if (!db) {
    throw new Error('Cannot create administrator: MongoDB database is not connected.');
  }

  // Ensure unique index
  await db.collection(COLLECTION).createIndex({ email: 1 }, { unique: true });

  const existing = await db.collection(COLLECTION).findOne({ email: normalized });
  if (existing) {
    throw new Error('An administrator account with this email address already exists.');
  }

  const adminDoc = {
    id: crypto.randomUUID(),
    email: normalized,
    passwordHash,
    role: role === 'superadmin' ? 'superadmin' : 'admin',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: null
  };

  const result = await db.collection(COLLECTION).insertOne(adminDoc);
  return {
    id: adminDoc.id,
    _id: result.insertedId.toString(),
    email: adminDoc.email,
    role: adminDoc.role,
    status: adminDoc.status,
    createdAt: adminDoc.createdAt
  };
}

/**
 * Updates the password hash for an existing administrator.
 * @param {string} email 
 * @param {string} newPasswordHash 
 * @returns {Promise<boolean>}
 */
export async function updateAdminPassword(email, newPasswordHash) {
  const normalized = normalizeEmail(email);
  if (!normalized || !newPasswordHash) return false;

  const db = await getDb();
  if (!db) return false;

  try {
    const res = await db.collection(COLLECTION).updateOne(
      { email: normalized },
      { $set: { passwordHash: newPasswordHash, updatedAt: new Date() } }
    );
    return res.modifiedCount > 0;
  } catch (error) {
    console.error('[AdminUsersRepo Error] updateAdminPassword failed:', error.name || 'UpdateError');
    return false;
  }
}

/**
 * Updates the administrator email address in MongoDB Atlas.
 * @param {string} oldEmail
 * @param {string} newEmail
 * @returns {Promise<boolean>}
 */
export async function updateAdminEmail(oldEmail, newEmail) {
  const normOld = normalizeEmail(oldEmail);
  const normNew = normalizeEmail(newEmail);
  if (!normOld || !normNew) return false;

  const db = await getDb();
  if (!db) return false;

  try {
    const existing = await db.collection(COLLECTION).findOne({ email: normNew });
    if (existing) {
      throw new Error('An administrator account with this email already exists.');
    }
    const res = await db.collection(COLLECTION).updateOne(
      { email: normOld },
      { $set: { email: normNew, updatedAt: new Date() } }
    );
    return res.modifiedCount > 0;
  } catch (error) {
    console.error('[AdminUsersRepo Error] updateAdminEmail failed:', error.name || 'UpdateError');
    throw error;
  }
}

/**
 * Updates the last successful login timestamp.
 * @param {string} email 
 */
export async function updateLastLogin(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) return;

  const db = await getDb();
  if (!db) return;

  try {
    await db.collection(COLLECTION).updateOne(
      { email: normalized },
      { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }
    );
  } catch (error) {
    console.error('[AdminUsersRepo Error] updateLastLogin failed:', error.name || 'UpdateError');
  }
}

/**
 * Returns total count of registered administrators.
 * Used to permanently disable public/repeatable setup once bootstrap is complete.
 * @returns {Promise<number>}
 */
export async function getAdminCount() {
  const db = await getDb();
  if (!db) return 0;
  try {
    return await db.collection(COLLECTION).countDocuments();
  } catch {
    return 0;
  }
}
