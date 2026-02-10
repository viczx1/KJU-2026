'use client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Activity } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
    return (
        <div className="min-h-screen grid items-center justify-center bg-[--background] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[--color-primary]/5 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md p-4"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[--color-primary] text-white mb-4 shadow-lg shadow-[--color-primary]/30">
                        <Activity className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Access Control</h1>
                    <p className="text-[--foreground]/60 mt-2">Enter credentials for Trafficmaxxers System.</p>
                </div>

                <Card className="p-6 space-y-4 border-[--border-color] bg-[--color-surface-100]/80 backdrop-blur-xl shadow-2xl">
                    <div className="space-y-1">
                        <label className="text-xs uppercase text-[--foreground]/40 font-bold tracking-wider">Operator ID</label>
                        <input type="text" className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[--color-primary]" placeholder="OP-8821" autoFocus />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs uppercase text-[--foreground]/40 font-bold tracking-wider">Security Key</label>
                        <input type="password" className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[--color-primary]" placeholder="••••••••" />
                    </div>

                    <Button className="w-full mt-4" size="lg">Initializing System...</Button>

                    <div className="text-center">
                        <Link href="/dashboard" className="text-xs text-[--foreground]/40 hover:text-[--color-primary] transition-colors">
                            Bypass Auth (Dev Mode)
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
