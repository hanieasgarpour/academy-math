import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ enrolled: false }, { status: 401 });
    }

    const courseId = request.nextUrl.searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json(
        { error: "شناسه دوره الزامی است" },
        { status: 400 }
      );
    }

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: token.id as string,
          courseId,
        },
      },
    });

    return NextResponse.json({ enrolled: !!enrollment });
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return NextResponse.json(
      { error: "خطا در بررسی ثبت‌نام" },
      { status: 500 }
    );
  }
}
