import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { db } from "@/lib/db";

const registerSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message).join("، ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { email, name, password, phone } = result.data;

    const existingUser = await db.user.findUnique({
      where: { email },
    });

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
        role: "STUDENT",
      },
    });

    return NextResponse.json(
      {
        message: "ثبت‌نام با موفقیت انجام شد",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "خطایی در ثبت‌نام رخ داده است" },
      { status: 500 }
    );
  }
}
