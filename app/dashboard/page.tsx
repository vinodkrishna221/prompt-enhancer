"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { ProjectContextForm, ProjectContext, DEFAULT_CONTEXT } from "@/components/forms/ProjectContextForm";
import { FrontendQuestions, FrontendData, INITIAL_FRONTEND_DATA } from "@/components/forms/FrontendQuestions";
import { BackendQuestions, BackendData, INITIAL_BACKEND_DATA } from "@/components/forms/BackendQuestions";
import { BugFixingQuestions, BugData, INITIAL_BUG_DATA } from "@/components/forms/BugFixingQuestions";
import { PromptTemplates } from "@/components/dashboard/PromptTemplates";
import { useToast } from "@/components/ui/use-toast";
import { GlassCard } from "@/components/ui/glass-card";
import { CategorySelector, Category } from "@/components/dashboard/CategorySelector";
import { OutputPanel } from "@/components/dashboard/OutputPanel";

// Map frontend category names to API category values
const CATEGORY_API_MAP: Record<Category, string> = {
    Coding: "coding",
    BugFixing: "bug-fixing",
    Frontend: "frontend",
    Backend: "backend",
    General: "general",
};

interface EnhanceResult {
    enhancedPrompt: string;
    metadata?: {
        modelUsed: string;
        latency: number;
    };
}

export default function DashboardPage() {
    const [prompt, setPrompt] = useState("");
    const [category, setCategory] = useState<Category>("Coding");
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [result, setResult] = useState<EnhanceResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [context, setContext] = useState<ProjectContext>(DEFAULT_CONTEXT);

    // History could be moved to a separate sidebar component in the future
    const [history, setHistory] = useState<(EnhanceResult & { timestamp: number, category: string })[]>([]);

    // Category Form States
    const [frontendData, setFrontendData] = useState<FrontendData>(INITIAL_FRONTEND_DATA);
    const [backendData, setBackendData] = useState<BackendData>(INITIAL_BACKEND_DATA);
    const [bugData, setBugData] = useState<BugData>(INITIAL_BUG_DATA);

    // Helper to generate prompt from form data
    const getPromptContent = () => {
        if (category === "Frontend") {
            return `
[FRONTEND TASK]
Type: ${frontendData.type}
Name: ${frontendData.name}
Interactions: ${frontendData.interactions.join(', ')}
Breakpoints: ${frontendData.breakpoints.join(', ')}
Accessibility: ${frontendData.accessibility}

Design Ref/Desc: 
${frontendData.designRef}
[/FRONTEND TASK]`.trim();
        }

        if (category === "Backend") {
            return `
[BACKEND TASK]
Type: ${backendData.type}
Method: ${backendData.httpMethod}
Auth: ${backendData.authRequired ? 'Yes' : 'No'}
DB Ops: ${backendData.dbOps.join(', ')}

Schema:
${backendData.schema}
[/BACKEND TASK]`.trim();
        }

        if (category === "BugFixing") {
            return `
[BUG REPORT]
Environment: ${bugData.environment}

Error:
${bugData.errorMsg}

Expected:
${bugData.expected}

Actual:
${bugData.actual}

Steps:
${bugData.steps}

Tried:
${bugData.tried}
[/BUG REPORT]`.trim();
        }

        return prompt; // Return raw prompt for Coding/General
    };

    const handleTemplateSelect = (content: string, cat: string) => {
        setPrompt(content);
        if (["Coding", "BugFixing", "Frontend", "Backend", "General"].includes(cat)) {
            setCategory(cat as Category);
        }
    };

    const handleEnhance = async () => {
        const content = getPromptContent();

        if (!content.trim()) return;
        setIsEnhancing(true);
        setError(null);

        // Format context into a string
        const contextString = `
[PROJECT CONTEXT]
Type: ${context.projectType === 'new' ? 'New Project' : 'Existing Codebase'}
Frameworks: ${context.frameworks.join(', ')}
Styling: ${context.styling}
UI Library: ${context.uiLibrary}
State Mgmt: ${context.stateManagement}
TypeScript: ${context.isTypescript ? 'Yes' : 'No'}
[/PROJECT CONTEXT]

${content}
`.trim();

        try {
            const response = await fetch("/api/enhance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: contextString,
                    category: CATEGORY_API_MAP[category],
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Enhancement failed");
            }

            setResult(data);
            setHistory(prev => [{ ...data, timestamp: Date.now(), category }, ...prev].slice(0, 10));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setResult(null);
        } finally {
            setIsEnhancing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Header Section */}
            <div className="space-y-2 mb-8 relative z-10">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold tracking-tight text-foreground bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
                >
                    Enhancement Studio
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-lg"
                >
                    Select a domain and refine your prompt for maximum LLM performance.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                {/* Left Column: Input Panel */}
                <div className="lg:col-span-5 space-y-6">
                    <GlassCard className="p-6 border-white/5 bg-black/40 backdrop-blur-xl">
                        <div className="space-y-6">
                            {/* Category Selector */}
                            <CategorySelector selected={category} onSelect={setCategory} />

                            <div className="w-full h-px bg-white/5" />

                            {/* Project Context Form */}
                            <div className="space-y-3">
                                <ProjectContextForm value={context} onChange={setContext} />
                            </div>

                            <div className="w-full h-px bg-white/5" />

                            {/* Dynamic Forms / Input Area */}
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex justify-between">
                                    {category === "Coding" || category === "General" ? "Raw Prompt" : "Task Details"}
                                </label>

                                <PromptTemplates onSelect={handleTemplateSelect} className="pb-2" />

                                <div className="min-h-[300px]">
                                    {category === "Frontend" ? (
                                        <FrontendQuestions value={frontendData} onChange={setFrontendData} />
                                    ) : category === "Backend" ? (
                                        <BackendQuestions value={backendData} onChange={setBackendData} />
                                    ) : category === "BugFixing" ? (
                                        <BugFixingQuestions value={bugData} onChange={setBugData} />
                                    ) : (
                                        <div className="relative group">
                                            <Textarea
                                                placeholder="Paste your rough prompt or code snippet here..."
                                                className="min-h-[300px] font-mono text-base resize-none bg-black/20 border-white/10 focus:border-primary/50 focus:ring-0 p-4 leading-relaxed transition-all"
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                            />
                                            <div className="absolute bottom-2 right-2 flex items-center gap-2 pointer-events-none opacity-50 text-xs text-muted-foreground">
                                                <span>{prompt.length} chars</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <Button
                                        size="lg"
                                        onClick={handleEnhance}
                                        disabled={isEnhancing || !getPromptContent().trim()}
                                        className="w-full h-12 relative overflow-hidden group bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                                        <span className="relative flex items-center justify-center gap-2 font-semibold tracking-wide">
                                            {isEnhancing ? "Enhancing..." : (
                                                <>
                                                    Enhounce Prompt <ArrowRight size={16} />
                                                </>
                                            )}
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Right Column: Output Panel */}
                <div className="lg:col-span-7 h-full">
                    <OutputPanel
                        isEnhancing={isEnhancing}
                        result={result}
                        error={error}
                        originalPrompt={getPromptContent()}
                        onRegenerate={handleEnhance}
                    />
                </div>
            </div>

            {/* Background Blur Elements */}
            <div className="fixed top-20 left-10 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
            <div className="fixed bottom-20 right-10 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        </div>
    );
}

