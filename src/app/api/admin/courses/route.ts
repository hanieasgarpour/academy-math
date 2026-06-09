import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const courses = await db.course.findMany({
      include: {
        _count: { select: { lessons: true, enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching admin courses:", error);
    return NextResponse.json({ error: "خطا در دریافت دوره‌ها" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, price, level, duration, published } = body;

    if (!title || !description || price === undefined || !level) {
      return NextResponse.json({ error: "فیلدهای الزامی را پر کنید" }, { status: 400 });
    }

    const course = await db.course.create({
      data: {
        title,
        description,
        price: parseInt(String(price)),
        level,
        duration: duration || null,
        published: published ?? false,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: "خطا در ایجاد دوره" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "شناسه دوره الزامی است" }, { status: 400 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = parseInt(String(body.price));
    if (body.level !== undefined) updateData.level = body.level;
    if (body.duration !== undefined) updateData.duration = body.duration || null;
    if (body.published !== undefined) updateData.published = body.published;

    const course = await db.course.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "خطا در ویرایش دوره" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "شناسه دوره الزامی است" }, { status: 400 });
    }

    await db.course.delete({ where: { id } });

    return NextResponse.json({ message: "دوره حذف شد" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "خطا در حذف دوره" }, { status: 500 });
  }
}
