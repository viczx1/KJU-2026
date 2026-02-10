'use client';
import { Card } from '@/components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { vehicles, trafficZones } from '@/lib/mockData';
import { MapPin } from 'lucide-react';

// Mock Bangalore Routes (Abstract representation)
// Coordinates are roughly mapped to a 800x600 SVG canvas
// Center ~ (400, 300) = Cubbon Park / MG Road
const bangaloreRoutes = [
    // Route 1: Hebbal to Silk Board (North-South Corridor)
    "M400,50 L400,150 C400,200 350,250 350,300 S450,450 450,550",

    // Route 2: Majestic to Whitefield (West-East)
    "M100,300 L250,300 C300,300 450,280 550,280 S750,300 750,300",

    // Route 3: Outer Ring Road (Partial Loop)
    "M150,150 Q400,50 650,150 T650,450 T150,450",

    // Route 4: Indiranagar to Koramangala (Inner connection)
    "M550,250 C550,350 450,400 450,500"
];

const landmarks = [
    { id: 'L1', name: 'M.G. Road', x: 420, y: 290 },
    { id: 'L2', name: 'Silk Board', x: 450, y: 550, isHotspot: true },
    { id: 'L3', name: 'Hebbal', x: 400, y: 60 },
    { id: 'L4', name: 'Whitefield', x: 720, y: 300 },
    { id: 'L5', name: 'Majestic', x: 180, y: 300 },
    { id: 'L6', name: 'Koramangala', x: 480, y: 480 },
    { id: 'L7', name: 'Indiranagar', x: 580, y: 260 },
];

export function TrafficMap() {
    const [selectedZone, setSelectedZone] = useState<string | null>(null);
    const [hoveredLandmark, setHoveredLandmark] = useState<string | null>(null);
    const [isOptimized, setIsOptimized] = useState(false);

    const toggleOptimization = () => {
        setIsOptimized(!isOptimized);
    };

    return (
        <Card className="col-span-1 lg:col-span-2 relative h-[600px] overflow-hidden bg-[#0c1018] border-white/10 p-0 shadow-2xl group">
            {/* Map Content */}
            <div className="absolute inset-0">
                {/* Geographic Background Hint */}
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/77.5946,12.9716,11,0,0/800x600?access_token=pk.mock')] opacity-20 filter grayscale contrast-150 pointer-events-none mix-blend-overlay" />

                {/* Tech Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

                <svg className="w-full h-full relative z-10" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">

                    {/* Main Arteries (Glow Effect) */}
                    <defs>
                        <filter id="roadGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Render Routes */}
                    {bangaloreRoutes.map((d, i) => {
                        // Silk Board Route is index 0
                        const isCongested = i === 0 && !isOptimized;
                        const routeColor = isCongested ? "#ef4444" : "#3b82f6";

                        return (
                            <g key={`route-group-${i}`}>
                                {/* Base Road */}
                                <motion.path
                                    d={d}
                                    fill="none"
                                    stroke="#1e293b"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, delay: i * 0.2 }}
                                />
                                {/* Active Traffic Flow Animation */}
                                <motion.path
                                    d={d}
                                    fill="none"
                                    stroke={routeColor}
                                    strokeWidth="2"
                                    strokeDasharray="4 8"
                                    filter="url(#roadGlow)"
                                    initial={{ strokeDashoffset: 0 }}
                                    animate={{
                                        strokeDashoffset: -200,
                                        stroke: routeColor
                                    }}
                                    transition={{
                                        strokeDashoffset: { duration: 10 + i * 2, repeat: Infinity, ease: "linear" },
                                        stroke: { duration: 0.5 }
                                    }}
                                    className="opacity-60"
                                />
                            </g>
                        )
                    })}

                    {/* Landmarks / Hubs */}
                    {landmarks.map((l) => (
                        <motion.g
                            key={l.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 }}
                            onMouseEnter={() => setHoveredLandmark(l.id)}
                            onMouseLeave={() => setHoveredLandmark(null)}
                            className="cursor-pointer"
                        >
                            {/* Pulsing Effect for Hotspots */}
                            {l.isHotspot && !isOptimized && (
                                <motion.circle
                                    cx={l.x} cy={l.y} r={20}
                                    fill="rgba(239, 68, 68, 0.2)"
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            )}

                            <circle cx={l.x} cy={l.y} r={4} fill={l.isHotspot && !isOptimized ? "#ef4444" : "#ffffff"} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />

                            {/* Label */}
                            <text
                                x={l.x}
                                y={l.y - 10}
                                fill="white"
                                textAnchor="middle"
                                className="text-[10px] font-mono tracking-widest uppercase fill-white/70 font-bold pointer-events-none"
                            >
                                {l.name}
                            </text>
                        </motion.g>
                    ))}

                    {/* Vehicles Moving */}
                    {vehicles.slice(0, 8).map((vehicle, i) => {
                        const route = bangaloreRoutes[i % bangaloreRoutes.length];
                        const color = vehicle.type === 'truck' ? '#f97316' : '#22d3ee';
                        return (
                            <g key={vehicle.id}>
                                {/* Glow circle */}
                                <circle r="8" fill={color} opacity="0.2">
                                    <animateMotion dur={`${15 + i * 5}s`} repeatCount="indefinite" path={route} />
                                </circle>
                                {/* Core dot */}
                                <circle r="4" fill={color} stroke={color} strokeWidth="1" opacity="0.9">
                                    <animateMotion dur={`${15 + i * 5}s`} repeatCount="indefinite" path={route} />
                                </circle>
                            </g>
                        );
                    })}
                </svg>

                {/* HUD Elements */}
                <div className="absolute top-4 left-4">
                    <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <MapPin className="text-[--color-primary]" />
                        BANGALORE_OP_CNTR
                    </h3>
                    <div className="text-xs text-[--foreground]/60 font-mono pl-8">
                        LAT: 12.9716° N | LNG: 77.5946° E
                    </div>

                    {/* Optimizer Control */}
                    <div className="mt-4">
                        <button
                            onClick={toggleOptimization}
                            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider border transition-all flex items-center gap-2 ${isOptimized ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30'}`}
                        >
                            {isOptimized ? (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    SYSTEM OPTIMIZED
                                </>
                            ) : (
                                <>
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    OPTIMIZE TRAFFIC FLOW
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 right-4 glass-panel px-4 py-2 rounded-lg border border-white/5 flex flex-col gap-2 text-xs font-mono text-[--foreground]/60">
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isOptimized ? 'bg-blue-500' : 'bg-red-500 animate-pulse'}`} />
                        {isOptimized ? 'Flow Optimized' : 'High Congestion (Silk Board)'}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" /> Free Flow
                    </div>
                    <div className="flex items-center gap-2 border-t border-white/10 pt-2 mt-1">
                        <span className="w-3 h-3 rounded-full bg-cyan-400" /> Fleet Unit
                    </div>
                </div>
            </div>
        </Card>
    );
}
