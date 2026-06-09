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

    // Check if course exists
    const course = await db.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "دوره یافت نشد" }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: token.id as string,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: "شما قبلاً در این دوره ثبت‌نام کرده‌اید" }, { status: 409 });
    }

    // Check if there's a pending order
    const pendingOrder = await db.order.findFirst({
      where: {
        userId: token.id as string,
        courseId,
        status: "PENDING",
      },
    });

    if (pendingOrder) {
      return NextResponse.json({ order: pendingOrder, message: "سفارش قبلی در انتظار پرداخت" });
    }

    // Create order
    const order = await db.order.create({
      data: {
        userId: token.id as string,
        courseId,
        amount: course.price,
        status: "PENDING",
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "خطا در ایجاد سفارش" }, { status: 500 });
  }
}
