import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPaymentGateway } from "@/lib/payment";

export async function GET(request: NextRequest) {
  try {
    const authority = request.nextUrl.searchParams.get("Authority");
    const status = request.nextUrl.searchParams.get("Status");

    if (!authority || !status) {
      return NextResponse.redirect(new URL("/payment/failed", request.url));
    }

    // Find payment by authority
    const payment = await db.payment.findFirst({
      where: { authority },
      include: { order: true },
    });

    if (!payment) {
      return NextResponse.redirect(new URL("/payment/failed", request.url));
    }

    if (status === "OK") {
      const gateway = getPaymentGateway();
      const result = await gateway.verifyPayment(authority, payment.order.amount);

      if (result.success) {
        // Update payment
        await db.payment.update({
          where: { id: payment.id },
          data: {
            status: "SUCCESS",
            refId: result.refId,
            cardPan: result.cardPan,
          },
        });

        // Update order
        await db.order.update({
          where: { id: payment.orderId },
          data: { status: "PAID" },
        });

        // Create enrollment
        await db.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: payment.order.userId,
              courseId: payment.order.courseId,
            },
          },
          create: {
            userId: payment.order.userId,
            courseId: payment.order.courseId,
          },
          update: {},
        });

        return NextResponse.redirect(
          new URL(`/payment/success?orderId=${payment.orderId}`, request.url)
        );
      } else {
        // Verification failed
        await db.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED" },
        });

        await db.order.update({
          where: { id: payment.orderId },
          data: { status: "FAILED" },
        });

        return NextResponse.redirect(new URL("/payment/failed", request.url));
      }
    } else {
      // User cancelled or payment failed
      await db.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });

      await db.order.update({
        where: { id: payment.orderId },
        data: { status: "FAILED" },
      });

      return NextResponse.redirect(new URL("/payment/failed", request.url));
    }
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(new URL("/payment/failed", request.url));
  }
}
