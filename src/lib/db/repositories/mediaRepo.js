import { getDb } from '../mongodb.js';

const COLLECTION = 'media_assets';

const defaultAssets = [
  {
    id: 'hero-base',
    filename: 'hero-portrait-base.png',
    url: '/assets/e5223ac6-4414-49d1-9800-86e76b355108.png',
    mimeType: 'image/png',
    fileSize: 1375145,
    altText: 'Mayur Arora Grayscale Base Portrait',
    isProtected: true,
    createdAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'hero-reveal',
    filename: 'hero-portrait-color.png',
    url: '/assets/9fa1e3b5-358d-4b14-92bb-e1ac5b273116.png',
    mimeType: 'image/png',
    fileSize: 1247628,
    altText: 'Mayur Arora Color Reveal Portrait',
    isProtected: true,
    createdAt: new Date('2024-01-01T00:00:00.000Z')
  },
  {
    id: 'proj-golden-earth',
    filename: 'golden-earth-mockup.png',
    url: '/assets/golden-earth-school/assets/images/Gemini_Generated_Image_zc9rrazc9rrazc9r - Removed.png',
    mimeType: 'image/png',
    fileSize: 450000,
    altText: 'Golden Earth School Website Preview',
    isProtected: false,
    createdAt: new Date('2024-02-15T00:00:00.000Z')
  },
  {
    id: 'proj-hunar',
    filename: 'hunar-hero.jpg',
    url: '/assets/hunarproject/imgs/assets/hero-image.jpg',
    mimeType: 'image/jpeg',
    fileSize: 320000,
    altText: 'Hunar Project Educational Platform Preview',
    isProtected: false,
    createdAt: new Date('2024-03-10T00:00:00.000Z')
  },
  {
    id: 'proj-solo-leveling',
    filename: 'solo-leveling-mockup.png',
    url: '/assets/solo-leveling-todolist/solo-leveling-mockup.png',
    mimeType: 'image/png',
    fileSize: 610000,
    altText: 'Solo Leveling To-Do List Application',
    isProtected: false,
    createdAt: new Date('2024-05-20T00:00:00.000Z')
  },
  {
    id: 'proj-spotify',
    filename: 'spotify-clone-screenshot.png',
    url: '/assets/spotify files/images/Screenshot 3.png',
    mimeType: 'image/png',
    fileSize: 520000,
    altText: 'Spotify Clone Dark Mode Player',
    isProtected: false,
    createdAt: new Date('2024-06-01T00:00:00.000Z')
  }
];

export async function getAllMedia() {
  const db = await getDb();
  if (!db) {
    return defaultAssets;
  }
  try {
    const list = await db.collection(COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
    if (list.length === 0) {
      await db.collection(COLLECTION).insertMany(defaultAssets);
      return defaultAssets;
    }
    return list.map(m => ({ ...m, _id: m._id.toString() }));
  } catch (error) {
    console.error('[MediaRepo] getAllMedia error:', error);
    return defaultAssets;
  }
}

export async function saveMediaAsset(assetData) {
  const db = await getDb();
  const entry = {
    ...assetData,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  if (!db) {
    entry._id = 'media_' + Date.now();
    defaultAssets.unshift(entry);
    return entry;
  }

  const result = await db.collection(COLLECTION).insertOne(entry);
  return { ...entry, _id: result.insertedId.toString() };
}

export async function deleteMediaAsset(id) {
  const db = await getDb();
  if (!db) {
    const idx = defaultAssets.findIndex(a => a._id === id || a.id === id);
    if (idx !== -1) {
      if (defaultAssets[idx].isProtected) {
        throw new Error('Protected system asset cannot be deleted.');
      }
      return defaultAssets.splice(idx, 1)[0];
    }
    return null;
  }

  const { ObjectId } = await import('mongodb');
  const filter = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { id };
  const asset = await db.collection(COLLECTION).findOne(filter);
  if (asset) {
    if (asset.isProtected) {
      throw new Error('Protected hero asset cannot be deleted.');
    }
    await db.collection(COLLECTION).deleteOne(filter);
    return { ...asset, _id: asset._id.toString() };
  }
  return null;
}
