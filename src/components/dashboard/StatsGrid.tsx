'use client';
import { Card } from '@/components/ui/Card';
import { useTraffic } from '@/lib/TrafficContext';
import { Truck, Activity, BatteryCharging, Zap, AlertTriangle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export function StatsGrid() {
    const { stats, isSimulating } = useTraffic();

    const statItems = [
        { label: 'Total Fleet', value: stats.totalVehicles, icon: Truck, change: `${stats.activeVehicles} active`, trend: 'up' },
        { label: 'Active Routes', value: stats.activeVehicles, icon: Activity, change: `of ${stats.totalVehicles}`, trend: 'up', color: 'text-[--color-success]' },
        { label: 'Avg Efficiency', value: `${stats.avgEfficiency}%`, icon: Zap, change: isSimulating ? 'LIVE' : 'PAUSED', trend: 'up', color: 'text-[--color-warning]' },
        { label: 'Avg Congestion', value: `${stats.avgCongestion}%`, icon: BarChart3, change: `${stats.totalIncidents} incidents`, trend: stats.avgCongestion > 60 ? 'down' : 'up', color: stats.avgCongestion > 70 ? 'text-red-400' : 'text-[--color-accent]' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statItems.map((item, idx) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
                >
                    <Card className="hover:border-[--color-primary]/50 group relative overflow-hidden glass-panel-hover">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div>
                                <p className="text-sm text-[--foreground]/60 font-medium font-sans">{item.label}</p>
                                <motion.h3
                                    key={String(item.value)}
                                    initial={{ scale: 1.1, color: '#ff4500' }}
                                    animate={{ scale: 1, color: '#ffffff' }}
                                    transition={{ duration: 0.3 }}
                                    className="text-3xl font-bold font-mono mt-1 group-hover:text-[--color-primary] transition-colors"
                                >
                                    {item.value}
                                </motion.h3>
                            </div>
                            <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-[--color-primary]/10 transition-colors ${item.color || 'text-[--color-primary]'}`}>
                                <item.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className={item.trend === 'up' ? 'text-[--color-success]' : 'text-red-400'}>
                                {item.change}
                            </span>
                            {isSimulating && (
                                <span className="flex items-center gap-1 text-[--foreground]/40">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    live
                                </span>
                            )}
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
