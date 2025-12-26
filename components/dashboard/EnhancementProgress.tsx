"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2, Sparkles, Brain, FileSearch, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancementProgressProps {
    isEnhancing: boolean;
}

const STEPS = [
    { label: "Parsing Prompt Input...", icon: FileSearch, color: "text-blue-400" },
    { label: "Analyzing Project Context...", icon: Brain, color: "text-purple-400" },
    { label: "Applying Best Practices...", icon: Zap, color: "text-yellow-400" },
    { label: "Final Polish & Formatting...", icon: Sparkles, color: "text-green-400" },
];

export function EnhancementProgress({ isEnhancing }: EnhancementProgressProps) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (!isEnhancing) {
            setCurrentStep(0);
            return;
        }

        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
        }, 800); // 800ms per step simulation

        return () => clearInterval(interval);
    }, [isEnhancing]);

    if (!isEnhancing) return null;

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-6 w-full h-full min-h-[300px]">
            <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <motion.div
                    className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    key={currentStep}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {(() => {
                        const StepIcon = STEPS[currentStep].icon;
                        return <StepIcon size={24} className={STEPS[currentStep].color} />;
                    })()}
                </motion.div>
            </div>

            <div className="space-y-2 text-center z-10">
                <AnimatePresence mode="wait">
                    <motion.h3
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-lg font-medium text-foreground tracking-tight"
                    >
                        {STEPS[currentStep].label}
                    </motion.h3>
                </AnimatePresence>
                <p className="text-sm text-muted-foreground">
                    Optimizing for selected model...
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs h-1.5 bg-secondary rounded-full overflow-hidden mt-4">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );
}
