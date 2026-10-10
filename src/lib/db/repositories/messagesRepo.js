import { getDb } from '../mongodb.js';

const COLLECTION = 'contact_messages';
const localMessages = [];

export async function createMessage(msgData) {
  const db = await getDb();
  const newMsg = {
    ...msgData,
    status: 'unread',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  if (!db) {
    newMsg._id = 'local_msg_' + Date.now();
    localMessages.unshift(newMsg);
    return newMsg;
  }

  const result = await db.collection(COLLECTION).insertOne(newMsg);
  return { ...newMsg, _id: result.insertedId.toString() };
}

export async function getAllMessages() {
  const db = await getDb();
  if (!db) {
    return localMessages;
  }
  try {
    const list = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
    return list.map(m => ({ ...m, _id: m._id.toString() }));
  } catch (error) {
    console.error('[MessagesRepo] getAllMessages error:', error);
    return localMessages;
  }
}

export async function updateMessageStatus(id, status) {
  const db = await getDb();
  if (!db) {
    const found = localMessages.find(m => m._id === id);
    if (found) {
      found.status = status;
      found.updatedAt = new Date();
      return found;
    }
    return null;
  }

  const { ObjectId } = await import('mongodb');
  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
  await db.collection(COLLECTION).updateOne(filter, { $set: { status, updatedAt: new Date() } });
  const updated = await db.collection(COLLECTION).findOne(filter);
  return updated ? { ...updated, _id: updated._id.toString() } : null;
}

export async function deleteMessage(id) {
  const db = await getDb();
  if (!db) {
    const idx = localMessages.findIndex(m => m._id === id);
    if (idx !== -1) return localMessages.splice(idx, 1)[0];
    return null;
  }

  const { ObjectId } = await import('mongodb');
  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
  const existing = await db.collection(COLLECTION).findOne(filter);
  if (existing) {
    await db.collection(COLLECTION).deleteOne(filter);
    return { ...existing, _id: existing._id.toString() };
  }
  return null;
}

export async function getUnreadCount() {
  const all = await getAllMessages();
  return all.filter(m => m.status === 'unread').length;
}
