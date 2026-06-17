import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ noteOrderId: string }> }
) {
  try {
    const { noteOrderId } = await params;
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
      return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
    }

    const userId = token.id as string;

    const noteOrder = await db.noteOrder.findUnique({
      where: { id: noteOrderId },
      include: {
        note: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            gradeLevel: true,
            pageCount: true,
            fileName: true,
          },
        },
      },
    });

    if (!noteOrder) {
      return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
    }

    if (noteOrder.userId !== userId) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    return NextResponse.json(noteOrder);
  } catch (error: unknown) {
    console.error("Error fetching note order:", error);

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

    return NextResponse.json({ error: "خطا در دریافت سفارش" }, { status: 500 });
  }
}
