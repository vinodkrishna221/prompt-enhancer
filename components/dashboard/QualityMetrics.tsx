"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricProps {
    label: string;
    score: number; // 0 to 100
    icon: React.ReactNode;
    color: string;
}

export function QualityMetrics({ promptLength }: { promptLength: number }) {
    // Mock calculate metrics based on length for visual demo
    // In real app, these would come from the enhancement API
    const clarity = Math.min(85 + (promptLength % 15), 98);
    const structure = Math.min(90 + (promptLength % 10), 99);
    const completeness = Math.min(80 + (promptLength % 20), 100);

    const metrics: MetricProps[] = [
        { label: "Clarity", score: clarity, icon: <Zap size={14} />, color: "bg-yellow-500" },
        { label: "Structure", score: structure, icon: <TrendingUp size={14} />, color: "bg-blue-500" },
        { label: "Completeness", score: completeness, icon: <CheckCircle2 size={14} />, color: "bg-green-500" },
    ];

    return (
        <div className="flex items-center gap-4 bg-card/40 border border-border/50 p-2 rounded-lg mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-2 border-r border-border/50 pr-4">
                Quality
            </span>
            <div className="flex-1 grid grid-cols-3 gap-4">
                {metrics.map((m) => (
                    <div key={m.label} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                {m.icon}
                                {m.label}
                            </div>
                            <span className="font-mono font-medium text-foreground">{m.score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${m.score}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={cn("h-full rounded-full", m.color)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
