"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, CreditCard, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function toToman(rials: number): string {
  return (rials / 10).toLocaleString("fa-IR");
}

interface OrderData {
  id: string;
  amount: number;
  status: string;
  courseId: string;
  course: { id: string; title: string };
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status !== "authenticated") return;
    if (!params.orderId) return;

    // Fetch order details from user orders
    fetch(`/api/user/orders`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((o: { id: string }) => o.id === params.orderId);
          if (found) {
            setOrder(found);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("خطا در دریافت اطلاعات سفارش");
        setLoading(false);
      });
  }, [params.orderId, status, router]);

  async function handlePayment() {
    if (!order) return;
    setPaying(true);

    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطا در ایجاد پرداخت");
        setPaying(false);
        return;
      }

      // In mock mode, paymentUrl is the callback URL which will process immediately
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch {
      toast.error("خطا در ایجاد پرداخت");
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">سفارش یافت نشد</h2>
            <Link href="/courses">
              <Button variant="outline" className="gap-2 mt-4">
                بازگشت به دوره‌ها
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">تکمیل خرید</h1>

            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="space-y-4">
                  <h2 className="font-bold flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    خلاصه سفارش
                  </h2>
                  <div className="space-y-3 border rounded-lg p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">دوره</span>
                      <span className="font-medium">{order.course?.title || "دوره"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">مبلغ</span>
                      <span className="font-bold text-lg text-primary">
                        {toToman(order.amount)} تومان
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <Button
                  className="w-full gap-2 text-base py-6"
                  onClick={handlePayment}
                  disabled={paying}
                >
                  {paying ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      در حال اتصال به درگاه پرداخت...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      پرداخت {toToman(order.amount)} تومان
                    </>
                  )}
                </Button>

                <Link
                  href={order.course?.id ? `/courses/${order.course.id}` : "/courses"}
                  className="block text-center text-sm text-muted-foreground hover:text-primary"
                >
                  بازگشت به صفحه دوره
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
