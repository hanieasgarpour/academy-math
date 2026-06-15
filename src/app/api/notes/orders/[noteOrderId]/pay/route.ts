import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function POST(
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
    });

    if (!noteOrder) {
      return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
    }

    if (noteOrder.userId !== token.id) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    if (noteOrder.status === "PAID") {
      return NextResponse.json({ error: "این سفارش قبلاً پرداخت شده است" }, { status: 400 });
    }

    if (noteOrder.status !== "PENDING") {
      return NextResponse.json({ error: "این سفارش قابل پرداخت نیست" }, { status: 400 });
    }

    // Mock payment: mark as PAID directly
    // In production, this would integrate with a real payment gateway
    const updatedOrder = await db.noteOrder.update({
      where: { id: noteOrderId },
      data: { status: "PAID" },
    });

    return NextResponse.json({
      message: "پرداخت با موفقیت انجام شد",
      noteOrder: updatedOrder,
    });
  } catch (error) {
    console.error("Error paying for note order:", error);
    return NextResponse.json({ error: "خطا در پرداخت" }, { status: 500 });
  }
}
