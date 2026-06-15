import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const type = request.nextUrl.searchParams.get("type") || "course";

    if (type === "note") {
      const noteOrders = await db.noteOrder.findMany({
        include: {
          user: { select: { name: true, email: true } },
          note: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(noteOrders);
    }

    const orders = await db.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    return NextResponse.json({ error: "خطا در دریافت سفارش‌ها" }, { status: 500 });
  }
}
