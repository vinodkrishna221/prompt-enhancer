import type { PromptCategory } from "@/lib/db/models/prompt-history.model";
import { SYSTEM_PROMPTS } from "./system-prompts";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// Default model - can be easily changed
const DEFAULT_MODEL = "openai/gpt-4o-mini";

export interface EnhancePromptResult {
    enhancedPrompt: string;
    modelUsed: string;
    latency: number;
}

export async function enhancePrompt(
    originalPrompt: string,
    category: PromptCategory
): Promise<EnhancePromptResult> {
    if (!OPENROUTER_API_KEY) {
        throw new Error("Please define the OPENROUTER_API_KEY environment variable");
    }

    const systemPrompt = SYSTEM_PROMPTS[category];
    const startTime = Date.now();

    const response = await fetch(OPENROUTER_BASE_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            "X-Title": "PromptEnhancer",
        },
        body: JSON.stringify({
            model: DEFAULT_MODEL,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Original Prompt:\n"${originalPrompt}"\n\nEnhance this prompt.` },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("OpenRouter API error:", error);
        throw new Error("Failed to enhance prompt. Please try again.");
    }

    const data = await response.json();
    const latency = Date.now() - startTime;

    const enhancedPrompt = data.choices?.[0]?.message?.content?.trim();

    if (!enhancedPrompt) {
        throw new Error("No response from AI model");
    }

    return {
        enhancedPrompt,
        modelUsed: data.model || DEFAULT_MODEL,
        latency,
    };
}
