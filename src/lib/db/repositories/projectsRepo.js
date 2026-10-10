import { getDb } from '../mongodb.js';
import { initialSeedData } from '../seed-data.js';

const COLLECTION = 'projects';

export async function getAllProjects() {
  const db = await getDb();
  if (!db) {
    return initialSeedData.projects;
  }
  try {
    const items = await db.collection(COLLECTION).find({}).sort({ sortOrder: 1, createdAt: -1 }).toArray();
    if (items.length === 0) {
      // Auto-initialize collection if empty
      await db.collection(COLLECTION).insertMany(initialSeedData.projects);
      return initialSeedData.projects;
    }
    return items.map(doc => ({ ...doc, _id: doc._id.toString() }));
  } catch (error) {
    console.error('[ProjectsRepo] getAllProjects error:', error);
    return initialSeedData.projects;
  }
}

export async function getPublishedProjects() {
  const all = await getAllProjects();
  return all.filter(p => p.status === 'published');
}

export async function getPublishedProjectBySlug(slug) {
  const published = await getPublishedProjects();
  return published.find(p => p.slug === slug || p.id === slug) || null;
}

export async function getProjectBySlug(slug) {
  const all = await getAllProjects();
  return all.find(p => p.slug === slug || p.id === slug) || null;
}

export async function createProject(projectData) {
  const db = await getDb();
  const newProject = {
    ...projectData,
    slug: projectData.slug || projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    status: projectData.status || 'published',
    sortOrder: Number(projectData.sortOrder) || 1,
    featured: Boolean(projectData.featured),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (!db) {
    // In-memory fallback
    newProject._id = 'local_' + Date.now();
    initialSeedData.projects.unshift(newProject);
    return newProject;
  }

  const result = await db.collection(COLLECTION).insertOne(newProject);
  return { ...newProject, _id: result.insertedId.toString() };
}

export async function updateProject(idOrSlug, updateData) {
  const db = await getDb();
  const cleanUpdate = {
    ...updateData,
    updatedAt: new Date()
  };
  delete cleanUpdate._id;

  if (!db) {
    const idx = initialSeedData.projects.findIndex(p => p._id === idOrSlug || p.id === idOrSlug || p.slug === idOrSlug);
    if (idx !== -1) {
      initialSeedData.projects[idx] = { ...initialSeedData.projects[idx], ...cleanUpdate };
      return initialSeedData.projects[idx];
    }
    return null;
  }

  const { ObjectId } = await import('mongodb');
  let filter;
  try {
    filter = ObjectId.isValid(idOrSlug) ? { _id: new ObjectId(idOrSlug) } : { $or: [{ id: idOrSlug }, { slug: idOrSlug }] };
  } catch {
    filter = { $or: [{ id: idOrSlug }, { slug: idOrSlug }] };
  }

  await db.collection(COLLECTION).updateOne(filter, { $set: cleanUpdate });
  const updated = await db.collection(COLLECTION).findOne(filter);
  return updated ? { ...updated, _id: updated._id.toString() } : null;
}

export async function deleteProject(idOrSlug) {
  const db = await getDb();
  if (!db) {
    const idx = initialSeedData.projects.findIndex(p => p._id === idOrSlug || p.id === idOrSlug || p.slug === idOrSlug);
    if (idx !== -1) {
      return initialSeedData.projects.splice(idx, 1)[0];
    }
    return null;
  }

  const { ObjectId } = await import('mongodb');
  let filter;
  try {
    filter = ObjectId.isValid(idOrSlug) ? { _id: new ObjectId(idOrSlug) } : { $or: [{ id: idOrSlug }, { slug: idOrSlug }] };
  } catch {
    filter = { $or: [{ id: idOrSlug }, { slug: idOrSlug }] };
  }

  const existing = await db.collection(COLLECTION).findOne(filter);
  if (existing) {
    await db.collection(COLLECTION).deleteOne(filter);
    return { ...existing, _id: existing._id.toString() };
  }
  return null;
}
