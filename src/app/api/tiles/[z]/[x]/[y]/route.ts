import { NextRequest, NextResponse } from 'next/server';
import { getTileDb } from '@/lib/db';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ z: string; x: string; y: string }> }
) {
    const { z: zStr, x: xStr, y: yStr } = await context.params;

    const z = parseInt(zStr);
    const x = parseInt(xStr);
    const y = parseInt(yStr);

    if (isNaN(z) || isNaN(x) || isNaN(y)) {
        console.log(`❌ Invalid tile request: z=${zStr}, x=${xStr}, y=${yStr}`);
        return new NextResponse('Invalid parameters', { status: 400 });
    }

    // MBTiles uses TMS coordinate system - Y axis is inverted
    const tmsY = (1 << z) - 1 - y;
    
    console.log(`🗺️ Tile request: ${z}/${x}/${y} (TMS: ${z}/${x}/${tmsY})`);

    try {
        const database = getTileDb();
        const statement = database.prepare(
            'SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?'
        );
        const result = statement.get(z, x, tmsY) as { tile_data: Buffer } | undefined;

        if (!result || !result.tile_data) {
            console.log(`⚠️  Tile not found: ${z}/${x}/${y}`);
            return new NextResponse(null, { status: 404 });
        }

        console.log(`✅ Serving tile: ${z}/${x}/${y} (${result.tile_data.length} bytes)`);

        const headers = new Headers();
        headers.set('Content-Type', 'application/x-protobuf');
        headers.set('Content-Encoding', 'gzip');
        headers.set('Cache-Control', 'public, max-age=31536000');
        headers.set('Access-Control-Allow-Origin', '*');

        return new NextResponse(result.tile_data as any, {
            status: 200,
            headers: headers,
        });
    } catch (error) {
        console.error('Error serving tile:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
