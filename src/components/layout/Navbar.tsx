'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export function Navbar() {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0B0E14]/80 backdrop-blur-md"
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[--color-primary] text-white">
                        <Activity className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">TRAFFIC<span className="text-[--color-primary]">MAXXERS</span></span>
                </Link>
                <nav className="hidden md:flex gap-6">
                    <Link href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Features
                    </Link>
                    <Link href="#solutions" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Solutions
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Pricing
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="hidden md:flex">
                            Log in
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="primary" size="sm">
                            Dashboard Access
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
