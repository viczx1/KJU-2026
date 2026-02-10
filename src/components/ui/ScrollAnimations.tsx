'use client';
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
    magnitude?: number;
}

export function ScrollReveal({
    children,
    className,
    delay = 0,
    direction = "up",
    magnitude = 50
}: ScrollRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const getDirectionOffset = () => {
        switch (direction) {
            case "up": return { y: magnitude };
            case "down": return { y: -magnitude };
            case "left": return { x: magnitude };
            case "right": return { x: -magnitude };
            default: return { y: magnitude };
        }
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, ...getDirectionOffset() }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getDirectionOffset() }}
            transition={{
                duration: 0.8,
                delay: delay,
                ease: [0.22, 1, 0.36, 1] // Custom bezier for smooth "Apple-like"reveal
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function ParallaxImage({ src, alt, className }: { src: string, alt: string, className?: string }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
    // Smooth out the parallax movement
    const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <div ref={ref} className={cn("overflow-hidden relative", className)}>
            <motion.img
                src={src}
                alt={alt}
                style={{ y: smoothY, scale: 1.2 }}
                className="w-full h-full object-cover"
            />
        </div>
    );
}

export function AnimatedGradientBackground() {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-[#0A0E1A]">
            {/* Base ambient light */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#050810] via-[#0D1220] to-[#0A0E1A] opacity-90" />
            
            {/* Animated Gradient Mesh */}
            <motion.div 
                className="absolute inset-0 opacity-40 mix-blend-screen"
                animate={{
                    background: [
                        "radial-gradient(circle at 0% 0%, rgba(255,69,0,0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 100% 100%, rgba(255,69,0,0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 0% 100%, rgba(0,188,212,0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 100% 0%, rgba(0,188,212,0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 0% 0%, rgba(255,69,0,0.15) 0%, transparent 50%)"
                    ]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating Orbs - Primary Red/Orange */}
            <motion.div
                animate={{
                    x: ["-20%", "20%", "-20%"],
                    y: ["-20%", "20%", "-20%"],
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,69,0,0.3)_0%,transparent_70%)] blur-[80px] mix-blend-screen"
            />

            {/* Floating Orbs - Secondary Cyan/Teal */}
            <motion.div
                animate={{
                    x: ["20%", "-20%", "20%"],
                    y: ["10%", "-10%", "10%"],
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,188,212,0.25)_0%,transparent_70%)] blur-[90px] mix-blend-screen"
            />

            {/* Floating Orbs - Accent Amber */}
            <motion.div
                animate={{
                    x: ["-10%", "30%", "-10%"],
                    y: ["20%", "-20%", "20%"],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,140,0,0.15)_0%,transparent_70%)] blur-[120px] mix-blend-screen"
            />

            {/* Pulse Wave */}
            <motion.div 
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
        </div>
    );
}
