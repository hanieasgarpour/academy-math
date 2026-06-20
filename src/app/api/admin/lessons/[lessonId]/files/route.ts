import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

// POST - Add a file to a lesson
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { lessonId } = await params;
    const body = await request.json();
    const { name, url, fileType, fileSize } = body;

    if (!name || !url || !fileType || !fileSize) {
      return NextResponse.json({ error: "فیلدهای الزامی را پر کنید" }, { status: 400 });
    }

    const file = await db.file.create({
      data: {
        name,
        url,
        fileType,
        fileSize: parseInt(String(fileSize)),
        lessonId,
      },
    });

    return NextResponse.json(file, { status: 201 });
  } catch (error) {
    console.error("Error creating file:", error);
    return NextResponse.json({ error: "خطا در ایجاد فایل" }, { status: 500 });
  }
}

// DELETE - Remove a file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const fileId = request.nextUrl.searchParams.get("fileId");
    if (!fileId) {
      return NextResponse.json({ error: "شناسه فایل الزامی است" }, { status: 400 });
    }

    await db.file.delete({ where: { id: fileId } });
    return NextResponse.json({ message: "فایل حذف شد" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "خطا در حذف فایل" }, { status: 500 });
  }
}
