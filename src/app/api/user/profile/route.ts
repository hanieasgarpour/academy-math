import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: token.id as string },
      select: { id: true, email: true, name: true, phone: true, role: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "خطا در دریافت پروفایل" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, email, currentPassword, newPassword } = body;

    const userId = token.id as string;
    const updateData: { name?: string; phone?: string | null; email?: string; password?: string } = {};

    // Update basic info
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone || null;

    // Update email if provided and different
    if (email) {
      const currentUser = await db.user.findUnique({ where: { id: userId } });
      if (currentUser && currentUser.email !== email) {
        // Check if new email is already taken
        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) {
          return NextResponse.json({ error: "این ایمیل قبلاً ثبت شده است" }, { status: 409 });
        }
        updateData.email = email;
      }
    }

    // Update password if both current and new password are provided
    if (currentPassword && newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "رمز عبور جدید باید حداقل ۶ کاراکتر باشد" }, { status: 400 });
      }

      const currentUser = await db.user.findUnique({ where: { id: userId } });
      if (!currentUser) {
        return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "رمز عبور فعلی نادرست است" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    } else if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
      return NextResponse.json(
        { error: "برای تغییر رمز عبور، رمز فعلی و رمز جدید هر دو الزامی است" },
        { status: 400 }
      );
    }

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, email: true, name: true, phone: true, role: true },
    });

    return NextResponse.json({ ...user, message: "پروفایل بروزرسانی شد" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "خطا در بروزرسانی پروفایل" }, { status: 500 });
  }
}
