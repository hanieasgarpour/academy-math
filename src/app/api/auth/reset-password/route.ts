import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { phone, code, newPassword } = await request.json();

    if (!phone || !code || !newPassword) {
      return NextResponse.json({ error: "تمام فیلدها الزامی است" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "رمز عبور باید حداقل ۶ کاراکتر باشد" }, { status: 400 });
    }

    // Find the reset code
    const resetRecord = await db.passwordReset.findFirst({
      where: {
        phone,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!resetRecord) {
      return NextResponse.json({ error: "کد تأیید نامعتبر یا منقضی شده است" }, { status: 400 });
    }

    // Mark code as used
    await db.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    // Update user password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.user.updateMany({
      where: { phone },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "رمز عبور با موفقیت تغییر کرد" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "خطا در تغییر رمز عبور" }, { status: 500 });
  }
}
