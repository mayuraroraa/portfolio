import { getDb } from '../mongodb.js';

const COLLECTION = 'audit_logs';
const localAuditLogs = [];

export async function logAction({ actorEmail = 'system', action, resourceType, resourceId = null, details = {} }) {
  const db = await getDb();
  const entry = {
    actorEmail,
    action,
    resourceType,
    resourceId,
    details,
    timestamp: new Date()
  };

  if (!db) {
    entry._id = 'audit_' + Date.now();
    localAuditLogs.unshift(entry);
    if (localAuditLogs.length > 50) localAuditLogs.pop();
    return entry;
  }

  try {
    const result = await db.collection(COLLECTION).insertOne(entry);
    return { ...entry, _id: result.insertedId.toString() };
  } catch (error) {
    console.error('[AuditRepo] Failed to write audit log:', error);
    return null;
  }
}

export async function getRecentAuditLogs(limit = 20) {
  const db = await getDb();
  if (!db) {
    return localAuditLogs.slice(0, limit);
  }
  try {
    const logs = await db.collection(COLLECTION).find({}).sort({ timestamp: -1 }).limit(limit).toArray();
    return logs.map(l => ({ ...l, _id: l._id.toString() }));
  } catch (error) {
    console.error('[AuditRepo] getRecentAuditLogs error:', error);
    return localAuditLogs.slice(0, limit);
  }
}
