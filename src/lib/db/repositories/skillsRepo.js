import { getDb } from '../mongodb.js';
import { initialSeedData } from '../seed-data.js';

const SKILLS_COLLECTION = 'skills';
const CATEGORIES_COLLECTION = 'skill_categories';

export async function getAllCategories() {
  const db = await getDb();
  if (!db) {
    return initialSeedData.skillCategories;
  }
  try {
    const items = await db.collection(CATEGORIES_COLLECTION).find({}).sort({ sortOrder: 1 }).toArray();
    if (items.length === 0) {
      await db.collection(CATEGORIES_COLLECTION).insertMany(initialSeedData.skillCategories);
      return initialSeedData.skillCategories;
    }
    return items.map(c => ({ ...c, _id: c._id.toString() }));
  } catch (error) {
    console.error('[SkillsRepo] getAllCategories error:', error);
    return initialSeedData.skillCategories;
  }
}

export async function getPublishedCategories() {
  const all = await getAllCategories();
  return all.filter(c => c.status === 'published');
}

export async function getAllSkills() {
  const db = await getDb();
  if (!db) {
    return initialSeedData.skills;
  }
  try {
    const items = await db.collection(SKILLS_COLLECTION).find({}).sort({ sortOrder: 1, name: 1 }).toArray();
    if (items.length === 0) {
      await db.collection(SKILLS_COLLECTION).insertMany(initialSeedData.skills);
      return initialSeedData.skills;
    }
    return items.map(s => ({ ...s, _id: s._id.toString() }));
  } catch (error) {
    console.error('[SkillsRepo] getAllSkills error:', error);
    return initialSeedData.skills;
  }
}

export async function getPublishedSkills() {
  const all = await getAllSkills();
  return all.filter(s => s.status === 'published');
}

export async function createCategory(catData) {
  const db = await getDb();
  const slug = catData.slug || catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newCat = {
    ...catData,
    id: slug,
    slug,
    status: catData.status || 'published',
    sortOrder: Number(catData.sortOrder) || 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  if (!db) {
    newCat._id = 'local_' + Date.now();
    initialSeedData.skillCategories.push(newCat);
    return newCat;
  }

  const result = await db.collection(CATEGORIES_COLLECTION).insertOne(newCat);
  return { ...newCat, _id: result.insertedId.toString() };
}

export async function createSkill(skillData) {
  const db = await getDb();
  const newSkill = {
    ...skillData,
    proficiencyLabel: skillData.proficiencyLabel || 'Comfortable',
    status: skillData.status || 'published',
    sortOrder: Number(skillData.sortOrder) || 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  if (!db) {
    newSkill._id = 'local_' + Date.now();
    initialSeedData.skills.push(newSkill);
    return newSkill;
  }

  const result = await db.collection(SKILLS_COLLECTION).insertOne(newSkill);
  return { ...newSkill, _id: result.insertedId.toString() };
}

export async function updateSkill(id, updateData) {
  const db = await getDb();
  const clean = { ...updateData, updatedAt: new Date() };
  delete clean._id;

  if (!db) {
    const idx = initialSeedData.skills.findIndex(s => s._id === id || s.name === id);
    if (idx !== -1) {
      initialSeedData.skills[idx] = { ...initialSeedData.skills[idx], ...clean };
      return initialSeedData.skills[idx];
    }
    return null;
  }

  const { ObjectId } = await import('mongodb');
  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { name: id };
  await db.collection(SKILLS_COLLECTION).updateOne(filter, { $set: clean });
  const updated = await db.collection(SKILLS_COLLECTION).findOne(filter);
  return updated ? { ...updated, _id: updated._id.toString() } : null;
}

export async function deleteSkill(id) {
  const db = await getDb();
  if (!db) {
    const idx = initialSeedData.skills.findIndex(s => s._id === id || s.name === id);
    if (idx !== -1) {
      return initialSeedData.skills.splice(idx, 1)[0];
    }
    return null;
  }

  const { ObjectId } = await import('mongodb');
  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { name: id };
  const existing = await db.collection(SKILLS_COLLECTION).findOne(filter);
  if (existing) {
    await db.collection(SKILLS_COLLECTION).deleteOne(filter);
    return { ...existing, _id: existing._id.toString() };
  }
  return null;
}

export async function deleteCategory(categoryId) {
  const db = await getDb();
  if (!db) {
    const idx = initialSeedData.skillCategories.findIndex(c => c._id === categoryId || c.id === categoryId);
    if (idx !== -1) {
      return initialSeedData.skillCategories.splice(idx, 1)[0];
    }
    return null;
  }

  const { ObjectId } = await import('mongodb');
  const filter = ObjectId.isValid(categoryId) ? { _id: new ObjectId(categoryId) } : { id: categoryId };
  const existing = await db.collection(CATEGORIES_COLLECTION).findOne(filter);
  if (existing) {
    await db.collection(CATEGORIES_COLLECTION).deleteOne(filter);
    return { ...existing, _id: existing._id.toString() };
  }
  return null;
}
