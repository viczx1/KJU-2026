'use client';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { useTraffic } from '@/lib/TrafficContext';
import { TrafficMap } from '@/components/visualization/TrafficMap';
import { ZonesTable } from '@/components/dashboard/ZonesTable';
import { WeatherCard } from '@/components/dashboard/WeatherCard';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Calendar, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
    const { syncData, addVehicle, isSimulating } = useTraffic();

    const handleDeploy = () => {
        addVehicle({
            name: `Rapid Response Unit`,
            type: 'car',
            status: 'active',
            location: { lat: 12.9716, lng: 77.5946 }, // Bangalore center default
            fuel: 100,
            efficiency: 100
        });
    };

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gradient">Mission Control</h1>
                    <p className="text-[--foreground]/60 mt-1">Real-time fleet operations and traffic intelligence.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-sm font-mono text-[--foreground]/60">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" onClick={syncData}>
                        <RefreshCw className={`h-4 w-4 ${isSimulating ? 'animate-spin' : ''}`} />
                        Sync Data
                    </Button>
                    <Button onClick={handleDeploy}>
                        Deploy Unit
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <StatsGrid />

            {/* Main Content Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                            Live Traffic Network
                        </h2>
                        <div className="text-xs font-mono text-[--foreground]/40">UPTIME: 99.9%</div>
                    </div>
                    <TrafficMap />
                </div>

                <div className="lg:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Zone Analysis & Briefing</h2>
                        <Button variant="ghost" size="sm" className="text-xs">View All</Button>
                    </div>
                    <WeatherCard />
                    <ZonesTable />
                </div>
            </motion.div>
        </div>
    );
}
