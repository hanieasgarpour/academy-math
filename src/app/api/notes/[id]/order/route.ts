import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
    }

    const note = await db.note.findUnique({ where: { id } });
    if (!note) {
      return NextResponse.json({ error: "جزوه یافت نشد" }, { status: 404 });
    }

    if (!note.published) {
      return NextResponse.json({ error: "این جزوه در دسترس نیست" }, { status: 400 });
    }

    // Check if already purchased
    const existingOrder = await db.noteOrder.findFirst({
      where: {
        userId: token.id as string,
        noteId: id,
        status: "PAID",
      },
    });

    if (existingOrder) {
      return NextResponse.json(
        { error: "شما قبلاً این جزوه را خریداری کرده‌اید", noteOrder: existingOrder },
        { status: 409 }
      );
    }

    // Check for pending order
    const pendingOrder = await db.noteOrder.findFirst({
      where: {
        userId: token.id as string,
        noteId: id,
        status: "PENDING",
      },
    });

    if (pendingOrder) {
      return NextResponse.json({ noteOrder: pendingOrder, message: "سفارش قبلی در انتظار پرداخت" });
    }

    // Create note order
    const noteOrder = await db.noteOrder.create({
      data: {
        userId: token.id as string,
        noteId: id,
        amount: note.price,
        status: "PENDING",
      },
    });

    return NextResponse.json({ noteOrder }, { status: 201 });
  } catch (error) {
    console.error("Error creating note order:", error);
    return NextResponse.json({ error: "خطا در ایجاد سفارش" }, { status: 500 });
  }
}
