export interface Vehicle {
  id: string;
  name: string;
  number: string;
  type: 'truck' | 'van' | 'car';
  status: 'active' | 'idle' | 'maintenance' | 'in-transit' | 'loading' | 'unloading' | 'refueling';
  location: { lat: number; lng: number };
  fuel: number;
  efficiency: number;
  routeId?: string;
  // Extended properties from database
  speed?: number;
  heading?: number;
  cargoWeight?: number;
  cargoCapacity?: number;
  aiPersonality?: 'aggressive' | 'cautious' | 'balanced' | 'efficient';
  lastUpdate?: string;
}

export interface TrafficZone {
  id: string;
  area: string;
  congestionLevel: number; // 0-100
  predictedLevel?: number;
  incidents: number;
  trend: 'up' | 'down' | 'stable';
  // Extended properties from database
  name?: string;
  location?: { lat: number; lng: number };
  radius?: number;
  avgSpeed?: number;
  vehicleCount?: number;
}

export interface Incident {
  id: string;
  type: 'accident' | 'roadwork' | 'congestion';
  location: { lat: number; lng: number };
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Route {
  id: string;
  vehicleId: string;
  status: 'optimized' | 'rerouted' | 'completed';
  efficiency: number;
  eta: string;
  distance: number;
}
