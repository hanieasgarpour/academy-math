import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.id) {
      return NextResponse.json({ error: "ابتدا وارد شوید" }, { status: 401 });
    }

    const userId = token.id as string;

    const note = await db.note.findUnique({ where: { id } });
    if (!note) {
      return NextResponse.json({ error: "جزوه یافت نشد" }, { status: 404 });
    }

    // If note is free, allow download
    if (note.price === 0) {
      return NextResponse.json({ url: note.fileUrl, fileName: note.fileName });
    }

    // Check if user has purchased this note
    const order = await db.noteOrder.findFirst({
      where: {
        userId,
        noteId: id,
        status: "PAID",
      },
    });

    if (!order) {
      return NextResponse.json({ error: "ابتدا جزوه را خریداری کنید" }, { status: 403 });
    }

    return NextResponse.json({ url: note.fileUrl, fileName: note.fileName });
  } catch (error: unknown) {
    console.error("Error downloading note:", error);

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

    return NextResponse.json({ error: "خطا در دانلود جزوه" }, { status: 500 });
  }
}
