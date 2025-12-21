import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/db/models/user.model";
import Otp from "@/lib/db/models/otp.model";
import { createSession, setSessionCookie } from "@/lib/auth/session";

const VerifyOtpSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = VerifyOtpSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { email, otp } = validation.data;

        await connectDB();

        // Find valid OTP
        const otpRecord = await Otp.findOne({
            email,
            code: otp,
            expiresAt: { $gt: new Date() },
        });

        if (!otpRecord) {
            return NextResponse.json(
                { error: "Invalid or expired OTP" },
                { status: 400 }
            );
        }

        // Invalidate OTP (delete it)
        await Otp.deleteOne({ _id: otpRecord._id });

        // Get or create user and update last login
        const user = await User.findOneAndUpdate(
            { email },
            { lastLogin: new Date() },
            { new: true, upsert: true }
        );

        // Create session token
        const token = await createSession({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // Set HTTP-only cookie
        await setSessionCookie(token);

        return NextResponse.json({
            message: "Login successful",
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Verify OTP error:", error);
        return NextResponse.json(
            { error: "Verification failed. Please try again." },
            { status: 500 }
        );
    }
}
