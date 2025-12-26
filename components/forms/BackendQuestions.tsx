"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface BackendData {
    type: string;
    httpMethod: string;
    schema: string;
    authRequired: boolean;
    dbOps: string[];
}

export const INITIAL_BACKEND_DATA: BackendData = {
    type: "API Endpoint",
    httpMethod: "GET",
    schema: "",
    authRequired: true,
    dbOps: ["Read"],
};

interface BackendQuestionsProps {
    value: BackendData;
    onChange: (value: BackendData) => void;
}

const TYPES = ["API Endpoint", "Database Query", "Auth Flow", "Middleware", "Cron Job", "Utility"];
const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const DB_OPS = ["Create", "Read", "Update", "Delete", "Transaction", "Aggregation"];

export function BackendQuestions({ value, onChange }: BackendQuestionsProps) {
    const update = (field: keyof BackendData, val: any) => {
        onChange({ ...value, [field]: val });
    };

    const toggleDbOp = (op: string) => {
        const current = value.dbOps;
        const next = current.includes(op)
            ? current.filter((i) => i !== op)
            : [...current, op];
        update("dbOps", next);
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
                {/* Type Selection */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground/80">What are you building?</label>
                    <select
                        className="w-full text-sm bg-background border border-input rounded-md px-3 py-2"
                        value={value.type}
                        onChange={(e) => update("type", e.target.value)}
                    >
                        {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* HTTP Method (Conditional) */}
                {value.type === "API Endpoint" && (
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground/80">HTTP Method</label>
                        <select
                            className="w-full text-sm bg-background border border-input rounded-md px-3 py-2"
                            value={value.httpMethod}
                            onChange={(e) => update("httpMethod", e.target.value)}
                        >
                            {METHODS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                )}
            </div>

            {/* Auth & DB Ops */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-foreground/80">Database Operations</label>
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => update("authRequired", !value.authRequired)}
                    >
                        <div className={cn("w-4 h-4 border rounded flex items-center justify-center transition-colors", value.authRequired ? "bg-primary border-primary" : "border-input")}>
                            {value.authRequired && <Check size={12} className="text-primary-foreground" />}
                        </div>
                        <span className="text-xs text-muted-foreground select-none">Auth Required</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {DB_OPS.map((op) => (
                        <button
                            key={op}
                            onClick={() => toggleDbOp(op)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs border transition-all",
                                value.dbOps.includes(op)
                                    ? "bg-green-500/10 border-green-500 text-green-500"
                                    : "bg-secondary text-muted-foreground border-transparent hover:border-input"
                            )}
                        >
                            {op}
                        </button>
                    ))}
                </div>
            </div>

            {/* Schema / Data */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/80">Data Schema / Types</label>
                <Textarea
                    placeholder="e.g. { id: string, email: string, role: 'admin' | 'user' }..."
                    className="min-h-[120px] font-mono text-sm"
                    value={value.schema}
                    onChange={(e) => update("schema", e.target.value)}
                />
            </div>
        </div>
    );
}
