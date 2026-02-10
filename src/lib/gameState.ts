import { Vehicle, TrafficZone, Incident } from './types';
import { vehicles as initialVehicles, trafficZones as initialZones, incidents as initialIncidents } from './mockData';

// Define the shape of our Game State
export interface GameState {
  vehicles: Vehicle[];
  zones: TrafficZone[];
  incidents: Incident[];
  lastUpdated: number;
}

// Global augmentation to persist state across hot-reloads in Dev
const globalForSim = globalThis as unknown as {
  trafficSimulationState: GameState | undefined;
};

// Initialize or Retrieve State
export const getGameState = (): GameState => {
  if (!globalForSim.trafficSimulationState) {
    console.log('⚡ Initializing New Simulation State...');
    globalForSim.trafficSimulationState = {
      vehicles: [...initialVehicles], // Clone to avoid mutation issues
      zones: [...initialZones],
      incidents: [...initialIncidents],
      lastUpdated: Date.now(),
    };
  }
  return globalForSim.trafficSimulationState;
};

// Update State Function
export const updateGameState = (updates: Partial<GameState>) => {
  const state = getGameState();
  
  if (updates.vehicles) {
    // Upsert logic: Update existing, add new
    updates.vehicles.forEach(updatedVehicle => {
      const index = state.vehicles.findIndex(v => v.id === updatedVehicle.id);
      if (index !== -1) {
        state.vehicles[index] = { ...state.vehicles[index], ...updatedVehicle };
      } else {
        state.vehicles.push(updatedVehicle);
      }
    });
  }

  if (updates.zones) {
    state.zones = updates.zones;
  }
  
  if (updates.incidents) {
    state.incidents = updates.incidents;
  }

  state.lastUpdated = Date.now();
  return state;
};

export const resetGameState = () => {
    globalForSim.trafficSimulationState = undefined;
    return getGameState();
}
