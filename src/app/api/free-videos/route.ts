import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const freeVideos = await db.freeVideo.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(freeVideos);
  } catch (error) {
    console.error("Error fetching free videos:", error);
    return NextResponse.json({ error: "خطا در دریافت ویدیوها" }, { status: 500 });
  }
}
