"use client";

import { useState, useEffect } from "react";
import { Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";

export interface FrontendData {
    type: string;
    name: string;
    designRef: string;
    interactions: string[];
    breakpoints: string[];
    accessibility: string;
}

export const INITIAL_FRONTEND_DATA: FrontendData = {
    type: "Component",
    name: "",
    designRef: "",
    interactions: [],
    breakpoints: [],
    accessibility: "WCAG AA",
};

interface FrontendQuestionsProps {
    value: FrontendData;
    onChange: (value: FrontendData) => void;
}

const TYPES = ["Component", "Page", "Layout", "Hook", "Utility"];
const INTERACTIONS = ["Hover Effects", "Animations", "Modals", "Forms", "Drag & Drop", "Infinite Scroll"];
const BREAKPOINTS = ["Mobile", "Tablet", "Desktop", "Wide"];
const ACCESSIBILITY = ["None", "WCAG A", "WCAG AA", "WCAG AAA"];

export function FrontendQuestions({ value, onChange }: FrontendQuestionsProps) {
    const update = (field: keyof FrontendData, val: any) => {
        onChange({ ...value, [field]: val });
    };

    const toggleList = (field: "interactions" | "breakpoints", item: string) => {
        const current = value[field] as string[];
        const next = current.includes(item)
            ? current.filter((i) => i !== item)
            : [...current, item];
        update(field, next);
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
                {/* Type Selection */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-foreground/80">What are you building?</label>
                        <Tooltip content="Helper for the AI to understand component structure.">
                            <Info size={12} className="text-muted-foreground/50 hover:text-primary transition-colors cursor-help" />
                        </Tooltip>
                    </div>
                    <select
                        className="w-full text-sm bg-background border border-input rounded-md px-3 py-2"
                        value={value.type}
                        onChange={(e) => update("type", e.target.value)}
                    >
                        {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* Component Name */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground/80">Name (Optional)</label>
                    <Input
                        placeholder="e.g. Header, HeroSection"
                        value={value.name}
                        onChange={(e) => update("name", e.target.value)}
                    />
                </div>
            </div>

            {/* Interactions */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-foreground/80">Required Interactions</label>
                    <Tooltip content="Specific behaviors to implement.">
                        <Info size={12} className="text-muted-foreground/50 hover:text-primary transition-colors cursor-help" />
                    </Tooltip>
                </div>
                <div className="flex flex-wrap gap-2">
                    {INTERACTIONS.map((item) => (
                        <button
                            key={item}
                            onClick={() => toggleList("interactions", item)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs border transition-all",
                                value.interactions.includes(item)
                                    ? "bg-primary/10 border-primary text-primary"
                                    : "bg-secondary text-muted-foreground border-transparent hover:border-input"
                            )}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* Breakpoints & Accessibility */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-foreground/80">Breakpoints</label>
                        <Tooltip content="Device sizes to optimize for.">
                            <Info size={12} className="text-muted-foreground/50 hover:text-primary transition-colors cursor-help" />
                        </Tooltip>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {BREAKPOINTS.map((item) => (
                            <button
                                key={item}
                                onClick={() => toggleList("breakpoints", item)}
                                className={cn(
                                    "px-2 py-1 rounded-md text-xs border transition-all",
                                    value.breakpoints.includes(item)
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "bg-secondary text-muted-foreground border-transparent hover:border-input"
                                )}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-foreground/80">Accessibility</label>
                        <Tooltip content="WCAG compliance level. 'AA' is standard for most apps.">
                            <Info size={12} className="text-muted-foreground/50 hover:text-primary transition-colors cursor-help" />
                        </Tooltip>
                    </div>
                    <select
                        className="w-full text-sm bg-background border border-input rounded-md px-3 py-2"
                        value={value.accessibility}
                        onChange={(e) => update("accessibility", e.target.value)}
                    >
                        {ACCESSIBILITY.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            {/* Design Reference */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/80">Design Reference / Description</label>
                <Textarea
                    placeholder="Paste URL, describe the look, or paste generic requirements..."
                    className="min-h-[100px] font-mono text-sm"
                    value={value.designRef}
                    onChange={(e) => update("designRef", e.target.value)}
                />
            </div>
        </div>
    );
}
