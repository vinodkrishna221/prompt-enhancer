import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/db/models/user.model";
import Otp from "@/lib/db/models/otp.model";
import { sendOTPEmail, generateOTP } from "@/lib/auth/email";

const SendOtpSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = SendOtpSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const { email } = validation.data;

        await connectDB();

        // Create or update user
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ email });
        }

        // Delete any existing OTPs for this email
        await Otp.deleteMany({ email });

        // Generate new OTP
        const code = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await Otp.create({ email, code, expiresAt });

        // Send email
        await sendOTPEmail({ to: email, otp: code });

        return NextResponse.json({
            message: "OTP sent successfully",
            // In development, you might want to return the OTP for testing
            // ...(process.env.NODE_ENV === "development" && { otp: code }),
        });
    } catch (error) {
        console.error("Send OTP error:", error);
        return NextResponse.json(
            { error: "Failed to send OTP. Please try again." },
            { status: 500 }
        );
    }
}
