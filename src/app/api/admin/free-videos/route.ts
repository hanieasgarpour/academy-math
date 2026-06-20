import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const freeVideos = await db.freeVideo.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(freeVideos);
  } catch (error) {
    console.error("Error fetching free videos:", error);
    return NextResponse.json({ error: "خطا در دریافت ویدیوها" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token || token.role !== "ADMIN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, url, platform, thumbnail, order, published } = body;

    if (!title || !url) {
      return NextResponse.json({ error: "عنوان و لینک ویدیو الزامی است" }, { status: 400 });
    }

    const freeVideo = await db.freeVideo.create({
      data: {
        title,
        description: description || null,
        url,
        platform: platform || "YOUTUBE",
        thumbnail: thumbnail || null,
        order: order || 0,
        published: published ?? true,
      },
    });

    return NextResponse.json(freeVideo, { status: 201 });
  } catch (error) {
    console.error("Error creating free video:", error);
    return NextResponse.json({ error: "خطا در ایجاد ویدیو" }, { status: 500 });
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
      return NextResponse.json({ error: "شناسه ویدیو الزامی است" }, { status: 400 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.url !== undefined) updateData.url = body.url;
    if (body.platform !== undefined) updateData.platform = body.platform;
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail || null;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.published !== undefined) updateData.published = body.published;

    const freeVideo = await db.freeVideo.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(freeVideo);
  } catch (error) {
    console.error("Error updating free video:", error);
    return NextResponse.json({ error: "خطا در ویرایش ویدیو" }, { status: 500 });
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
      return NextResponse.json({ error: "شناسه ویدیو الزامی است" }, { status: 400 });
    }

    await db.freeVideo.delete({ where: { id } });
    return NextResponse.json({ message: "ویدیو حذف شد" });
  } catch (error) {
    console.error("Error deleting free video:", error);
    return NextResponse.json({ error: "خطا در حذف ویدیو" }, { status: 500 });
  }
}
