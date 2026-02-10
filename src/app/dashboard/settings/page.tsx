'use client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTraffic } from '@/lib/TrafficContext';
import { Settings, Bell, Shield, Database, Moon, Zap, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    const { settings, updateSettings, isSimulating, toggleSimulation } = useTraffic();

    return (
        <div className="space-y-6 max-w-4xl">
            <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
            <p className="text-[--foreground]/60">Manage platform preferences and integrations.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 space-y-6 col-span-2">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Settings className="w-5 h-5 text-[--color-primary]" /> General Preferences
                    </h2>

                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <RefreshCw className={`h-5 w-5 ${isSimulating ? 'text-green-400 animate-spin-slow' : 'text-gray-400'}`} />
                            </div>
                            <div>
                                <h3 className="font-bold">Live Simulation</h3>
                                <p className="text-sm text-[--foreground]/60">Toggle real-time traffic updates and vehicle movements.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isSimulating}
                                onChange={toggleSimulation}
                            />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <Bell className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div>
                                <h3 className="font-bold">Notifications</h3>
                                <p className="text-sm text-[--foreground]/60">Enable real-time alerts for incidents and congestion.</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.notifications}
                                onChange={(e) => updateSettings({ notifications: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[--color-primary]"></div>
                        </label>
                    </div>
                </Card>

                <Card className="p-6 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[--color-success]" /> Thresholds & Limits
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium">Congestion Alert Threshold</label>
                                <span className="text-sm font-mono text-[--color-primary]">{settings.alertThreshold}%</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="100"
                                value={settings.alertThreshold}
                                onChange={(e) => updateSettings({ alertThreshold: parseInt(e.target.value) })}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[--color-primary]"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium">Refresh Rate</label>
                                <span className="text-sm font-mono text-[--color-primary]">{settings.refreshInterval}s</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={settings.refreshInterval}
                                onChange={(e) => updateSettings({ refreshInterval: parseInt(e.target.value) })}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[--color-primary]"
                            />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Database className="w-5 h-5 text-blue-400" /> Data Management
                    </h2>
                    <p className="text-sm text-[--foreground]/60">
                        Connected to local MBTiles database: <span className="text-white font-mono">bangalore.mbtiles</span>
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">Export Logs</Button>
                        <Button variant="primary" className="flex-1">Clear Cache</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
