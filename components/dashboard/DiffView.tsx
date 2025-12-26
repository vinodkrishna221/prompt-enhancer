"use client";

import { diffWords } from "diff";
import { cn } from "@/lib/utils";
interface DiffViewProps {
    original: string;
    enhanced: string;
    className?: string;
}

export function DiffView({ original, enhanced, className }: DiffViewProps) {
    const diff = diffWords(original, enhanced);

    return (
        <div className={cn("font-mono text-sm leading-6 whitespace-pre-wrap bg-[#1e1e1e] p-6 text-foreground/80", className)}>
            {diff.map((part, i) => {
                const color = part.added
                    ? "bg-green-500/20 text-green-400 border-b border-green-500/30"
                    : part.removed
                        ? "bg-red-500/20 text-red-500 line-through decoration-red-500/50"
                        : "text-muted-foreground"; // Dim unchanged text slightly

                return (
                    <span key={i} className={cn(color, "px-0.5 rounded-sm transition-colors")}>
                        {part.value}
                    </span>
                );
            })}
        </div>
    );
}
