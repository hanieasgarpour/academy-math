import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
      return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
    }

    const userId = token.id as string;

    const noteOrders = await db.noteOrder.findMany({
      where: { userId },
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
  } catch (error: unknown) {
    console.error("Error fetching note orders:", error);

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

    return NextResponse.json({ error: "خطا در دریافت سفارش‌های جزوه" }, { status: 500 });
  }
}
