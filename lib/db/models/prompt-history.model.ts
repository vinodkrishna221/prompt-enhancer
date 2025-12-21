import mongoose, { Schema, Document, Model } from "mongoose";

export type PromptCategory = "coding" | "bug-fixing" | "frontend" | "backend" | "general";

export interface IPromptHistory extends Document {
    userId: mongoose.Types.ObjectId;
    originalPrompt: string;
    enhancedPrompt: string;
    category: PromptCategory;
    createdAt: Date;
    metadata: {
        modelUsed: string;
        latency: number; // in milliseconds
    };
}

const PromptHistorySchema = new Schema<IPromptHistory>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        originalPrompt: {
            type: String,
            required: true,
        },
        enhancedPrompt: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["coding", "bug-fixing", "frontend", "backend", "general"],
            required: true,
        },
        metadata: {
            modelUsed: { type: String, default: "gpt-4" },
            latency: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
    }
);

// Index for fetching user history, sorted by creation date
PromptHistorySchema.index({ userId: 1, createdAt: -1 });

// Prevent model recompilation in development
const PromptHistory: Model<IPromptHistory> =
    mongoose.models.PromptHistory || mongoose.model<IPromptHistory>("PromptHistory", PromptHistorySchema);

export default PromptHistory;
