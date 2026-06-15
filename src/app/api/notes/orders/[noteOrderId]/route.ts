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
    if (!token) {
      return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
    }

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

    if (noteOrder.userId !== token.id) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    return NextResponse.json(noteOrder);
  } catch (error) {
    console.error("Error fetching note order:", error);
    return NextResponse.json({ error: "خطا در دریافت سفارش" }, { status: 500 });
  }
}
