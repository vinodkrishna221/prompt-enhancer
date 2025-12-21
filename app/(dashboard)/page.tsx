"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Copy, RefreshCw, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

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

    const handleEnhance = async () => {
        if (!prompt.trim()) return;
        setIsEnhancing(true);
        setError(null);

        try {
            const response = await fetch("/api/enhance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
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

                            {/* Input Area */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    Raw Prompt
                                </label>
                                <Textarea
                                    placeholder="Paste your rough prompt or code snippet here..."
                                    className="min-h-[300px] font-mono text-base resize-none bg-background p-4 leading-relaxed"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-xs text-muted-foreground">
                                        {prompt.length} chars
                                    </span>
                                    <Button
                                        size="lg"
                                        onClick={handleEnhance}
                                        disabled={isEnhancing || !prompt.trim()}
                                        className="w-full md:w-auto relative overflow-hidden group"
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
