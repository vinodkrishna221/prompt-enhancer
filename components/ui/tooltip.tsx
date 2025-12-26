"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
    content: string | React.ReactNode;
    children: React.ReactNode;
    className?: string;
    side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, className, side = "top" }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const positions = {
        top: "-top-2 left-1/2 -translate-x-1/2 -translate-y-full",
        bottom: "-bottom-2 left-1/2 -translate-x-1/2 translate-y-full",
        left: "-left-2 top-1/2 -translate-y-1/2 -translate-x-full",
        right: "-right-2 top-1/2 -translate-y-1/2 translate-x-full",
    };

    return (
        <div
            className="relative inline-flex flex-col items-center justify-center" // inline-flex to fit content
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: side === 'top' ? 5 : -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            "absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-popover-foreground/95 rounded-md shadow-lg whitespace-nowrap pointer-events-none border border-border/10 backdrop-blur-sm",
                            positions[side],
                            className
                        )}
                        style={{ maxWidth: 250, whiteSpace: 'normal', textAlign: 'center' }}
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
