"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface BugData {
    errorMsg: string;
    expected: string;
    actual: string;
    steps: string;
    environment: string;
    tried: string;
}

export const INITIAL_BUG_DATA: BugData = {
    errorMsg: "",
    expected: "",
    actual: "",
    steps: "",
    environment: "",
    tried: "",
};

interface BugFixingQuestionsProps {
    value: BugData;
    onChange: (value: BugData) => void;
}

export function BugFixingQuestions({ value, onChange }: BugFixingQuestionsProps) {
    const update = (field: keyof BugData, val: any) => {
        onChange({ ...value, [field]: val });
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Error Message */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground/80 text-red-400">Error Message / Log</label>
                <Textarea
                    placeholder="Paste the full error stack trace or message..."
                    className="min-h-[80px] font-mono text-xs bg-red-950/20 border-red-500/20"
                    value={value.errorMsg}
                    onChange={(e) => update("errorMsg", e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Expected */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground/80">Expected Behavior</label>
                    <Textarea
                        placeholder="What should happen?"
                        className="min-h-[80px] text-sm"
                        value={value.expected}
                        onChange={(e) => update("expected", e.target.value)}
                    />
                </div>

                {/* Actual */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground/80">Actual Behavior</label>
                    <Textarea
                        placeholder="What actually happens?"
                        className="min-h-[80px] text-sm"
                        value={value.actual}
                        onChange={(e) => update("actual", e.target.value)}
                    />
                </div>
            </div>

            {/* Steps & Environment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground/80">Steps to Reproduce</label>
                    <Textarea
                        placeholder="1. Go to page... 2. Click button..."
                        className="min-h-[100px] text-sm"
                        value={value.steps}
                        onChange={(e) => update("steps", e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground/80">Environment</label>
                        <Input
                            placeholder="Browser, OS, Node Version..."
                            value={value.environment}
                            onChange={(e) => update("environment", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground/80">Already Tried</label>
                        <Textarea
                            placeholder="Fixes you attempted..."
                            className="min-h-[60px] text-sm"
                            value={value.tried}
                            onChange={(e) => update("tried", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
