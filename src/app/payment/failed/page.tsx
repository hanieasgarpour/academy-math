"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, RefreshCw, Phone, ArrowLeft } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">پرداخت ناموفق</h1>
            <p className="text-muted-foreground mb-6 leading-7">
              متأسفانه پرداخت شما با موفقیت انجام نشد. لطفاً دوباره تلاش کنید.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard">
                <Button className="w-full gap-2">
                  <RefreshCw className="h-4 w-4" />
                  تلاش مجدد
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  بازگشت به دوره‌ها
                </Button>
              </Link>
            </div>
            <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Phone className="h-4 w-4" />
                پشتیبانی
              </div>
              <p>در صورت مشکل با پشتیبانی تماس بگیرید</p>
              <p dir="ltr" className="mt-1">۰۲۱-۱۲۳۴۵۶۷۸</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
