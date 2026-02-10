import { NextRequest, NextResponse } from 'next/server';
import { getRoute, getRouteAlternatives } from '@/lib/routing/osrmService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startLat = parseFloat(searchParams.get('startLat') || '');
    const startLng = parseFloat(searchParams.get('startLng') || '');
    const endLat = parseFloat(searchParams.get('endLat') || '');
    const endLng = parseFloat(searchParams.get('endLng') || '');
    const alternatives = searchParams.get('alternatives') === 'true';

    if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) {
      return NextResponse.json(
        { error: 'Invalid coordinates. Required: startLat, startLng, endLat, endLng' },
        { status: 400 }
      );
    }

    const start = { lat: startLat, lng: startLng };
    const end = { lat: endLat, lng: endLng };

    if (alternatives) {
      const routes = await getRouteAlternatives(start, end);
      return NextResponse.json({
        routes,
        primary: routes[0] || null
      });
    } else {
      const route = await getRoute(start, end);
      return NextResponse.json(route);
    }
  } catch (error) {
    console.error('❌ Routing API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to calculate route',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
