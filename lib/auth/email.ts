import nodemailer from "nodemailer";

// SMTP Configuration from Vercel environment
const EMAIL_SERVER_HOST = process.env.EMAIL_SERVER_HOST || "smtp.gmail.com";
const EMAIL_SERVER_PORT = parseInt(process.env.EMAIL_SERVER_PORT || "587", 10);
const EMAIL_SERVER_USER = process.env.EMAIL_SERVER_USER;
const EMAIL_SERVER_PASSWORD = process.env.EMAIL_SERVER_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_SERVER_USER;

// Create transporter lazily to avoid errors during build
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    if (!EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD) {
      throw new Error("Please define EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD environment variables");
    }

    transporter = nodemailer.createTransport({
      host: EMAIL_SERVER_HOST,
      port: EMAIL_SERVER_PORT,
      secure: EMAIL_SERVER_PORT === 465, // true for 465, false for other ports
      auth: {
        user: EMAIL_SERVER_USER,
        pass: EMAIL_SERVER_PASSWORD,
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
    from: `"PromptEnhancer" <${EMAIL_FROM}>`,
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
