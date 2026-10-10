import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'mayur_portfolio';

let clientPromise;

if (!uri) {
  // If MONGODB_URI is not set, clientPromise remains null.
  // The system handles this gracefully without crashing or leaking secrets.
  clientPromise = null;
} else {
  const options = {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    tls: true, // Enforce TLS certificate verification for MongoDB Atlas
  };

  async function createConnectedClient() {
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
          const directClient = new MongoClient(directUri, options);
          return await directClient.connect();
        }
      }
      throw err;
    }
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve connection across HMR
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createConnectedClient();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, maintain standard lifecycle
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
  if (!clientPromise) {
    return null;
  }
  try {
    const connectedClient = await clientPromise;
    return connectedClient.db(dbName);
  } catch (error) {
    // Sanitize error log: Never output connection string or sensitive credentials
    console.error('[MongoDB Error] Database connection failed:', error.name || 'ConnectionError');
    return null;
  }
}

/**
 * Confirms real operational connectivity with MongoDB Atlas by pinging the database.
 * Does not claim connection until an actual ping succeeds.
 * @returns {Promise<boolean>}
 */
export async function isMongoConnected() {
  if (!clientPromise) return false;
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
