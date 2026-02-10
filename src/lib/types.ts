export interface Vehicle {
  id: string;
  name: string;
  number: string;
  type: 'truck' | 'van' | 'car';
  status: 'active' | 'idle' | 'maintenance';
  location: { lat: number; lng: number };
  fuel: number;
  efficiency: number;
  routeId?: string;
}

export interface TrafficZone {
  id: string;
  area: string;
  congestionLevel: number; // 0-100
  predictedLevel?: number; // Optional as mockData might not always have it
  incidents: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Incident {
  id: string;
  type: 'accident' | 'roadwork' | 'congestion';
  location: { lat: number; lng: number };
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Route {
  id: string;
  vehicleId: string;
  status: 'optimized' | 'rerouted' | 'completed';
  efficiency: number;
  eta: string;
  distance: number;
}
