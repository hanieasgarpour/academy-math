"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, LayoutDashboard } from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">پرداخت موفق!</h1>
            <p className="text-muted-foreground mb-6 leading-7">
              پرداخت شما با موفقیت انجام شد. اکنون می‌توانید به دوره دسترسی داشته باشید.
            </p>
            {orderId && (
              <p className="text-xs text-muted-foreground mb-4">
                شماره سفارش: {orderId}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <Link href="/dashboard">
                <Button className="w-full gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  بازگشت به داشبورد
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  مشاهده دوره‌ها
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
