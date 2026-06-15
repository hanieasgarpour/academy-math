import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const notes = await db.note.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "خطا در دریافت جزوات" }, { status: 500 });
  }
}
