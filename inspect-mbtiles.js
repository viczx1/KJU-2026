const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const mbtilesPath = path.resolve('osm-2020-02-10-v3.11_india_bengaluru.mbtiles');

console.log(`Checking file: ${mbtilesPath}`);

if (!fs.existsSync(mbtilesPath)) {
    console.error('File not found!');
    process.exit(1);
}

try {
    const db = new Database(mbtilesPath, { readonly: true });
    
    // Check compression by looking at the first tile
    const tile = db.prepare('SELECT tile_data FROM tiles LIMIT 1').get();
    
    if (tile && tile.tile_data) {
        const buffer = tile.tile_data;
        // Check for GZIP magic number: 0x1f 0x8b
        if (buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b) {
            console.log('COMPRESSION: GZIP');
        } else {
            console.log('COMPRESSION: NONE');
            console.log(`First bytes: ${buffer[0].toString(16)} ${buffer[1].toString(16)}`);
        }
    } else {
        console.log('No tiles found to check compression.');
    }
    
    // Check format from metadata
    const meta = db.prepare("SELECT value FROM metadata WHERE name='format'").get();
    if (meta) {
        console.log(`FORMAT: ${meta.value}`);
    } else {
        console.log('FORMAT: Not specified in metadata');
    }
    
    db.close();
} catch (err) {
    console.error('Error:', err.message);
}
