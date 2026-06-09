import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const courses = await db.course.findMany({
      where: { published: true },
      include: {
        _count: {
          select: { lessons: true, enrollments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "خطا در دریافت دوره‌ها" },
      { status: 500 }
    );
  }
}
