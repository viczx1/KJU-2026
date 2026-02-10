'use client';
import { Card } from '@/components/ui/Card';
import { CloudRain, Sun, Wind, Droplets, Thermometer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTraffic } from '@/lib/TrafficContext';

export function WeatherCard() {
    const { isSimulating } = useTraffic();
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState({
        temp: 28,
        condition: 'Cloudy',
        humidity: 65,
        wind: 12
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Simulate weather changes
    useEffect(() => {
        if (!isSimulating) return;

        const interval = setInterval(() => {
            setWeather(prev => ({
                temp: prev.temp + (Math.random() - 0.5),
                condition: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'Rain' : 'Sunny') : prev.condition,
                humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() - 0.5) * 5)),
                wind: Math.max(0, prev.wind + (Math.random() - 0.5) * 2)
            }));
        }, 10000);

        return () => clearInterval(interval);
    }, [isSimulating]);

    return (
        <Card className="mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

            <div className="relative z-10 p-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            Sector Weather
                        </h3>
                        <p className="text-xs text-[--foreground]/60 font-mono">
                            {time.toLocaleTimeString()}
                        </p>
                    </div>
                    {weather.condition === 'Rain' ? (
                        <CloudRain className="h-10 w-10 text-blue-400" />
                    ) : weather.condition === 'Sunny' ? (
                        <Sun className="h-10 w-10 text-yellow-400" />
                    ) : (
                        <CloudRain className="h-10 w-10 text-gray-400" />
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <Thermometer className="h-4 w-4 mx-auto mb-1 text-red-400" />
                        <div className="font-bold text-lg">{weather.temp.toFixed(1)}°</div>
                        <div className="text-[10px] uppercase text-[--foreground]/40">Temp</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                        <div className="font-bold text-lg">{Math.round(weather.humidity)}%</div>
                        <div className="text-[10px] uppercase text-[--foreground]/40">Humid</div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <Wind className="h-4 w-4 mx-auto mb-1 text-cyan-400" />
                        <div className="font-bold text-lg">{Math.round(weather.wind)}km/h</div>
                        <div className="text-[10px] uppercase text-[--foreground]/40">Wind</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
