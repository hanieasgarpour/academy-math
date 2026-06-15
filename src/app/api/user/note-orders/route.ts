import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
    }

    const noteOrders = await db.noteOrder.findMany({
      where: { userId: token.id as string },
      include: {
        note: {
          select: {
            id: true,
            title: true,
            gradeLevel: true,
            pageCount: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(noteOrders);
  } catch (error) {
    console.error("Error fetching note orders:", error);
    return NextResponse.json({ error: "خطا در دریافت سفارش‌های جزوه" }, { status: 500 });
  }
}
