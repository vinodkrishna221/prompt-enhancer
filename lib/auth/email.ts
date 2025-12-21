import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// Create transporter lazily to avoid errors during build
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
    if (!transporter) {
        if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
            throw new Error("Please define GMAIL_USER and GMAIL_APP_PASSWORD environment variables");
        }

        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_APP_PASSWORD,
            },
        });
    }
    return transporter;
}

interface SendOTPEmailParams {
    to: string;
    otp: string;
}

export async function sendOTPEmail({ to, otp }: SendOTPEmailParams): Promise<void> {
    const mailOptions = {
        from: `"PromptEnhancer" <${GMAIL_USER}>`,
        to,
        subject: "Your Login Code - PromptEnhancer",
        html: `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1c1917; margin: 0;">PromptEnhancer</h1>
        </div>
        
        <div style="background: #1c1917; border-radius: 12px; padding: 40px; text-align: center;">
          <p style="color: #a8a29e; margin: 0 0 20px 0; font-size: 16px;">
            Your verification code is:
          </p>
          
          <div style="background: #292524; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #ea580c;">
              ${otp}
            </span>
          </div>
          
          <p style="color: #57534e; margin: 20px 0 0 0; font-size: 14px;">
            This code expires in 10 minutes.
          </p>
        </div>
        
        <p style="color: #a8a29e; font-size: 12px; text-align: center; margin-top: 30px;">
          If you didn't request this code, you can safely ignore this email.
        </p>
      </div>
    `,
    };

    await getTransporter().sendMail(mailOptions);
}

export function generateOTP(): string {
    // Generate cryptographically secure 6-digit OTP
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const otp = (array[0] % 900000) + 100000; // Ensures 6 digits (100000-999999)
    return otp.toString();
}
