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

    // Defensive check: ensure both token AND token.id exist
    if (!token || !token.id) {
      return NextResponse.json(
        { error: "ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    const userId = token.id as string;

    const note = await db.note.findUnique({ where: { id } });
    if (!note) {
      return NextResponse.json({ error: "جزوه یافت نشد" }, { status: 404 });
    }

    if (!note.published) {
      return NextResponse.json({ error: "این جزوه در دسترس نیست" }, { status: 400 });
    }

    // Check if already purchased (PAID order)
    const existingOrder = await db.noteOrder.findFirst({
      where: {
        userId,
        noteId: id,
        status: "PAID",
      },
    });

    if (existingOrder) {
      return NextResponse.json(
        {
          error: "شما قبلاً این جزوه را خریداری کرده‌اید",
          noteOrder: existingOrder,
        },
        { status: 409 }
      );
    }

    // Check for pending order
    const pendingOrder = await db.noteOrder.findFirst({
      where: {
        userId,
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
        userId,
        noteId: id,
        amount: note.price,
        status: "PENDING",
      },
    });

    return NextResponse.json({ noteOrder }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating note order:", error);

    // Detect "table does not exist" Prisma error (P2021)
    // This happens when the local SQLite DB schema is out of sync with schema.prisma
    const prismaError = error as { code?: string; message?: string };
    if (prismaError.code === "P2021") {
      return NextResponse.json(
        {
          error:
            "جدول NoteOrder در دیتابیس محلی وجود ندارد. لطفاً دستور `npx prisma db push` را اجرا کنید تا ساختار دیتابیس با schema هماهنگ شود.",
        },
        { status: 500 }
      );
    }

    // Detect "column does not exist" Prisma error (P2022)
    if (prismaError.code === "P2022") {
      return NextResponse.json(
        {
          error:
            "ساختار دیتابیس محلی قدیمی است. لطفاً دستور `npx prisma db push` را اجرا کنید.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "خطا در ایجاد سفارش" }, { status: 500 });
  }
}
