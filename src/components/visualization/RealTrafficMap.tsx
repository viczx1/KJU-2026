'use client';
import { Card } from '@/components/ui/Card';
import { useEffect, useRef, useState } from 'react';
import { useTraffic } from '@/lib/TrafficContext';
import { MapPin, Navigation, Truck, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';

interface RealTrafficMapProps {
    vehicleFilter?: 'all' | 'truck' | 'car' | 'van';
    showIncidents?: boolean;
}

export function RealTrafficMap({ vehicleFilter = 'all', showIncidents = true }: RealTrafficMapProps) {
    const { vehicles, incidents, isSimulating } = useTraffic();
    const mapContainer = useRef<HTMLDivElement>(null);
    const [mapInstance, setMapInstance] = useState<any>(null);
    const [L, setL] = useState<any>(null);
    const vehicleMarkersRef = useRef<Map<string, any>>(new Map());
    
    const [lng] = useState(77.5946);
    const [lat] = useState(12.9716);
    const [zoom] = useState(13);

    // Load Leaflet dynamically (client-side only)
    useEffect(() => {
        import('leaflet').then((leaflet) => {
            console.log('📦 Leaflet loaded');
            setL(leaflet.default);
        }).catch(err => {
            console.error('❌ Failed to load Leaflet:', err);
        });
    }, []);

    useEffect(() => {
        if (mapInstance || !mapContainer.current || !L) return;

        console.log('🗺️ Initializing Leaflet map...');

        try {
            // Create map
            const map = L.map(mapContainer.current, {
                center: [lat, lng],
                zoom: zoom,
                zoomControl: true
            });

            // Add OpenStreetMap tiles (free, no API key needed)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
                maxZoom: 19
            }).addTo(map);

            console.log('✅ Leaflet map initialized successfully');
            setMapInstance(map);

            // Force map to recalculate size after container is fully rendered
            setTimeout(() => {
                map.invalidateSize();
                console.log('🔄 Map size invalidated and recalculated');
            }, 100);
        } catch (err) {
            console.error('❌ Map initialization failed:', err);
        }
    }, [L, lat, lng, zoom]);

    // Handle window resize
    useEffect(() => {
        if (!mapInstance) return;

        const handleResize = () => {
            mapInstance.invalidateSize();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [mapInstance]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (mapInstance) {
                mapInstance.remove();
                setMapInstance(null);
            }
        };
    }, [mapInstance]);

    // Vehicle markers with smooth animation
    useEffect(() => {
        if (!mapInstance || !L) return;

        const currentMarkers = vehicleMarkersRef.current;
        const validIds = new Set<string>();

        vehicles.forEach((vehicle) => {
            if (vehicleFilter !== 'all' && vehicle.type !== vehicleFilter) return;
            if (isNaN(vehicle.location.lng) || isNaN(vehicle.location.lat)) return;

            validIds.add(vehicle.id);

            if (currentMarkers.has(vehicle.id)) {
                // Update position with smooth animation
                const marker = currentMarkers.get(vehicle.id)!;
                const markerEl = marker.getElement();
                
                if (markerEl) {
                    // Add transition for smooth movement
                    markerEl.style.transition = 'transform 2s linear, opacity 0.3s';
                }
                
                // Smoothly update position
                marker.setLatLng([vehicle.location.lat, vehicle.location.lng]);

                // Update popup content dynamically
                const speedKmh = Math.round(vehicle.speed || 0);
                const fuelPercent = Math.round(vehicle.fuel || 0);
                const statusEmoji = vehicle.status === 'in-transit' ? '🚀' : 
                                  vehicle.status === 'idle' ? '⏸️' : '⚠️';

                marker.setPopupContent(
                    `<div style="font-family: monospace; font-size: 12px;">
                        <b>${vehicle.name}</b><br>
                        ${statusEmoji} ${vehicle.status}<br>
                        ⚡ ${speedKmh} km/h<br>
                        ⛽ ${fuelPercent}% fuel
                    </div>`
                );
            } else {
                // Create new marker with enhanced visuals
                const color = vehicle.type === 'truck' ? '#f97316' : 
                             vehicle.type === 'car' ? '#22d3ee' : '#a855f7';
                
                const isMoving = vehicle.status === 'in-transit';
                const pulseAnimation = isMoving ? 'animation: pulse 2s infinite;' : '';
                
                const icon = L.divIcon({
                    html: `
                        <style>
                            @keyframes pulse {
                                0%, 100% { box-shadow: 0 0 10px ${color}, 0 0 20px ${color}; }
                                50% { box-shadow: 0 0 20px ${color}, 0 0 30px ${color}; }
                            }
                        </style>
                        <div style="
                            width: 24px; 
                            height: 24px; 
                            background: ${color}; 
                            border: 3px solid white; 
                            border-radius: 50%; 
                            box-shadow: 0 0 10px ${color};
                            ${pulseAnimation}
                            transition: all 0.3s;
                        "></div>
                    `,
                    className: 'vehicle-marker',
                    iconSize: [24, 24]
                });

                const speedKmh = Math.round(vehicle.speed || 0);
                const fuelPercent = Math.round(vehicle.fuel || 0);
                const statusEmoji = vehicle.status === 'in-transit' ? '🚀' : 
                                  vehicle.status === 'idle' ? '⏸️' : '⚠️';

                const marker = L.marker([vehicle.location.lat, vehicle.location.lng], { icon })
                    .bindPopup(
                        `<div style="font-family: monospace; font-size: 12px;">
                            <b>${vehicle.name}</b><br>
                            ${statusEmoji} ${vehicle.status}<br>
                            ⚡ ${speedKmh} km/h<br>
                            ⛽ ${fuelPercent}% fuel
                        </div>`
                    )
                    .addTo(mapInstance);

                // Add smooth transition to new markers
                const markerEl = marker.getElement();
                if (markerEl) {
                    markerEl.style.transition = 'transform 2s linear, opacity 0.3s';
                }

                currentMarkers.set(vehicle.id, marker);
            }
        });

        // Remove old markers with fade-out animation
        currentMarkers.forEach((marker, id) => {
            if (!validIds.has(id)) {
                const markerEl = marker.getElement();
                if (markerEl) {
                    markerEl.style.opacity = '0';
                    setTimeout(() => {
                        marker.remove();
                        currentMarkers.delete(id);
                    }, 300);
                } else {
                    marker.remove();
                    currentMarkers.delete(id);
                }
            }
        });

    }, [mapInstance, L, vehicles, vehicleFilter]);

    return (
        <Card className="col-span-1 lg:col-span-2 relative h-full w-full overflow-hidden bg-[#0c1018] border-white/10 !p-0 shadow-2xl group">
            <div ref={mapContainer} className="absolute inset-0 z-0 w-full h-full" style={{background: '#0B0E14'}} />

            {/* Overlay HUD */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 drop-shadow-md">
                    <MapPin className="text-[--color-primary]" />
                    BANGALORE_OP_CNTR
                </h3>
                <div className="text-xs text-white/80 font-mono pl-8 drop-shadow-md">
                    LIVE FEED | LAT: {lat.toFixed(4)}° N | {isSimulating ? 'SIMULATION ACTIVE' : 'PAUSED'}
                </div>
            </div>
        </Card>
    );
}
