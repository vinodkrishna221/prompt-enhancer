"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, Code, Bug, FileJson, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Template {
    id: string;
    label: string;
    icon: React.ReactNode;
    content: string;
    category: "Coding" | "BugFixing" | "Frontend" | "Backend" | "General";
}

const TEMPLATES: Template[] = [
    {
        id: "react-comp",
        label: "New React Component",
        icon: <Layout size={14} />,
        category: "Frontend",
        content: "Create a modern, responsive React component for a [COMPONENT NAME]. It should accept props for [PROPS] and handle [INTERACTIONS]. Use Tailwind CSS for styling and ensure accessibility.",
    },
    {
        id: "api-route",
        label: "Next.js API Route",
        icon: <FileJson size={14} />,
        category: "Backend",
        content: "Build a robust Next.js API route handler for [RESOURCE]. It should support methods [GET/POST], handle validation using Zod, and include error handling.",
    },
    {
        id: "debug-error",
        label: "Debug Error",
        icon: <Bug size={14} />,
        category: "BugFixing",
        content: "I am encountering the following error: [ERROR MESSAGE]. \n\nContext: \n- Framework: Next.js\n- Steps to reproduce: [STEPS]\n\nPlease analyze the potential causes and suggest a fix.",
    },
    {
        id: "unit-test",
        label: "Write Unit Tests",
        icon: <Code size={14} />,
        category: "Coding",
        content: "Write comprehensive unit tests for the following code using Jest and React Testing Library. Cover success paths, edge cases, and error states.\n\nCode:\n[PASTE CODE HERE]",
    },
    {
        id: "refactor",
        label: "Refactor Code",
        icon: <Zap size={14} />,
        category: "Coding",
        content: "Refactor the following code to improve readability, performance, and maintainability. Apply DRY principles and modern ES6+ syntax.\n\nCode:\n[PASTE CODE HERE]",
    }
];

interface PromptTemplatesProps {
    onSelect: (content: string, category: string) => void;
    className?: string;
}

export function PromptTemplates({ onSelect, className }: PromptTemplatesProps) {
    return (
        <div className={cn("flex flex-wrap gap-2 items-center", className)}>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">
                Quick Start:
            </span>
            {TEMPLATES.map((t) => (
                <button
                    key={t.id}
                    onClick={() => onSelect(t.content, t.category)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary border border-transparent hover:border-primary/20 text-xs text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                    {t.icon}
                    {t.label}
                </button>
            ))}
        </div>
    );
}
