import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtp extends Document {
    email: string;
    code: string;
    expiresAt: Date;
}

const OtpSchema = new Schema<IOtp>({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }, // TTL index - document is deleted when expiresAt is reached
    },
});

// Index for fast lookups
OtpSchema.index({ email: 1, code: 1 });

// Prevent model recompilation in development
const Otp: Model<IOtp> = mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);

export default Otp;
