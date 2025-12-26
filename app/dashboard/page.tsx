"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Copy, RefreshCw, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectContextForm, ProjectContext, DEFAULT_CONTEXT } from "@/components/forms/ProjectContextForm";
import { FrontendQuestions, FrontendData, INITIAL_FRONTEND_DATA } from "@/components/forms/FrontendQuestions";
import { BackendQuestions, BackendData, INITIAL_BACKEND_DATA } from "@/components/forms/BackendQuestions";
import { BugFixingQuestions, BugData, INITIAL_BUG_DATA } from "@/components/forms/BugFixingQuestions";

type Category = "Coding" | "BugFixing" | "Frontend" | "Backend" | "General";

// Map frontend category names to API category values
const CATEGORY_API_MAP: Record<Category, string> = {
    Coding: "coding",
    BugFixing: "bug-fixing",
    Frontend: "frontend",
    Backend: "backend",
    General: "general",
};

const CATEGORIES: { id: Category; label: string; color: string }[] = [
    { id: "Coding", label: "Core Coding", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    { id: "BugFixing", label: "Bug Fixing", color: "bg-red-500/10 text-red-500 border-red-500/20" },
    { id: "Frontend", label: "Frontend", color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
    { id: "Backend", label: "Backend", color: "bg-green-500/10 text-green-500 border-green-500/20" },
    { id: "General", label: "General", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
];

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
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setResult(null);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleCopy = () => {
        if (result?.enhancedPrompt) {
            navigator.clipboard.writeText(result.enhancedPrompt);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Enhancement Stage
                </h1>
                <p className="text-muted-foreground">
                    Select a domain and refine your prompt for maximum LLM performance.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Column */}
                <div className="space-y-6">
                    <Card className="border-2 shadow-none bg-card/50">
                        <CardContent className="p-6 space-y-6">
                            {/* Category Selector */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    Category Mode
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setCategory(cat.id)}
                                            className={cn(
                                                "px-4 py-2 rounded-md text-sm font-medium border-2 transition-all",
                                                category === cat.id
                                                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                                                    : "border-transparent bg-secondary text-muted-foreground hover:bg-secondary/80"
                                            )}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Project Context Form */}
                            <div className="space-y-3">
                                <ProjectContextForm value={context} onChange={setContext} />
                            </div>

                            {/* Dynamic Forms / Input Area */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex justify-between">
                                    {category === "Coding" || category === "General" ? "Raw Prompt" : "Task Details"}
                                </label>

                                {category === "Frontend" ? (
                                    <FrontendQuestions value={frontendData} onChange={setFrontendData} />
                                ) : category === "Backend" ? (
                                    <BackendQuestions value={backendData} onChange={setBackendData} />
                                ) : category === "BugFixing" ? (
                                    <BugFixingQuestions value={bugData} onChange={setBugData} />
                                ) : (
                                    <div className="relative">
                                        <Textarea
                                            placeholder="Paste your rough prompt or code snippet here..."
                                            className="min-h-[300px] font-mono text-base resize-none bg-background p-4 leading-relaxed"
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                        />
                                        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 rounded">
                                            {prompt.length} chars
                                        </div>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <Button
                                        size="lg"
                                        onClick={handleEnhance}
                                        disabled={isEnhancing || !getPromptContent().trim()}
                                        className="w-full relative overflow-hidden group"
                                    >
                                        {isEnhancing && (
                                            <motion.div
                                                className="absolute inset-0 bg-white/20"
                                                initial={{ x: "-100%" }}
                                                animate={{ x: "100%" }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            />
                                        )}
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        {isEnhancing ? "Enhancing..." : "Enhance Prompt"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Output Column */}
                <div className="space-y-6 relative">
                    {/* Connecting Line (Desktop only) */}
                    <div className="hidden lg:block absolute top-1/2 -left-4 -translate-x-full w-8 h-0.5 border-t-2 border-dashed border-border" />

                    <Card className="h-full border-2 border-dashed border-border bg-card/30 shadow-none relative overflow-hidden">
                        {error && (
                            <div className="p-4 m-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                {error}
                            </div>
                        )}
                        {!result && !error ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 min-h-[400px]">
                                <Terminal size={48} strokeWidth={1} className="opacity-50" />
                                <p>Ready to process output...</p>
                            </div>
                        ) : result ? (
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {result.metadata?.modelUsed || "AI Enhanced"}
                                        </Badge>
                                        <Badge variant="secondary" className="font-mono text-xs">
                                            {category} Mode
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" title="Regenerate" onClick={handleEnhance} disabled={isEnhancing}>
                                            <RefreshCw size={16} className={isEnhancing ? "animate-spin" : ""} />
                                        </Button>
                                        <Button variant="ghost" size="icon" title="Copy" onClick={handleCopy}>
                                            <Copy size={16} />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 font-mono text-sm leading-7 overflow-auto whitespace-pre-wrap text-foreground/90 bg-[#1e1e1e]">
                                    {result.enhancedPrompt}
                                </div>
                            </div>
                        ) : null}
                    </Card>
                </div>
            </div>
        </div>
    );
}
