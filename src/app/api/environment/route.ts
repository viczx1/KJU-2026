import { NextResponse } from 'next/server';
import { getEnvironmentEngine } from '@/lib/simulation/environmentEngine';
import { db } from '@/lib/db/database';

export async function GET() {
  try {
    const engine = getEnvironmentEngine();
    const state = engine.getState();

    // Also fetch from database
    const dbEnv = db.getEnvironment();

    // Merge with calculated factors
    const response = {
      condition: state.condition,
      temperature: state.temperature,
      visibility: state.visibilityMeters,
      simulationTime: state.simTime.toISOString(),
      congestionLevel: state.globalCongestionLevel,
      weatherSpeedFactor: state.weatherSpeedFactor,
      congestionSpeedFactor: state.congestionSpeedFactor,
      combinedSpeedFactor: engine.getSpeedFactor(),
      rushHour: state.rushHour,
      database: dbEnv // Include raw DB data for debugging
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Environment API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get environment state',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const engine = getEnvironmentEngine();
    
    // Advance simulation time and update weather
    engine.update();
    
    const state = engine.getState();

    // Save to database
    db.updateEnvironment({
      weather: state.condition,
      temperature: state.temperature,
      visibility: state.visibilityMeters,
      simulationTime: state.simTime.toISOString(),
      congestionLevel: state.globalCongestionLevel,
      rushHour: state.rushHour
    });

    return NextResponse.json({
      success: true,
      state
    });
  } catch (error) {
    console.error('❌ Environment update error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update environment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
