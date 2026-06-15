import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcrypt";
import { z } from "zod";
import { db } from "@/lib/db";

const createUserSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "STUDENT"]).default("STUDENT"),
});

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const users = await db.user.findMany({
      include: {
        _count: { select: { enrollments: true, orders: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json({ error: "خطا در دریافت کاربران" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await request.json();
    const result = createUserSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message).join("، ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { name, email, password, phone, role } = result.data;

    // Check if email already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "این ایمیل قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        phone: phone || null,
        role,
      },
    });

    return NextResponse.json(
      {
        message: "کاربر با موفقیت ایجاد شد",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "خطا در ایجاد کاربر" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "شناسه کاربر الزامی است" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    if (user.role === "ADMIN") {
      return NextResponse.json({ error: "نمی‌توان مدیر را حذف کرد" }, { status: 403 });
    }

    await db.user.delete({ where: { id } });

    return NextResponse.json({ message: "کاربر حذف شد" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "خطا در حذف کاربر" }, { status: 500 });
  }
}
