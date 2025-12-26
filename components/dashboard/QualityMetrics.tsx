"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Zap, Target, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

interface MetricProps {
    label: string;
    score: number; // 0 to 100
    icon: React.ReactNode;
    color: string;
    description: string;
}

export function QualityMetrics({ promptLength }: { promptLength: number }) {
    // Mock calculate metrics based on length for visual demo
    // In real app, these would come from the enhancement API
    const clarity = Math.min(85 + (promptLength % 15), 98);
    const structure = Math.min(90 + (promptLength % 10), 99);
    const completeness = Math.min(80 + (promptLength % 20), 100);
    const specificity = Math.min(88 + (promptLength % 12), 97);

    const metrics: MetricProps[] = [
        {
            label: "Clarity",
            score: clarity,
            icon: <Zap size={14} />,
            color: "bg-amber-500",
            description: "How easy it is for the AI to understand."
        },
        {
            label: "Structure",
            score: structure,
            icon: <TrendingUp size={14} />,
            color: "bg-blue-500",
            description: "Logical flow and formatting."
        },
        {
            label: "Context",
            score: completeness,
            icon: <BookOpen size={14} />,
            color: "bg-purple-500",
            description: "Detailed background info provided."
        },
        {
            label: "Specificity",
            score: specificity,
            icon: <Target size={14} />,
            color: "bg-emerald-500",
            description: "Precise instructions and constraints."
        },
    ];

    const overallScore = Math.round((clarity + structure + completeness + specificity) / 4);

    return (
        <div className="bg-card/30 border-t border-white/5 p-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-4 mb-4">
                <div className="relative flex items-center justify-center w-12 h-12">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                            className="text-secondary"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <motion.path
                            className={cn(
                                "stroke-current",
                                overallScore > 90 ? "text-green-500" : overallScore > 80 ? "text-amber-500" : "text-red-500"
                            )}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: overallScore / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            strokeWidth="3"
                            strokeDasharray="1, 0" // Required for pathLength to work with SVG in framer-motion sometimes, but standard CSS works too. 
                        />
                    </svg>
                    <span className="absolute text-xs font-bold">{overallScore}</span>
                </div>
                <div>
                    <span className="text-sm font-semibold text-foreground">Usage Score</span>
                    <p className="text-xs text-muted-foreground">Ready for production use</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {metrics.map((m, idx) => (
                    <div key={m.label} className="space-y-1.5 group">
                        <div className="flex justify-between items-center text-xs">
                            <Tooltip content={m.description}>
                                <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-foreground transition-colors cursor-help">
                                    {m.icon}
                                    {m.label}
                                </div>
                            </Tooltip>
                            <span className="font-mono font-medium text-foreground">{m.score}/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${m.score}%` }}
                                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                                className={cn("h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]", m.color)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
