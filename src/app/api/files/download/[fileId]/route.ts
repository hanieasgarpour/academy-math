import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
    }

    const { fileId } = await params;

    // Get file with lesson and course info
    const file = await db.file.findUnique({
      where: { id: fileId },
      include: {
        lesson: {
          select: { courseId: true },
        },
      },
    });

    if (!file) {
      return NextResponse.json({ error: "فایل یافت نشد" }, { status: 404 });
    }

    // Check enrollment
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: token.id as string,
          courseId: file.lesson.courseId,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    // In a real app, we would stream the file here
    // For now, redirect to the file URL or return file info
    return NextResponse.json({
      id: file.id,
      name: file.name,
      url: file.url,
      fileType: file.fileType,
      fileSize: file.fileSize,
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json({ error: "خطا در دانلود فایل" }, { status: 500 });
  }
}
