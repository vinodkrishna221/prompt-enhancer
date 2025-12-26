"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, RefreshCw, Sparkles, Maximize2, Minimize2, Split, Terminal, Code2, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Typewriter } from "@/components/ui/typewriter";
import { DiffView } from "@/components/dashboard/DiffView";
import { QualityMetrics } from "@/components/dashboard/QualityMetrics";
import { EnhancementProgress } from "@/components/dashboard/EnhancementProgress";
import { GlassCard } from "@/components/ui/glass-card";

interface EnhanceResult {
    enhancedPrompt: string;
    metadata?: {
        modelUsed: string;
        latency: number;
    };
}

interface OutputPanelProps {
    isEnhancing: boolean;
    result: EnhanceResult | null;
    error: string | null;
    originalPrompt: string;
    onRegenerate: () => void;
}

export function OutputPanel({ isEnhancing, result, error, originalPrompt, onRegenerate }: OutputPanelProps) {
    const [viewMode, setViewMode] = useState<"normal" | "diff">("normal");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();

    const handleCopy = () => {
        if (result?.enhancedPrompt) {
            navigator.clipboard.writeText(result.enhancedPrompt);
            setIsCopied(true);
            toast("Prompt copied to clipboard!", "success");
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    if (error) {
        return (
            <GlassCard className="h-full border-destructive/20 bg-destructive/5 flex items-center justify-center p-6">
                <div className="text-center space-y-2">
                    <div className="bg-destructive/10 p-3 rounded-full inline-block">
                        <Terminal className="text-destructive" size={32} />
                    </div>
                    <h3 className="font-semibold text-destructive">Enhancement Failed</h3>
                    <p className="text-sm text-destructive/80 max-w-xs">{error}</p>
                    <Button variant="outline" onClick={onRegenerate} className="mt-4 border-destructive/30 hover:bg-destructive/10">
                        Try Again
                    </Button>
                </div>
            </GlassCard>
        );
    }

    return (
        <GlassCard className={cn(
            "h-full transition-all duration-500 flex flex-col relative overflow-hidden",
            isExpanded ? "fixed inset-4 z-50 shadow-2xl" : "min-h-[500px]"
        )}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            {isEnhancing ? (
                <EnhancementProgress isEnhancing={true} />
            ) : !result ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                    <div className="bg-secondary/30 p-6 rounded-full border border-white/5 mb-2">
                        <Sparkles size={32} strokeWidth={1} className="opacity-50 text-primary" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="font-medium text-foreground">Ready to enhance</p>
                        <p className="text-xs max-w-[200px]">Fill in the details and let AI optimize your prompt.</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
                    {/* Toolbar */}
                    <div className="flex border-b border-white/5 bg-black/20 px-4 py-3 shrink-0 items-center justify-between backdrop-blur-md z-10">
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1.5 py-1">
                                <Sparkles size={10} />
                                Enhanced Output
                            </Badge>
                            {result.metadata && (
                                <span className="text-[10px] text-muted-foreground font-mono">
                                    {result.metadata.modelUsed} • {result.metadata.latency}ms
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1">
                            <Tooltip content="Toggle Visual Diff">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setViewMode(prev => prev === "normal" ? "diff" : "normal")}
                                    className={cn("h-8 w-8 rounded-lg", viewMode === "diff" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground")}
                                >
                                    <Split size={16} />
                                </Button>
                            </Tooltip>

                            <div className="w-px h-4 bg-white/10 mx-1" />

                            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                                {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </Button>

                            <Button variant="ghost" size="icon" onClick={onRegenerate} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                                <RefreshCw size={16} />
                            </Button>

                            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            </Button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden relative group bg-black/10">
                        {viewMode === "diff" ? (
                            <div className="h-full overflow-auto custom-scrollbar">
                                <DiffView
                                    original={originalPrompt}
                                    enhanced={result.enhancedPrompt}
                                    className="h-full min-h-[300px]"
                                />
                            </div>
                        ) : (
                            <div className="h-full overflow-auto p-6 font-mono text-sm leading-7 text-foreground/90 whitespace-pre-wrap custom-scrollbar selection:bg-primary/30">
                                {isTypingComplete ? (
                                    result.enhancedPrompt
                                ) : (
                                    <Typewriter
                                        text={result.enhancedPrompt}
                                        speed={5}
                                        onComplete={() => setIsTypingComplete(true)}
                                    />
                                )}
                            </div>
                        )}

                        {/* Floating Action Button for quick Copy when scrolled */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" className="shadow-xl" onClick={handleCopy}>
                                <Copy size={14} className="mr-2" /> Copy Result
                            </Button>
                        </div>
                    </div>

                    {/* Quality Indicators Footer */}
                    {isTypingComplete && !isExpanded && viewMode === "normal" && (
                        <QualityMetrics promptLength={result.enhancedPrompt.length} />
                    )}
                </div>
            )}
        </GlassCard>
    );
}
