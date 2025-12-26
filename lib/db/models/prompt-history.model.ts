import mongoose, { Schema, Document, Model } from "mongoose";

export type PromptCategory = "coding" | "bug-fixing" | "frontend" | "backend" | "general";

export interface IProjectContext {
    projectType?: "new" | "existing";
    frameworks?: string[];
    styling?: string;
    uiLibrary?: string;
    stateManagement?: string;
    typescript?: boolean;
}

export interface IPromptHistory extends Document {
    userId: mongoose.Types.ObjectId;
    originalPrompt: string;
    enhancedPrompt: string;
    category: PromptCategory;
    projectContext?: IProjectContext;
    isFavorite: boolean;
    tags: string[];
    createdAt: Date;
    metadata: {
        modelUsed: string;
        latency: number; // in milliseconds
        tokenCount?: number;
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
        // NEW: Project context for AI IDE optimization
        projectContext: {
            projectType: {
                type: String,
                enum: ["new", "existing"],
            },
            frameworks: [{ type: String }],
            styling: { type: String },
            uiLibrary: { type: String },
            stateManagement: { type: String },
            typescript: { type: Boolean },
        },
        // NEW: Favorite flag for quick access
        isFavorite: {
            type: Boolean,
            default: false,
        },
        // NEW: Auto-generated tags for categorization
        tags: [{
            type: String,
        }],
        metadata: {
            modelUsed: { type: String, default: "gpt-4o-mini" },
            latency: { type: Number, default: 0 },
            // NEW: Token count for usage tracking
            tokenCount: { type: Number },
        },
    },
    {
        timestamps: true,
    }
);

// Index for fetching user history, sorted by creation date
PromptHistorySchema.index({ userId: 1, createdAt: -1 });

// NEW: Index for filtering by category
PromptHistorySchema.index({ userId: 1, category: 1 });

// NEW: Index for favorites quick access
PromptHistorySchema.index({ userId: 1, isFavorite: 1 });

// Prevent model recompilation in development
const PromptHistory: Model<IPromptHistory> =
    mongoose.models.PromptHistory || mongoose.model<IPromptHistory>("PromptHistory", PromptHistorySchema);

export default PromptHistory;
