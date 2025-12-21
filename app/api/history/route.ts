import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import PromptHistory from "@/lib/db/models/prompt-history.model";
import { getSession } from "@/lib/auth/session";

export async function GET() {
    try {
        // Check authentication
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized. Please log in." },
                { status: 401 }
            );
        }

        await connectDB();

        // Get last 20 prompts for this user
        const history = await PromptHistory.find({ userId: session.userId })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        return NextResponse.json({
            history: history.map((item) => ({
                id: item._id.toString(),
                originalPrompt: item.originalPrompt,
                enhancedPrompt: item.enhancedPrompt,
                category: item.category,
                createdAt: item.createdAt,
                metadata: item.metadata,
            })),
        });
    } catch (error) {
        console.error("History error:", error);
        return NextResponse.json(
            { error: "Failed to fetch history" },
            { status: 500 }
        );
    }
}
