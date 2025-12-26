"use client";

import { motion } from "framer-motion";
import { Tooltip } from "@/components/ui/tooltip";
import { Check, ChevronDown, Info, Save, Upload, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";


export type ProjectType = "new" | "existing";

export interface ProjectContext {
    projectType: ProjectType;
    frameworks: string[];
    styling: string;
    uiLibrary: string;
    stateManagement: string;
    isTypescript: boolean;
    // Fields for "Existing Codebase" mode
    directoryStructure?: string;
    sharedComponents?: string;
    importAliases?: string;
}

export const DEFAULT_CONTEXT: ProjectContext = {
    projectType: "new",
    frameworks: ["Next.js"],
    styling: "Tailwind CSS",
    uiLibrary: "shadcn/ui",
    stateManagement: "None",
    isTypescript: true,
    directoryStructure: "",
    sharedComponents: "",
    importAliases: "@/",
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
    const { toast } = useToast();
    const [presets, setPresets] = useState<{ name: string, data: ProjectContext }[]>([]);
    const [presetName, setPresetName] = useState("");
    const [showSaveInput, setShowSaveInput] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("prompt-enhancer-presets");
        if (saved) {
            try {
                setPresets(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse presets", e);
            }
        }
    }, []);

    const savePreset = () => {
        if (!presetName.trim()) return;
        const newPresets = [...presets, { name: presetName, data: value }];
        setPresets(newPresets);
        localStorage.setItem("prompt-enhancer-presets", JSON.stringify(newPresets));
        toast("Context preset saved!", "success");
        setPresetName("");
        setShowSaveInput(false);
    };

    const loadPreset = (preset: { name: string, data: ProjectContext }) => {
        onChange(preset.data);
        toast(`Loaded preset: ${preset.name}`, "info");
    };

    const deletePreset = (index: number) => {
        const newPresets = presets.filter((_, i) => i !== index);
        setPresets(newPresets);
        localStorage.setItem("prompt-enhancer-presets", JSON.stringify(newPresets));
        toast("Preset deleted.", "info");
    };

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
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
                    Project Context
                    <Tooltip content="Define your tech stack so the AI generates compatible code.">
                        <Info size={14} className="text-muted-foreground hover:text-primary transition-colors cursor-help" />
                    </Tooltip>
                </h3>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    Provide details for better accuracy
                </span>
            </div>

            <div className="flex items-center gap-2">
                {/* Presets Button/Menu */}
                <div className="relative group">
                    {presets.length > 0 && (
                        <div className="flex gap-2">
                            <select
                                className="text-xs bg-background border border-input rounded px-2 py-1 max-w-[100px]"
                                onChange={(e) => {
                                    if (e.target.value !== "") {
                                        const p = presets[parseInt(e.target.value)];
                                        loadPreset(p);
                                    }
                                }}
                                value=""
                            >
                                <option value="" disabled>Load Preset...</option>
                                {presets.map((p, i) => (
                                    <option key={i} value={i}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {showSaveInput ? (
                    <div className="flex items-center gap-1 animate-in slide-in-from-right-5 fade-in duration-200">
                        <input
                            className="h-6 w-24 text-xs bg-background border border-input rounded px-2"
                            placeholder="Name..."
                            value={presetName}
                            onChange={(e) => setPresetName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && savePreset()}
                        />
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={savePreset}>
                            <Save size={12} />
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-muted-foreground hover:text-primary gap-1"
                        onClick={() => setShowSaveInput(true)}
                    >
                        <Save size={12} />
                        Save
                    </Button>
                )}
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
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-foreground/80">Tech Stack</label>
                        <Tooltip content="Select frameworks you are using. Multi-select allowed.">
                            <Info size={12} className="text-muted-foreground/50 hover:text-primary transition-colors cursor-help" />
                        </Tooltip>
                    </div>
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
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-semibold text-foreground/80">Styling</label>
                                <Tooltip content="How do you want to handle CSS?">
                                    <Info size={12} className="text-muted-foreground/50 hover:text-primary transition-colors cursor-help" />
                                </Tooltip>
                            </div>
                            <select
                                className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/20 outline-none min-w-[140px]"
                                value={value.styling}
                                onChange={(e) => updateField("styling", e.target.value)}
                            >
                                {STYLING_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt} title={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>

                        {/* UI Library */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-semibold text-foreground/80">UI Library</label>
                                <Tooltip content="Component library for pre-built UI elements.">
                                    <Info size={12} className="text-muted-foreground/50 hover:text-primary transition-colors cursor-help" />
                                </Tooltip>
                            </div>
                            <select
                                className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/20 outline-none min-w-[140px]"
                                value={value.uiLibrary}
                                onChange={(e) => updateField("uiLibrary", e.target.value)}
                            >
                                {UI_LIBS.map((opt) => (
                                    <option key={opt} value={opt} title={opt}>{opt}</option>
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

            {/* Existing Codebase Context Fields */}
            {value.projectType === "existing" && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pt-4 border-t border-border/50"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">Existing Codebase Context</h4>
                        <Tooltip content="Provide details about your existing project structure for better integration.">
                            <Info size={12} className="text-muted-foreground/50 hover:text-primary transition-colors cursor-help" />
                        </Tooltip>
                    </div>

                    {/* Directory Structure */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground/80">Directory Structure</label>
                        <textarea
                            className="w-full text-xs bg-background border border-input rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/20 outline-none font-mono min-h-[80px] resize-y"
                            placeholder="Paste your project folder tree here...
src/
├── components/
│   ├── common/
│   └── pages/
├── lib/
└── app/"
                            value={value.directoryStructure || ""}
                            onChange={(e) => updateField("directoryStructure", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Shared Components */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground/80">Shared Components</label>
                            <input
                                className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Layout, Button, Card..."
                                value={value.sharedComponents || ""}
                                onChange={(e) => updateField("sharedComponents", e.target.value)}
                            />
                        </div>

                        {/* Import Aliases */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground/80">Import Aliases</label>
                            <input
                                className="w-full text-sm bg-background border border-input rounded-md px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="@/components, ~/lib"
                                value={value.importAliases || ""}
                                onChange={(e) => updateField("importAliases", e.target.value)}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </Card >
    );
}
