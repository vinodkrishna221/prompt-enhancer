"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export const KineticBackground = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Normalize coordinates to be centered (0,0 is middle of screen)
            // or just use viewport percentage
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Dynamic background gradient that shifts slightly with mouse
    const bgX = useSpring(mouseX, { damping: 50, stiffness: 50 });
    const bgY = useSpring(mouseY, { damping: 50, stiffness: 50 });

    // We'll create a few "Blobs"
    // Blob 1: Primary Orange, follows mouse directly but smoothed
    const style1 = useMotionTemplate`radial-gradient(400px circle at ${x}px ${y}px, rgba(234, 88, 12, 0.15), transparent 80%)`;

    // Blob 2: Secondary Stone/Darker, drifts opposite
    // simple math to invert movement for depth

    return (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
            {/* Ambient Background Glow */}
            <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-stone-800/20 blur-[120px]" />

            {/* Interactive Cursor Glow */}
            <motion.div
                className="absolute inset-0 opacity-100 mix-blend-screen"
                style={{ background: style1 }}
            />

            {/* Grid Pattern Overlay for "Industrial" feel */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />
        </div>
    );
};
