'use client';

import { useEffect, useRef, useState } from 'react';
import { useTraffic } from '@/lib/TrafficContext';

// Import types
interface VehicleRoute {
  waypoints: Array<{ lat: number; lng: number; distance: number; duration: number }>;
  currentWaypointIndex: number;
  progress: number; // 0 to 1
}

export default function SimulationController() {
  const { vehicles, zones, isSimulating } = useTraffic();
  const isSyncing = useRef(false);
  const [aiDecisionsCount, setAiDecisionsCount] = useState(0);
  const [routesGenerated, setRoutesGenerated] = useState(0);
  
  // Store routes for each vehicle in memory (client-side)
  const vehicleRoutes = useRef<Map<string, VehicleRoute>>(new Map());
  const lastAIDecisionTime = useRef<Map<string, number>>(new Map());

  // Initialize routes for vehicles that don't have one
  useEffect(() => {
    if (!isSimulating) return;

    const initializeRoutes = async () => {
      for (const vehicle of vehicles) {
        if (!vehicleRoutes.current.has(vehicle.id) && vehicle.status === 'in-transit') {
          try {
            // Generate random destination within Bangalore
            const destinations = [
              { lat: 12.9172, lng: 77.6229 }, // Silk Board
              { lat: 12.8456, lng: 77.6603 }, // Electronic City
              { lat: 12.9698, lng: 77.7499 }, // Whitefield
              { lat: 12.9716, lng: 77.5946 }, // Central Bangalore
              { lat: 13.0358, lng: 77.5970 }, // Hebbal
            ];
            
            const destination = destinations[Math.floor(Math.random() * destinations.length)];
            
            // Get route from OSRM API
            const response = await fetch(
              `/api/routing?startLat=${vehicle.location.lat}&startLng=${vehicle.location.lng}&endLat=${destination.lat}&endLng=${destination.lng}`
            );
            
            if (response.ok) {
              const route = await response.json();
              vehicleRoutes.current.set(vehicle.id, {
                waypoints: route.waypoints || [],
                currentWaypointIndex: 0,
                progress: 0
              });
              setRoutesGenerated(prev => prev + 1);
            }
          } catch (error) {
            console.error(`Failed to generate route for ${vehicle.id}:`, error);
          }
        }
      }
    };

    initializeRoutes();
  }, [vehicles, isSimulating]);

  useEffect(() => {
    if (!isSimulating) return;

    const tick = setInterval(async () => {
      if (isSyncing.current) return;
      isSyncing.current = true;

      try {
        // 1. Update Environment (weather, traffic conditions)
        const envResponse = await fetch('/api/environment');
        const environment = envResponse.ok ? await envResponse.json() : null;

        // 2. Move vehicles along their routes
        const updatedVehicles = vehicles.map(v => {
          if (v.status !== 'active') return v;

          const route = vehicleRoutes.current.get(v.id);
          if (!route || route.waypoints.length === 0) {
            // No route - keep current position
            return {
              ...v,
              fuel: Math.max(0, v.fuel - 0.05) // Idle fuel consumption
            };
          }

          // Calculate speed factor based on environment
          const weatherFactor = environment?.weatherSpeedFactor || 1.0;
          const congestionFactor = environment?.congestionSpeedFactor || 1.0;
          const speedFactor = weatherFactor * congestionFactor;

          // Base speed for vehicle type (km/h)
          const baseSpeed = {
            truck: 40,
            van: 50,
            car: 60
          }[v.type] || 50;

          const actualSpeed = baseSpeed * speedFactor;

          // Move along route (2 second tick, speed in km/h)
          const distancePerTick = (actualSpeed / 3600) * 2 * 1000; // meters per 2 seconds
          
          // Advance progress on current route segment
          const currentWaypoint = route.waypoints[route.currentWaypointIndex];
          const nextWaypoint = route.waypoints[route.currentWaypointIndex + 1];

          if (!nextWaypoint) {
            // Reached destination - generate new route
            vehicleRoutes.current.delete(v.id);
            return {
              ...v,
              status: 'idle',
              speed: 0,
              fuel: Math.max(0, v.fuel - 0.1)
            };
          }

          // Calculate new position between waypoints
          const segmentDistance = nextWaypoint.distance - currentWaypoint.distance;
          route.progress += distancePerTick / segmentDistance;

          if (route.progress >= 1.0) {
            // Move to next waypoint
            route.currentWaypointIndex++;
            route.progress = 0;
          }

          // Interpolate position
          const t = route.progress;
          const newLat = currentWaypoint.lat + (nextWaypoint.lat - currentWaypoint.lat) * t;
          const newLng = currentWaypoint.lng + (nextWaypoint.lng - currentWaypoint.lng) * t;

          // Calculate heading
          const dlat = nextWaypoint.lat - currentWaypoint.lat;
          const dlng = nextWaypoint.lng - currentWaypoint.lng;
          const heading = (Math.atan2(dlng, dlat) * 180 / Math.PI + 360) % 360;

          // Fuel consumption based on distance and vehicle type
          const fuelConsumptionRate = {
            truck: 0.3,  // 0.3% per tick
            van: 0.2,
            car: 0.15
          }[v.type] || 0.2;

          return {
            ...v,
            location: { lat: newLat, lng: newLng },
            speed: actualSpeed,
            heading,
            fuel: Math.max(0, v.fuel - fuelConsumptionRate)
          };
        });

        // 3. AI Decision Making (every 30 seconds per vehicle)
        const now = Date.now();
        for (const vehicle of updatedVehicles) {
          const lastDecision = lastAIDecisionTime.current.get(vehicle.id) || 0;
          if (now - lastDecision > 30000 && vehicle.fuel > 0) {
            // Make AI decision
            try {
              const aiResponse = await fetch('/api/ai/decision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  vehicleId: vehicle.id,
                  vehicle,
                  zones,
                  environment
                })
              });

              if (aiResponse.ok) {
                const decision = await aiResponse.json();
                if (decision.action) {
                  setAiDecisionsCount(prev => prev + 1);
                  console.log(`🤖 AI Decision for ${vehicle.id}:`, decision.action, '-', decision.reasoning);
                }
              }

              lastAIDecisionTime.current.set(vehicle.id, now);
            } catch (error) {
              console.error(`AI decision failed for ${vehicle.id}:`, error);
            }
          }
        }

        // 4. Update zone congestion based on vehicle count
        // Note: Frontend zones don't have location/radius, skip detailed calculation
        const updatedZones = zones.map(zone => {
          const vehiclesInZone = updatedVehicles.filter(v => v.status === 'in-transit').length;

          return {
            ...zone,
            vehicleCount: vehiclesInZone,
            congestionLevel: Math.min(100, Math.max(0, 
              zone.congestionLevel + (vehiclesInZone > 3 ? 2 : -1)
            ))
          };
        });

        // 5. Push updates to backend
        await fetch('/api/simulation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicles: updatedVehicles,
            zones: updatedZones
          })
        });

      } catch (error) {
        console.error('❌ Simulation tick error:', error);
      } finally {
        isSyncing.current = false;
      }
    }, 2000); // 2 second tick rate

    return () => clearInterval(tick);
  }, [isSimulating, vehicles, zones]);

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 border border-cyan-500/40 p-3 rounded-lg text-xs text-cyan-300 font-mono shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-1">
        {isSimulating ? (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 font-semibold">SIMULATION ACTIVE</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-500 rounded-full" />
            <span className="text-gray-400">SIMULATION PAUSED</span>
          </span>
        )}
      </div>
      {isSimulating && (
        <div className="text-[10px] text-cyan-400/70 space-y-0.5 mt-2 border-t border-cyan-500/20 pt-2">
          <div>Active Vehicles: {vehicles.filter(v => v.status === 'in-transit').length}</div>
          <div>Routes Generated: {routesGenerated}</div>
          <div>AI Decisions: {aiDecisionsCount}</div>
        </div>
      )}
    </div>
  );
}
