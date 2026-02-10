const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'osm-2020-02-10-v3.11_india_bengaluru.mbtiles');

console.log(`Attempting to open database at: ${dbPath}`);

try {
  const db = new Database(dbPath, { verbose: console.log });
  console.log('Database opened successfully.');

  try {
    console.log('Querying metadata...');
    const metadata = db.prepare('SELECT * FROM metadata LIMIT 1').get();
    console.log('Metadata result:', metadata);
  } catch (err) {
    console.error('Error querying metadata:', err.message);
  }

  try {
    console.log('Querying tiles...');
    const tile = db.prepare('SELECT * FROM tiles LIMIT 1').get();
    console.log('Tile result:', tile ? 'Found a tile' : 'No tiles found');
  } catch (err) {
    console.error('Error querying tiles:', err.message);
  }

  db.close();
  console.log('Database connection closed.');

} catch (err) {
  console.error('Failed to open database:', err);
}
