"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectContextForm, ProjectContext, DEFAULT_CONTEXT } from "@/components/forms/ProjectContextForm";
import { FrontendQuestions, FrontendData, INITIAL_FRONTEND_DATA } from "@/components/forms/FrontendQuestions";
import { BackendQuestions, BackendData, INITIAL_BACKEND_DATA } from "@/components/forms/BackendQuestions";
import { BugFixingQuestions, BugData, INITIAL_BUG_DATA } from "@/components/forms/BugFixingQuestions";
import { PromptTemplates } from "@/components/dashboard/PromptTemplates";
import { DiffView } from "@/components/dashboard/DiffView";
import { Typewriter } from "@/components/ui/typewriter";
import { QualityMetrics } from "@/components/dashboard/QualityMetrics";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip } from "@/components/ui/tooltip";
import { Check, Copy, RefreshCw, Sparkles, AlertCircle, X, Maximize2, Minimize2, Split } from "lucide-react";

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
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();
    const [history, setHistory] = useState<(EnhanceResult & { timestamp: number, category: string })[]>([]);

    // Phase 3 States
    const [viewMode, setViewMode] = useState<"normal" | "diff">("normal");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

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
        // Also switch category if applicable
        if (["Coding", "BugFixing", "Frontend", "Backend", "General"].includes(cat)) {
            setCategory(cat as Category);
        }
        toast("Template loaded!", "info");
    };

    const handleEnhance = async () => {
        const content = getPromptContent();

        if (!content.trim()) return;
        setIsEnhancing(true);
        setIsTypingComplete(false); // Reset typing
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
            setIsTypingComplete(false); // Reset typing
            setHistory(prev => [{ ...data, timestamp: Date.now(), category }, ...prev].slice(0, 10)); // Keep last 10
        } catch (err) {
            // Mock Fallback for Development/Localhost without DB
            if (process.env.NODE_ENV !== "production") {
                const mockResult = {
                    enhancedPrompt: `[MOCK RESULT - DB UNREACHABLE]\n\nBased on your request "${content.substring(0, 20)}...", here is an enhanced version:\n\n1. Use clearer variable names.\n2. Add error handling.\n3. Verify inputs.\n\n(This is a simulation because the local database is not connected.)`,
                    metadata: { modelUsed: "Mock-Gpt", latency: 123 },
                };
                setResult(mockResult);
                setIsTypingComplete(false);
                setHistory(prev => [{ ...mockResult, timestamp: Date.now(), category }, ...prev].slice(0, 10));
                toast("Using mock result (DB disconnected)", "info");
                return;
            }

            setError(err instanceof Error ? err.message : "Something went wrong");
            setResult(null);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleCopy = () => {
        if (result?.enhancedPrompt) {
            navigator.clipboard.writeText(result.enhancedPrompt);
            setIsCopied(true);
            toast("Prompt copied to clipboard!", "success");
            setTimeout(() => setIsCopied(false), 2000);
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

                                <PromptTemplates onSelect={handleTemplateSelect} className="pb-2" />

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
                                        <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1">
                                            <div className="text-xs text-muted-foreground bg-background/80 px-2 rounded font-mono">
                                                {prompt.length} chars | ~{Math.ceil(prompt.length / 4)} tokens
                                            </div>
                                            {/* Progress Bar */}
                                            <div className="w-24 h-1 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-300",
                                                        prompt.length < 2000 ? "bg-green-500" :
                                                            prompt.length < 4000 ? "bg-yellow-500" : "bg-red-500"
                                                    )}
                                                    style={{ width: `${Math.min((prompt.length / 4000) * 100, 100)}%` }}
                                                />
                                            </div>
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
                            <div className={cn("flex flex-col h-full animate-in fade-in zoom-in-95 duration-300", isExpanded ? "fixed inset-4 z-50 bg-background border shadow-2xl rounded-xl p-4" : "")} >
                                <div className="flex border-b border-border/50 bg-[#252526] px-4 py-2 shrink-0 items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
                                            <Sparkles size={14} className="text-purple-400" />
                                            Enhanced Output
                                        </span>
                                        {result.metadata && (
                                            <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
                                                {result.metadata.modelUsed}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Tooltip content="Toggle Visual Diff">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setViewMode(prev => prev === "normal" ? "diff" : "normal")}
                                                className={cn("h-7 w-7", viewMode === "diff" ? "bg-primary/20 text-primary" : "text-muted-foreground")}
                                            >
                                                <Split size={14} />
                                            </Button>
                                        </Tooltip>
                                        <Button variant="ghost" size="icon" title="Regenerate" onClick={handleEnhance} disabled={isEnhancing} className="h-7 w-7 text-muted-foreground">
                                            <RefreshCw size={14} className={isEnhancing ? "animate-spin" : ""} />
                                        </Button>
                                        <Button variant="ghost" size="icon" title="Copy" onClick={handleCopy} className="h-7 w-7 text-muted-foreground">
                                            {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                        </Button>
                                        <Button variant="ghost" size="icon" title={isExpanded ? "Collapse" : "Expand"} onClick={() => setIsExpanded(!isExpanded)} className="h-7 w-7 text-muted-foreground">
                                            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-hidden relative group">
                                    {viewMode === "diff" ? (
                                        <div className="h-full overflow-auto">
                                            <DiffView
                                                original={getPromptContent()}
                                                enhanced={result.enhancedPrompt}
                                                className="h-full min-h-[300px]"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-full overflow-auto bg-[#1e1e1e] p-6 font-mono text-sm leading-7 text-foreground/90 whitespace-pre-wrap">
                                            {isTypingComplete ? (
                                                result.enhancedPrompt
                                            ) : (
                                                <Typewriter
                                                    text={result.enhancedPrompt}
                                                    speed={10}
                                                    onComplete={() => setIsTypingComplete(true)}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Quality Indicators (Footer) */}
                                {isTypingComplete && !isExpanded && viewMode === "normal" && (
                                    <div className="px-4 pb-4 bg-[#1e1e1e]">
                                        <QualityMetrics promptLength={result.enhancedPrompt.length} />
                                    </div>
                                )}
                            </div>
                        ) : null}

                    </Card>

                    {/* Session History */}
                    {history.length > 0 && (
                        <div className="space-y-2 pt-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                Session History
                            </h3>
                            <div className="grid gap-2">
                                {history.map((item, i) => (
                                    <div
                                        key={item.timestamp}
                                        onClick={() => setResult(item)}
                                        className="p-3 rounded-lg border bg-card/50 hover:bg-card hover:border-primary/50 cursor-pointer transition-all group flex items-center justify-between"
                                    >
                                        <div className="flex flex-col gap-1 overflow-hidden">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[10px] h-4 px-1">{item.metadata?.modelUsed || "AI"}</Badge>
                                                <Badge variant="secondary" className="text-[10px] h-4 px-1">{item.category}</Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(item.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div className="text-xs text-foreground/80 truncate font-mono">
                                                {item.enhancedPrompt.substring(0, 60)}...
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                            <Sparkles size={12} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
