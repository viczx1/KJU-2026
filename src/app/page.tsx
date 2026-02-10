'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BarChart3, Database, Globe, Truck, Zap } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollAnimations';
import Aurora from '@/components/ui/Aurora';
import Image from 'next/image';

const features = [
  {
    icon: <Truck className="h-6 w-6 text-[--color-primary]" />,
    title: "Eco-Fleet Optimization",
    description: "AI-powered routing algorithms that reduce fuel consumption by up to 30% while maintaining delivery SLAs."
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-[--color-accent]" />,
    title: "Predictive Analytics",
    description: "Forecast congestion patterns 45 minutes in advance using our proprietary LSTM neural networks."
  },
  {
    icon: <Database className="h-6 w-6 text-[--color-secondary]" />,
    title: "Granular Accountability",
    description: "Track every liter of fuel and every minute of idle time with tamper-proof blockchain logging."
  }
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[--background] text-[--foreground] font-sans selection:bg-[--color-primary] selection:text-white overflow-hidden relative">
      <Navbar />

      {/* Animated Deep Background - AURORA */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-[#0B0E14]" />
        <Aurora
          colorStops={["#00ff9d", "#00d4ff", "#ff4444"]}
          blend={0.6}
          amplitude={1.2}
          speed={0.8}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0E14]/50 to-[#0B0E14] pointer-events-none" />
      </div>

      <main className="relative pt-32 pb-20 px-4 md:px-6 container mx-auto">

        {/* Hero Section */}
        <section className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20 min-h-[80vh]">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="flex-1 space-y-8"
          >
            <ScrollReveal direction="up" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[--color-primary]/10 border border-[--color-primary]/20 mb-6 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[--color-primary] animate-pulse shadow-[0_0_10px_var(--color-primary)]" />
                <span className="text-xs font-medium text-[--color-primary] tracking-wide uppercase">System Operational v2.4</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[1] mb-6 drop-shadow-2xl">
                TRAFFIC<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[--color-primary] via-[#FFD700] to-[--color-secondary] animate-gradient-x bg-[length:200%_auto]">INTELLIGENCE</span><br />
                REDEFINED
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <p className="text-xl text-[--foreground]/70 max-w-xl leading-relaxed font-light">
                The advanced fleet management platform for the modern logistics era.
                Predict traffic, optimize routes, and maximize accountability with real-time data.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4} className="flex flex-wrap gap-4">
              <Button size="lg" className="group relative overflow-hidden bg-[--color-primary] hover:bg-[--color-secondary] transition-all duration-300 shadow-[0_0_30px_rgba(255,69,0,0.3)] hover:shadow-[0_0_50px_rgba(255,69,0,0.5)]">
                <span className="relative z-10 flex items-center">
                  Access Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/10 hover:bg-white/5 backdrop-blur-sm">
                View Documentation
              </Button>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.5} className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5">
              {[
                { val: "98%", label: "Prediction Accuracy" },
                { val: "30%", label: "Fuel Reduction" },
                { val: "24/7", label: "Live Monitoring" }
              ].map((stat, i) => (
                <div key={i}>
                  <h3 className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">{stat.val}</h3>
                  <p className="text-sm text-[--foreground]/50 mt-1 uppercase tracking-wider text-[10px]">{stat.label}</p>
                </div>
              ))}
            </ScrollReveal>
          </motion.div>

          {/* Visualization / Mock Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 w-full relative perspective-1000"
          >
            <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden glass-panel border-white/10 shadow-2xl shadow-[--color-primary]/10 group transition-all duration-500 hover:shadow-[--color-primary]/20 hover:scale-[1.02]">
              {/* Abstract Map UI */}
              <div className="absolute inset-0 bg-[#0c1018]">
                {/* Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />

                {/* Radar Sweep Animation */}
                <div className="absolute inset-0 flex items-center justify-center mix-blend-screen">
                  <div className="w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_340deg,rgba(255,69,0,0.2)_360deg)] animate-[spin_4s_linear_infinite]" />
                </div>

                {/* Nodes */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_15px_white]"
                    style={{
                      top: `${Math.random() * 80 + 10}%`,
                      left: `${Math.random() * 80 + 10}%`,
                    }}
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen">
                  <path d="M100,100 Q250,50 400,200 T600,300" stroke="#FF4500" strokeWidth="4" fill="none" filter="url(#glow)" strokeDasharray="10,10" className="animate-[dash_20s_linear_infinite]" />
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                </svg>

                {/* Stats Panel Overlay */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute top-4 right-4 p-4 glass-panel rounded-xl w-48 space-y-3 backdrop-blur-xl border-white/10"
                >
                  <div className="flex justify-between items-center text-xs text-[--foreground]/60">
                    <span>SECTOR A</span>
                    <span className="text-[--color-success] animate-pulse">● LIVE</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[--color-primary]"
                      initial={{ width: 0 }}
                      animate={{ width: "70%" }}
                      transition={{ duration: 1.5, delay: 1.2 }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-sm">
                    <span>LOAD</span>
                    <span>72%</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="mt-32 relative" id="features">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[500px] bg-gradient-to-r from-transparent via-[--color-primary]/5 to-transparent blur-3xl -z-10" />

          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Intelligence at Scale</h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <ScrollReveal
                key={idx}
                delay={idx * 0.15}
                className="p-8 rounded-3xl glass-panel border border-white/5 hover:border-[--color-primary]/50 transition-all duration-500 group hovered:bg-white/5"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-[--color-primary] transition-colors">{feature.title}</h3>
                <p className="text-[--foreground]/60 text-base leading-relaxed group-hover:text-[--foreground]/90 transition-colors">
                  {feature.description}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
