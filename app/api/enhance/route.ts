import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db/mongoose";
import PromptHistory, { type PromptCategory } from "@/lib/db/models/prompt-history.model";
import { getSession } from "@/lib/auth/session";
import { enhancePrompt } from "@/lib/ai/openrouter";

const EnhanceSchema = z.object({
    prompt: z.string().min(10, "Prompt must be at least 10 characters").max(10000, "Prompt too long"),
    category: z.enum(["coding", "bug-fixing", "frontend", "backend", "general"]),
});

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validation = EnhanceSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { prompt, category } = validation.data;

        // Enhance prompt with AI
        const result = await enhancePrompt(prompt, category as PromptCategory);

        // Save to history
        await connectDB();
        await PromptHistory.create({
            userId: session.userId,
            originalPrompt: prompt,
            enhancedPrompt: result.enhancedPrompt,
            category,
            metadata: {
                modelUsed: result.modelUsed,
                latency: result.latency,
            },
        });

        return NextResponse.json({
            enhancedPrompt: result.enhancedPrompt,
            metadata: {
                modelUsed: result.modelUsed,
                latency: result.latency,
            },
        });
    } catch (error) {
        console.error("Enhance error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Enhancement failed" },
            { status: 500 }
        );
    }
}
