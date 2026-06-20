import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

// GET - List lessons for a course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    const lessons = await db.lesson.findMany({
      where: { courseId: id },
      include: { files: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json({ error: "خطا در دریافت دروس" }, { status: 500 });
  }
}

// POST - Create a new lesson
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, videoUrl, order } = body;

    if (!title) {
      return NextResponse.json({ error: "عنوان درس الزامی است" }, { status: 400 });
    }

    const lesson = await db.lesson.create({
      data: {
        title,
        content: content || null,
        videoUrl: videoUrl || null,
        order: order || 0,
        courseId: id,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json({ error: "خطا در ایجاد درس" }, { status: 500 });
  }
}
