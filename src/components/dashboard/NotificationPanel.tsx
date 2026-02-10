'use client';
import { useTraffic } from '@/lib/TrafficContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function NotificationPanel() {
    const { notifications, dismissNotification, clearNotifications } = useTraffic();
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.length;

    const iconMap = {
        info: <Info className="w-4 h-4 text-blue-400" />,
        warning: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
        danger: <AlertCircle className="w-4 h-4 text-red-400" />,
        success: <CheckCircle className="w-4 h-4 text-green-400" />,
    };

    const bgMap = {
        info: 'border-blue-500/20 bg-blue-500/5',
        warning: 'border-yellow-500/20 bg-yellow-500/5',
        danger: 'border-red-500/20 bg-red-500/5',
        success: 'border-green-500/20 bg-green-500/5',
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-[#0f1219] border border-white/10 rounded-xl shadow-2xl"
                    >
                        <div className="p-3 border-b border-white/10 flex justify-between items-center">
                            <span className="text-sm font-bold">Notifications</span>
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearNotifications}
                                    className="text-xs text-[--foreground]/40 hover:text-white transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div className="divide-y divide-white/5">
                            {notifications.length === 0 ? (
                                <div className="p-6 text-center text-sm text-[--foreground]/40">
                                    No notifications
                                </div>
                            ) : (
                                notifications.slice(0, 15).map(n => (
                                    <motion.div
                                        key={n.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className={`p-3 flex gap-3 items-start border-l-2 ${bgMap[n.type]} hover:bg-white/5 transition-colors`}
                                    >
                                        <div className="mt-0.5">{iconMap[n.type]}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm">{n.message}</p>
                                            <p className="text-[10px] text-[--foreground]/40 font-mono mt-1">
                                                {n.timestamp.toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => dismissNotification(n.id)}
                                            className="text-[--foreground]/30 hover:text-white p-1"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
