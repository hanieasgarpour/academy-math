import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Generate a 5-digit OTP code
function generateOTP(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "شماره تلفن الزامی است" }, { status: 400 });
    }

    // Find user with this phone number
    const user = await db.user.findFirst({
      where: { phone },
    });

    if (!user) {
      // Don't reveal whether user exists for security
      return NextResponse.json({ 
        message: "اگر شماره تلفن در سیستم ثبت شده باشد، کد تأیید ارسال خواهد شد" 
      });
    }

    // Delete any existing unused codes for this phone
    await db.passwordReset.deleteMany({
      where: { phone, used: false },
    });

    // Generate OTP
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    await db.passwordReset.create({
      data: {
        phone,
        code,
        expiresAt,
      },
    });

    // TODO: Send SMS via Iranian SMS provider (Kavenegar, Melipayamak, etc.)
    // For now, log the code (in production, replace with actual SMS sending)
    console.log(`OTP for ${phone}: ${code}`);

    return NextResponse.json({ 
      message: "اگر شماره تلفن در سیستم ثبت شده باشد، کد تأیید ارسال خواهد شد",
      // In development, return the code for testing
      ...(process.env.NODE_ENV === "development" && { devCode: code }),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "خطا در ارسال کد تأیید" }, { status: 500 });
  }
}
