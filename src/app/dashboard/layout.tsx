'use client';
import { Sidebar } from '@/components/layout/Sidebar';
import { motion } from 'framer-motion';
import { AnimatedGradientBackground } from '@/components/ui/ScrollAnimations';
import { TrafficProvider } from '@/lib/TrafficContext';
import { NotificationPanel } from '@/components/dashboard/NotificationPanel';
import SimulationController from '@/components/logic/SimulationController';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <TrafficProvider>
            <SimulationController />
            <div className="flex h-screen overflow-hidden bg-[--background] text-[--foreground] relative">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0B0E14] to-[#151921]">
                    <AnimatedGradientBackground />
                </div>
                <Sidebar />
                <main className="ml-64 flex-1 overflow-y-auto w-full relative z-0">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                    <NotificationPanel />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="p-8 pb-32 max-w-[1600px] mx-auto min-h-screen relative z-10"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </TrafficProvider>
    );
}
