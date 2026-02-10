import { NextResponse } from 'next/server';
import { getGameState, updateGameState, resetGameState } from '@/lib/gameState';

// GET: Retrieve the current world state
export async function GET() {
  const state = getGameState();
  return NextResponse.json(state);
}

// POST: Update the world state (Called by Simulation Engine)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updatedState = updateGameState(body);
    return NextResponse.json({ success: true, state: updatedState });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }
}

// DELETE: Reset simulation to initial mock data
export async function DELETE() {
  const newState = resetGameState();
  return NextResponse.json({ success: true, message: 'Simulation Reset', state: newState });
}
