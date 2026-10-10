import { getDb } from '../mongodb.js';
import { initialSeedData } from '../seed-data.js';

const COLLECTION = 'site_settings';

export async function getSiteSettings() {
  const db = await getDb();
  if (!db) {
    return initialSeedData.siteSettings;
  }
  try {
    let settings = await db.collection(COLLECTION).findOne({});
    if (!settings) {
      const copy = { ...initialSeedData.siteSettings };
      await db.collection(COLLECTION).insertOne(copy);
      return copy;
    }
    return { ...settings, _id: settings._id.toString() };
  } catch (error) {
    console.error('[SettingsRepo] getSiteSettings error:', error);
    return initialSeedData.siteSettings;
  }
}

export async function updateSiteSettings(newSettings) {
  const db = await getDb();
  const clean = { ...newSettings, updatedAt: new Date() };
  delete clean._id;

  if (!db) {
    initialSeedData.siteSettings = {
      ...initialSeedData.siteSettings,
      ...clean
    };
    return initialSeedData.siteSettings;
  }

  await db.collection(COLLECTION).updateOne(
    {},
    { $set: clean },
    { upsert: true }
  );

  const updated = await db.collection(COLLECTION).findOne({});
  return updated ? { ...updated, _id: updated._id.toString() } : null;
}
