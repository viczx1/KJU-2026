import { Vehicle, TrafficZone, Incident } from './types';

export const stats = {
    totalVehicles: 7,
    activeVehicles: 4,
    avgEfficiency: 90,
    fuelSaved: '340L',
};

export const vehicles: Vehicle[] = [
    {
        id: 'FLEET-001',
        name: 'Alpha Unit',
        number: 'TM-X-101',
        type: 'truck' as const,
        status: 'active' as const,
        location: { lat: 12.9716, lng: 77.5946 }, // Majestic
        fuel: 85,
        efficiency: 92,
    },
    {
        id: 'FLEET-002',
        name: 'Beta Unit',
        number: 'TM-X-102',
        type: 'van' as const,
        status: 'active' as const,
        location: { lat: 12.9352, lng: 77.6245 }, // Koramangala
        fuel: 60,
        efficiency: 88,
    },
    {
        id: 'FLEET-003',
        name: 'Gamma Unit',
        number: 'TM-X-103',
        type: 'car' as const,
        status: 'idle' as const,
        location: { lat: 12.9784, lng: 77.6408 }, // Indiranagar
        fuel: 45,
        efficiency: 95,
    },
    {
        id: 'FLEET-004',
        name: 'Delta Unit',
        number: 'TM-X-104',
        type: 'truck' as const,
        status: 'maintenance' as const,
        location: { lat: 13.0358, lng: 77.5970 }, // Hebbal
        fuel: 10,
        efficiency: 78,
    },
    {
        id: 'FLEET-005',
        name: 'Epsilon Unit',
        number: 'TM-X-105',
        type: 'van' as const,
        status: 'active' as const,
        location: { lat: 12.9165, lng: 77.6101 }, // Silk Board
        fuel: 75,
        efficiency: 91,
    },
    {
        id: 'FLEET-006',
        name: 'Zeta Unit',
        number: 'TM-X-106',
        type: 'car' as const,
        status: 'active' as const,
        location: { lat: 12.9150, lng: 77.608 },
        fuel: 82,
        efficiency: 89,
    },
    {
        id: 'FLEET-007',
        name: 'Eta Unit',
        number: 'TM-X-107',
        type: 'truck' as const,
        status: 'idle' as const,
        location: { lat: 12.9180, lng: 77.6120 },
        fuel: 98,
        efficiency: 96,
    }
];

export const trafficZones: TrafficZone[] = [
    { id: 'Z1', area: 'Silk Board Junction', congestionLevel: 92, trend: 'up' as const, incidents: 3 },
    { id: 'Z2', area: 'Koramangala 80ft Rd', congestionLevel: 45, trend: 'stable' as const, incidents: 0 },
    { id: 'Z3', area: 'Indiranagar 100ft Rd', congestionLevel: 68, trend: 'down' as const, incidents: 1 },
    { id: 'Z4', area: 'Hebbal Flyover', congestionLevel: 75, trend: 'up' as const, incidents: 2 },
    { id: 'Z5', area: 'MG Road', congestionLevel: 55, trend: 'stable' as const, incidents: 0 },
];

export const incidents: Incident[] = [
    {
        id: 'INC-001',
        type: 'congestion',
        location: { lat: 12.9165, lng: 77.6101 }, // Silk Board
        description: 'Heavy traffic due to metro work',
        severity: 'high'
    },
    {
        id: 'INC-002',
        type: 'roadwork',
        location: { lat: 13.0358, lng: 77.5970 }, // Hebbal
        description: 'Flyover maintenance',
        severity: 'medium'
    },
    {
        id: 'INC-003',
        type: 'accident',
        location: { lat: 12.9352, lng: 77.6245 }, // Koramangala
        description: 'Minor collision near Sony Signal',
        severity: 'low'
    }
];
