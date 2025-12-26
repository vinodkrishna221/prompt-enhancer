"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
    Copy,
    Clock,
    Code,
    Bug,
    Layout,
    Server,
    MessageSquare,
    RefreshCw,
    Star,
    Trash2,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryItem {
    id: string;
    originalPrompt: string;
    enhancedPrompt: string;
    category: string;
    createdAt: string;
    metadata?: {
        modelUsed: string;
        latency: number;
    };
}

const CATEGORY_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
    coding: { icon: Code, color: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "Coding" },
    "bug-fixing": { icon: Bug, color: "bg-red-500/10 text-red-400 border-red-500/20", label: "Bug Fix" },
    frontend: { icon: Layout, color: "bg-purple-500/10 text-purple-400 border-purple-500/20", label: "Frontend" },
    backend: { icon: Server, color: "bg-green-500/10 text-green-400 border-green-500/20", label: "Backend" },
    general: { icon: MessageSquare, color: "bg-gray-500/10 text-gray-400 border-gray-500/20", label: "General" },
};

export default function HistoryPage() {
    const { toast } = useToast();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/history");
            if (!response.ok) {
                throw new Error("Failed to fetch history");
            }
            const data = await response.json();
            setHistory(data.history || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast("Copied to clipboard!", "success");
        } catch {
            toast("Failed to copy", "error");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const truncateText = (text: string, maxLength: number = 150) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-32 bg-card/50 rounded-lg animate-pulse border border-border/50"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <GlassCard className="p-8 text-center border-red-500/20">
                    <p className="text-red-400 mb-4">{error}</p>
                    <Button onClick={fetchHistory} variant="outline" className="gap-2">
                        <RefreshCw size={16} />
                        Retry
                    </Button>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
                >
                    Prompt History
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-lg"
                >
                    View and reuse your past enhanced prompts.
                </motion.p>
            </div>

            {/* History List */}
            {history.length === 0 ? (
                <GlassCard className="p-12 text-center border-white/5 bg-black/40">
                    <Clock size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No History Yet</h3>
                    <p className="text-muted-foreground">
                        Your enhanced prompts will appear here once you start using the Enhancement Studio.
                    </p>
                </GlassCard>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {history.map((item, index) => {
                            const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.general;
                            const Icon = config.icon;
                            const isExpanded = expandedId === item.id;

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <GlassCard className="border-white/5 bg-black/40 overflow-hidden">
                                        {/* Header Row */}
                                        <div className="p-4 flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn("gap-1.5", config.color)}
                                                    >
                                                        <Icon size={12} />
                                                        {config.label}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {formatDate(item.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground/80 font-mono">
                                                    {isExpanded
                                                        ? item.originalPrompt
                                                        : truncateText(item.originalPrompt)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                    onClick={() => copyToClipboard(item.enhancedPrompt)}
                                                    title="Copy enhanced prompt"
                                                >
                                                    <Copy size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                    onClick={() =>
                                                        setExpandedId(isExpanded ? null : item.id)
                                                    }
                                                    title={isExpanded ? "Collapse" : "Expand"}
                                                >
                                                    {isExpanded ? (
                                                        <ChevronUp size={14} />
                                                    ) : (
                                                        <ChevronDown size={14} />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="border-t border-white/5"
                                                >
                                                    <div className="p-4 space-y-3">
                                                        <div>
                                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                                                Enhanced Prompt
                                                            </h4>
                                                            <pre className="text-sm text-foreground/90 font-mono whitespace-pre-wrap bg-black/30 p-3 rounded-md border border-white/5 max-h-[300px] overflow-y-auto">
                                                                {item.enhancedPrompt}
                                                            </pre>
                                                        </div>
                                                        {item.metadata && (
                                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                                <span>
                                                                    Model: {item.metadata.modelUsed}
                                                                </span>
                                                                <span>
                                                                    Latency: {item.metadata.latency}ms
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </GlassCard>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* Background Blur Elements */}
            <div className="fixed top-20 left-10 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
            <div className="fixed bottom-20 right-10 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        </div>
    );
}
