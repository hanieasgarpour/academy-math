import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcrypt";
import { z } from "zod";
import { db } from "@/lib/db";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "رمز عبور جدید باید حداقل ۶ کاراکتر باشد"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    // Only admins can reset passwords
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message).join("، ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { newPassword } = result.data;

    // Make sure the target user exists
    const targetUser = await db.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // Optional: prevent admin from resetting their own password here
    // (they should use the regular change-password flow which requires current password)
    if (targetUser.id === (token.id as string)) {
      return NextResponse.json(
        { error: "برای تغییر رمز خود از صفحه پروفایل استفاده کنید" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      message: `رمز عبور کاربر «${targetUser.name}» با موفقیت تغییر کرد`,
    });
  } catch (error: unknown) {
    console.error("Error resetting user password:", error);

    const prismaError = error as { code?: string };
    if (prismaError.code === "P2021" || prismaError.code === "P2022") {
      return NextResponse.json(
        {
          error:
            "ساختار دیتابیس محلی قدیمی است. لطفاً دستور `npx prisma db push` را اجرا کنید.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "خطا در تغییر رمز عبور" }, { status: 500 });
  }
}
