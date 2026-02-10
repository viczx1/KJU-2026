const Database = require('better-sqlite3');
const db = new Database('osm-2020-02-10-v3.11_india_bengaluru.mbtiles', { readonly: true });

// Check metadata
console.log('\n=== METADATA ===');
const metadata = db.prepare('SELECT * FROM metadata').all();
metadata.forEach(row => console.log(`${row.name}: ${row.value}`));

// Check available zoom levels
console.log('\n=== ZOOM LEVELS ===');
const zooms = db.prepare('SELECT DISTINCT zoom_level FROM tiles ORDER BY zoom_level').all();
console.log('Available zooms:', zooms.map(z => z.zoom_level).join(', '));

// Check tile counts per zoom
console.log('\n=== TILE COUNTS ===');
const counts = db.prepare('SELECT zoom_level, COUNT(*) as count FROM tiles GROUP BY zoom_level').all();
counts.forEach(row => console.log(`Zoom ${row.zoom_level}: ${row.count} tiles`));

// Check bounds
console.log('\n=== SAMPLE TILES (Zoom 11) ===');
const samples = db.prepare('SELECT zoom_level, tile_column, tile_row FROM tiles WHERE zoom_level = 11 LIMIT 5').all();
samples.forEach(t => console.log(`  ${t.zoom_level}/${t.tile_column}/${t.tile_row}`));

db.close();
