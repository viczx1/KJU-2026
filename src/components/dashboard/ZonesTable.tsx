'use client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTraffic } from '@/lib/TrafficContext';
import { AlertTriangle, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ZonesTable() {
    const { zones, incidents, updateZoneCongestion, isSimulating } = useTraffic();

    return (
        <Card className="col-span-1 border-white/10 overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="font-bold text-lg">Live Congestion Zones</h3>
                <div className="flex gap-2">
                    <Badge variant="warning">{zones.filter(z => z.congestionLevel > 70).length} Critical</Badge>
                    {isSimulating && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse my-auto" title="Live Data" />}
                </div>
            </div>
            <div className="overflow-y-auto flex-1 p-0 custom-scrollbar">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-[--foreground]/60 uppercase text-xs font-mono sticky top-0 backdrop-blur-md z-10">
                        <tr>
                            <th className="px-4 py-3 font-medium">Zone Area</th>
                            <th className="px-4 py-3 font-medium text-right">Load</th>
                            <th className="px-4 py-3 font-medium text-right">Trend</th>
                            <th className="px-4 py-3 font-medium text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <AnimatePresence>
                            {zones.map((zone) => (
                                <motion.tr
                                    key={zone.id}
                                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => updateZoneCongestion(zone.id, Math.min(100, zone.congestionLevel + 10))}
                                >
                                    <td className="px-4 py-3 font-medium text-[--foreground]">
                                        {zone.area}
                                        <div className="text-xs text-[--foreground]/40 font-mono">{zone.id}</div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono">
                                        <motion.span
                                            key={zone.congestionLevel}
                                            initial={{ color: '#fff' }}
                                            animate={{ color: zone.congestionLevel > 80 ? '#ef4444' : '#fff' }}
                                        >
                                            {zone.congestionLevel}%
                                        </motion.span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {zone.trend === 'up' ? (
                                                <TrendingUp className="h-3 w-3 text-red-400" />
                                            ) : (
                                                <TrendingUp className="h-3 w-3 text-green-400 rotate-180" />
                                            )}
                                            <span className={zone.trend === 'up' ? "text-red-400" : "text-green-400"}>
                                                {Math.abs((zone.predictedLevel || zone.congestionLevel) - zone.congestionLevel)}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {zone.incidents > 0 ? (
                                            <Badge variant="danger" className="animate-pulse">Incident</Badge>
                                        ) : zone.congestionLevel > 80 ? (
                                            <Badge variant="warning">Heavy</Badge>
                                        ) : (
                                            <Badge variant="success">Clear</Badge>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Incident Mini-Feed */}
            <div className="border-t border-white/10 bg-red-500/5 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3" /> Active Incidents
                </h4>
                <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                    <AnimatePresence>
                        {incidents.slice(0, 5).map((inc) => (
                            <motion.div
                                key={inc.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex gap-3 items-start text-sm"
                            >
                                <AlertCircle className="h-4 w-4 text-[--color-primary] shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-[--foreground]">{inc.type.toUpperCase()} <span className="text-[--foreground]/40 font-mono text-xs">#{inc.id}</span></p>
                                    <p className="text-[--foreground]/60 text-xs">{inc.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {incidents.length === 0 && (
                        <div className="text-center text-xs text-[--foreground]/40 py-2">
                            No active incidents reported.
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
