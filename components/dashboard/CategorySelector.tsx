"use client";

import { motion } from "framer-motion";
import { Code2, Bug, Palette, Server, Lightbulb, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type Category = "Coding" | "BugFixing" | "Frontend" | "Backend" | "General";

interface CategorySelectorProps {
    selected: Category;
    onSelect: (category: Category) => void;
}

interface CategoryItem {
    id: Category;
    label: string;
    icon: LucideIcon;
    color: string;
    description: string;
}

const CATEGORIES: CategoryItem[] = [
    {
        id: "Coding",
        label: "Core Coding",
        icon: Code2,
        color: "text-blue-400",
        description: "Standard logic & algorithms"
    },
    {
        id: "BugFixing",
        label: "Bug Fixing",
        icon: Bug,
        color: "text-red-400",
        description: "Debug & resolve errors"
    },
    {
        id: "Frontend",
        label: "Frontend",
        icon: Palette,
        color: "text-pink-400",
        description: "UI/UX & responsiveness"
    },
    {
        id: "Backend",
        label: "Backend",
        icon: Server,
        color: "text-emerald-400",
        description: "API, DB & server logic"
    },
    {
        id: "General",
        label: "General",
        icon: Lightbulb,
        color: "text-yellow-400",
        description: "Brainstorming & ideas"
    },
];

export function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider pl-1">
                Select Goal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-1.5 bg-secondary/30 rounded-xl backdrop-blur-sm border border-white/5">
                {CATEGORIES.map((cat) => {
                    const isSelected = selected === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelect(cat.id)}
                            className={cn(
                                "relative flex flex-col items-center justify-center py-3 px-2 rounded-lg text-sm font-medium transition-all duration-300 outline-none focus-visible:ring-2 ring-primary/50",
                                isSelected ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            {isSelected && (
                                <motion.div
                                    layoutId="activeCategory"
                                    className="absolute inset-0 bg-secondary rounded-lg shadow-lg border border-white/5"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex flex-col items-center gap-1.5">
                                <cat.icon
                                    size={18}
                                    className={cn("transition-colors duration-300", isSelected ? cat.color : "opacity-70 group-hover:opacity-100")}
                                />
                                <span className="text-[10px] sm:text-xs text-center leading-none">
                                    {cat.label}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>
            {/* Description Fade */}
            <div className="h-6 flex items-center justify-center">
                <motion.p
                    key={selected}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-muted-foreground text-center"
                >
                    {CATEGORIES.find(c => c.id === selected)?.description}
                </motion.p>
            </div>
        </div>
    );
}
