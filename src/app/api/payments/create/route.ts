import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { getPaymentGateway } from "@/lib/payment";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "لطفاً وارد شوید" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "شناسه سفارش الزامی است" }, { status: 400 });
    }

    // Find order
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { course: true },
    });

    if (!order) {
      return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
    }

    if (order.userId !== token.id) {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json({ error: "این سفارش قابل پرداخت نیست" }, { status: 400 });
    }

    // Check for existing payment
    const existingPayment = await db.payment.findFirst({
      where: { orderId: order.id, status: "PENDING" },
    });

    if (existingPayment?.authority) {
      const callbackUrl = `${process.env.NEXTAUTH_URL}/api/payments/callback`;
      const paymentUrl = `${callbackUrl}?Authority=${existingPayment.authority}&Status=OK`;
      return NextResponse.json({ paymentUrl });
    }

    // Create payment
    const gateway = getPaymentGateway();
    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/payments/callback`;
    const { authority, paymentUrl } = await gateway.createPayment(
      order.amount,
      `پرداخت دوره ${order.course.title}`,
      callbackUrl
    );

    await db.payment.create({
      data: {
        orderId: order.id,
        authority,
        status: "PENDING",
      },
    });

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json({ error: "خطا در ایجاد پرداخت" }, { status: 500 });
  }
}
