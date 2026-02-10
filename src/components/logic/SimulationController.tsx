'use client';

import { useEffect, useRef } from 'react';
import { useTraffic } from '@/lib/TrafficContext';

export default function SimulationController() {
  const { vehicles, zones, isSimulating } = useTraffic();
  // Ref to track if we're currently syncing to avoid overlapping calls
  const isSyncing = useRef(false);

  useEffect(() => {
    // Only run if master simulation is toggled ON
    if (!isSimulating) return;

    const tick = setInterval(async () => {
      if (isSyncing.current) return;
      isSyncing.current = true;

      try {
        // 1. Calculate Next State (Physics Logic)
        const updatedVehicles = vehicles.map(v => {
          if (v.status !== 'active') return v;
          return {
            ...v,
            fuel: Math.max(0, v.fuel - (Math.random() * 0.2)),
            location: {
              // Simple Random Walk for Hackathon
              lat: v.location.lat + (Math.random() - 0.5) * 0.001,
              lng: v.location.lng + (Math.random() - 0.5) * 0.001
            }
          };
        });

        const updatedZones = zones.map(z => ({
            ...z,
            congestionLevel: Math.max(10, Math.min(100, z.congestionLevel + Math.floor((Math.random() - 0.5) * 4)))
        }));

        // 2. Push to Backend
        await fetch('/api/simulation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                vehicles: updatedVehicles,
                zones: updatedZones
            })
        });
        
      } catch (e) {
        console.error("Simulation Sync Error:", e);
      } finally {
        isSyncing.current = false;
      }
    }, 6000); // reduced to 6 seconds to prevent memory leaks

    return () => clearInterval(tick);
  }, [isSimulating, vehicles, zones]);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 border border-green-500/30 p-2 rounded text-xs text-green-400 font-mono shadow-xl backdrop-blur">
       {isSimulating ? '● SIMULATION NODE ACTIVE' : '○ SIMULATION NODE PAUSED'}
    </div>
  );
}
