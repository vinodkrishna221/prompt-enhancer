"use client";

import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export type ProjectType = "new" | "existing";

export interface ProjectContext {
    projectType: ProjectType;
    frameworks: string[];
    styling: string;
    uiLibrary: string;
    stateManagement: string;
    isTypescript: boolean;
}

export const DEFAULT_CONTEXT: ProjectContext = {
    projectType: "new",
    frameworks: ["Next.js"],
    styling: "Tailwind CSS",
    uiLibrary: "shadcn/ui",
    stateManagement: "None",
    isTypescript: true,
};

interface ProjectContextFormProps {
    value: ProjectContext;
    onChange: (value: ProjectContext) => void;
}

const FRAMEWORKS = ["Next.js", "React", "Vue", "Svelte", "Angular", "Node.js", "Express"];
const STYLING_OPTIONS = ["Tailwind CSS", "CSS Modules", "Styled Components", "Sass", "Plain CSS"];
const UI_LIBS = ["shadcn/ui", "Chakra UI", "Material UI", "Ant Design", "None"];
const STATE_MGMT = ["Context API", "Redux", "Zustand", "Recoil", "Jotai", "None"];

export function ProjectContextForm({ value, onChange }: ProjectContextFormProps) {
    const updateField = (field: keyof ProjectContext, newVal: any) => {
        onChange({ ...value, [field]: newVal });
    };

    const toggleFramework = (fw: string) => {
        const current = value.frameworks;
        const next = current.includes(fw)
            ? current.filter((f) => f !== fw)
            : [...current, fw];
        updateField("frameworks", next);
    };

    return (
        <Card className="border-2 shadow-none bg-card/50 p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    Project Context
                </h3>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    Provide details for better accuracy
                </span>
            </div>

            {/* Project Type Toggle */}
            <div className="grid grid-cols-2 bg-secondary/50 p-1 rounded-lg border border-border/50">
                {(["new", "existing"] as ProjectType[]).map((type) => (
                    <button
                        key={type}
                        onClick={() => updateField("projectType", type)}
                        className={cn(
                            "py-2 text-sm font-medium rounded-md transition-all duration-200",
                            value.projectType === type
                                ? "bg-background shadow-sm text-foreground border border-border/50"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {type === "new" ? "🚀 New Project" : "📂 Existing Codebase"}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Frameworks */}
                <div className="space-y-3">
                    <label className="text-xs font-semibold text-foreground/80">Tech Stack</label>
                    <div className="flex flex-wrap gap-2">
                        {FRAMEWORKS.map((fw) => {
                            const isActive = value.frameworks.includes(fw);
                            return (
                                <button
                                    key={fw}
                                    onClick={() => toggleFramework(fw)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs border transition-all duration-200 flex items-center gap-1.5",
                                        isActive
                                            ? "bg-primary/10 border-primary/30 text-primary"
                                            : "bg-secondary/30 border-transparent hover:border-border text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {isActive && <Check size={10} strokeWidth={3} />}
                                    {fw}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Configuration Grid */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Styling */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground/80">Styling</label>
                            <select
                                className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                                value={value.styling}
                                onChange={(e) => updateField("styling", e.target.value)}
                            >
                                {STYLING_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        {/* UI Library */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground/80">UI Library</label>
                            <select
                                className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                                value={value.uiLibrary}
                                onChange={(e) => updateField("uiLibrary", e.target.value)}
                            >
                                {UI_LIBS.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* State Management */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground/80">State Mgmt</label>
                            <select
                                className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                                value={value.stateManagement}
                                onChange={(e) => updateField("stateManagement", e.target.value)}
                            >
                                {STATE_MGMT.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        {/* TypeScript Toggle */}
                        <div className="space-y-2 flex flex-col justify-center">
                            <label className="text-xs font-semibold text-foreground/80 mb-2">TypeScript</label>
                            <div
                                className={cn(
                                    "flex items-center gap-2 cursor-pointer select-none",
                                    value.isTypescript ? "text-primary" : "text-muted-foreground"
                                )}
                                onClick={() => updateField("isTypescript", !value.isTypescript)}
                            >
                                <div className={cn(
                                    "w-9 h-5 rounded-full relative transition-colors duration-200",
                                    value.isTypescript ? "bg-primary" : "bg-input"
                                )}>
                                    <div className={cn(
                                        "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
                                        value.isTypescript ? "translate-x-4" : "translate-x-0"
                                    )} />
                                </div>
                                <span className="text-xs font-medium">{value.isTypescript ? "Enabled" : "Disabled"}</span>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </Card>
    );
}
