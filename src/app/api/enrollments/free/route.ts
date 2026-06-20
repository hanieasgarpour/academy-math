import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: "شناسه دوره الزامی است" }, { status: 400 });
    }

    // Check if course exists and is free
    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "دوره یافت نشد" }, { status: 404 });
    }

    if (course.price !== 0) {
      return NextResponse.json({ error: "این دوره رایگان نیست" }, { status: 400 });
    }

    // Create or skip enrollment
    const enrollment = await db.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: token.id as string,
          courseId,
        },
      },
      create: {
        userId: token.id as string,
        courseId,
      },
      update: {},
    });

    return NextResponse.json({ enrollment, message: "ثبت‌نام با موفقیت انجام شد" });
  } catch (error) {
    console.error("Error creating free enrollment:", error);
    return NextResponse.json({ error: "خطا در ثبت‌نام" }, { status: 500 });
  }
}
