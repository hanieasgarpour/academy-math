import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const notes = await db.note.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "خطا در دریافت جزوات" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, price, gradeLevel, pageCount, fileUrl, fileName, fileSize, thumbnail, published } = body;

    if (!title || !gradeLevel || !fileUrl || !fileName) {
      return NextResponse.json({ error: "فیلدهای الزامی را پر کنید" }, { status: 400 });
    }

    const note = await db.note.create({
      data: {
        title,
        description: description || null,
        price: parseInt(String(price)) || 0,
        gradeLevel,
        pageCount: parseInt(String(pageCount)) || 0,
        fileUrl,
        fileName,
        fileSize: parseInt(String(fileSize)) || 0,
        thumbnail: thumbnail || null,
        published: published ?? true,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: "خطا در ایجاد جزوه" }, { status: 500 });
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
      return NextResponse.json({ error: "شناسه جزوه الزامی است" }, { status: 400 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.price !== undefined) updateData.price = parseInt(String(body.price));
    if (body.gradeLevel !== undefined) updateData.gradeLevel = body.gradeLevel;
    if (body.pageCount !== undefined) updateData.pageCount = parseInt(String(body.pageCount));
    if (body.fileUrl !== undefined) updateData.fileUrl = body.fileUrl;
    if (body.fileName !== undefined) updateData.fileName = body.fileName;
    if (body.fileSize !== undefined) updateData.fileSize = parseInt(String(body.fileSize));
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail || null;
    if (body.published !== undefined) updateData.published = body.published;

    const note = await db.note.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json({ error: "خطا در ویرایش جزوه" }, { status: 500 });
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
      return NextResponse.json({ error: "شناسه جزوه الزامی است" }, { status: 400 });
    }

    await db.note.delete({ where: { id } });
    return NextResponse.json({ message: "جزوه حذف شد" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ error: "خطا در حذف جزوه" }, { status: 500 });
  }
}
