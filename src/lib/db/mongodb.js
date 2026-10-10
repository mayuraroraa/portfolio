import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'mayur_portfolio';

const options = {
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
};

async function createConnectedClient() {
  if (!uri) return null;
  try {
    const cl = new MongoClient(uri, options);
    return await cl.connect();
  } catch (err) {
    // If SRV lookup fails with EBADRESP (common on Windows cellular hotspot/DNS), fallback to direct shard hosts
    if (uri.startsWith('mongodb+srv://') && (err.message?.includes('querySrv') || err.message?.includes('EBADRESP'))) {
      const match = uri.match(/mongodb\+srv:\/\/([^@]+)@cluster0\.1vjjoyi\.mongodb\.net/);
      if (match) {
        const creds = match[1];
        const directUri = `mongodb://${creds}@ac-bzrotc1-shard-00-00.1vjjoyi.mongodb.net:27017,ac-bzrotc1-shard-00-01.1vjjoyi.mongodb.net:27017,ac-bzrotc1-shard-00-02.1vjjoyi.mongodb.net:27017/${dbName}?ssl=true&replicaSet=atlas-gf4b8q-shard-0&authSource=admin&retryWrites=true&w=majority`;
        try {
          const directClient = new MongoClient(directUri, options);
          return await directClient.connect();
        } catch (directErr) {
          console.error('[MongoDB Error] Direct shard connection failed:', directErr.name || 'ConnectionError');
          return null;
        }
      }
    }
    // Log gracefully without crashing Next.js build or worker threads
    console.error('[MongoDB Error] Database connection failed:', err.name || 'ConnectionError');
    return null;
  }
}

let clientPromise = null;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createConnectedClient();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    clientPromise = createConnectedClient();
  }
}

/**
 * Safely retrieves the active MongoDB database instance.
 * Returns null if MONGODB_URI is not configured or connection failed.
 * Logs safe, sanitized messages without exposing credentials or URIs.
 * @returns {Promise<import('mongodb').Db|null>}
 */
export async function getDb() {
  if (!uri) {
    return null;
  }
  try {
    let connectedClient = await clientPromise;
    // If the initial connection failed (e.g. during build or cold boot), retry lazily
    if (!connectedClient) {
      clientPromise = createConnectedClient();
      connectedClient = await clientPromise;
    }
    if (!connectedClient) {
      return null;
    }
    return connectedClient.db(dbName);
  } catch (error) {
    console.error('[MongoDB Error] Database retrieval error:', error.name || 'ConnectionError');
    return null;
  }
}

/**
 * Confirms real operational connectivity with MongoDB Atlas by pinging the database.
 * Does not claim connection until an actual ping succeeds.
 * @returns {Promise<boolean>}
 */
export async function isMongoConnected() {
  try {
    const db = await getDb();
    if (!db) return false;
    await db.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

export default clientPromise;
