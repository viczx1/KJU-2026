import Database from 'better-sqlite3';
import path from 'path';

// Use global cache to prevent multiple connections in Dev HMR
const globalForDb = globalThis as unknown as {
  tileDb: Database.Database | undefined;
};

export function getTileDb() {
  if (!globalForDb.tileDb) {
    // The mbtiles file is in the project root
    const dbPath = path.join(process.cwd(), 'osm-2020-02-10-v3.11_india_bengaluru.mbtiles');
    
    try {
      // Create new connection
      console.log('🔌 Opening new SQLite Connection to ' + dbPath);
      globalForDb.tileDb = new Database(dbPath, { readonly: true, fileMustExist: true });
    } catch (err) {
      console.error('❌ Failed to open mbtiles database at ' + dbPath, err);
      throw err;
    }
  }
  return globalForDb.tileDb;
}
