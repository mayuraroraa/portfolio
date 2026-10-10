import { getDb } from '../mongodb.js';
import { initialSeedData } from '../seed-data.js';

const COLLECTION = 'services';

export async function getAllServices() {
  const db = await getDb();
  if (!db) {
    return initialSeedData.services;
  }
  try {
    const items = await db.collection(COLLECTION).find({}).sort({ sortOrder: 1 }).toArray();
    if (items.length === 0) {
      await db.collection(COLLECTION).insertMany(initialSeedData.services);
      return initialSeedData.services;
    }
    return items.map(s => ({ ...s, _id: s._id.toString() }));
  } catch (error) {
    console.error('[ServicesRepo] getAllServices error:', error);
    return initialSeedData.services;
  }
}

export async function getPublishedServices() {
  const all = await getAllServices();
  return all.filter(s => s.status === 'published');
}

export async function createService(data) {
  const db = await getDb();
  const newService = {
    ...data,
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    status: data.status || 'published',
    sortOrder: Number(data.sortOrder) || 1,
    featured: Boolean(data.featured),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  if (!db) {
    newService._id = 'local_' + Date.now();
    initialSeedData.services.push(newService);
    return newService;
  }

  const result = await db.collection(COLLECTION).insertOne(newService);
  return { ...newService, _id: result.insertedId.toString() };
}

export async function updateService(id, updateData) {
  const db = await getDb();
  const clean = { ...updateData, updatedAt: new Date() };
  delete clean._id;

  if (!db) {
    const idx = initialSeedData.services.findIndex(s => s._id === id || s.id === id);
    if (idx !== -1) {
      initialSeedData.services[idx] = { ...initialSeedData.services[idx], ...clean };
      return initialSeedData.services[idx];
    }
    return null;
  }

  const { ObjectId } = await import('mongodb');
  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
  await db.collection(COLLECTION).updateOne(filter, { $set: clean });
  const updated = await db.collection(COLLECTION).findOne(filter);
  return updated ? { ...updated, _id: updated._id.toString() } : null;
}

export async function deleteService(id) {
  const db = await getDb();
  if (!db) {
    const idx = initialSeedData.services.findIndex(s => s._id === id || s.id === id);
    if (idx !== -1) {
      return initialSeedData.services.splice(idx, 1)[0];
    }
    return null;
  }

  const { ObjectId } = await import('mongodb');
  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
  const existing = await db.collection(COLLECTION).findOne(filter);
  if (existing) {
    await db.collection(COLLECTION).deleteOne(filter);
    return { ...existing, _id: existing._id.toString() };
  }
  return null;
}
