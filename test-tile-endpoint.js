const http = require('http');

const testUrl = 'http://localhost:3000/api/tiles/11/1464/1097';

console.log('Testing tile endpoint:', testUrl);
console.log('This requires the dev server to be running (npm run dev)\n');

http.get(testUrl, (res) => {
    console.log('✅ Status Code:', res.statusCode);
    console.log('📦 Content-Type:', res.headers['content-type']);
    console.log('📊 Content-Encoding:', res.headers['content-encoding']);
    console.log('💾 Content-Length:', res.headers['content-length'] || 'chunked');
    
    let dataLength = 0;
    res.on('data', (chunk) => {
        dataLength += chunk.length;
    });
    
    res.on('end', () => {
        console.log('✨ Actual Data Received:', dataLength, 'bytes');
        if (res.statusCode === 200 && dataLength > 0) {
            console.log('\n✅ SUCCESS: Tile endpoint is working!');
        } else if (res.statusCode === 404) {
            console.log('\n❌ FAIL: Tile not found (404)');
            console.log('This might mean the coordinate conversion is wrong or tile doesn\'t exist');
        } else {
            console.log('\n⚠️  WARNING: Unexpected response');
        }
    });
}).on('error', (err) => {
    console.log('\n❌ ERROR:', err.message);
    console.log('Make sure the dev server is running: npm run dev');
});
