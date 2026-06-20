import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

// PUT - Update a lesson
export async function PUT(
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

    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl || null;
    if (body.order !== undefined) updateData.order = body.order;

    const lesson = await db.lesson.update({
      where: { id: lessonId },
      data: updateData,
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json({ error: "خطا در ویرایش درس" }, { status: 500 });
  }
}

// DELETE - Remove a lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { lessonId } = await params;
    await db.lesson.delete({ where: { id: lessonId } });

    return NextResponse.json({ message: "درس حذف شد" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return NextResponse.json({ error: "خطا در حذف درس" }, { status: 500 });
  }
}
