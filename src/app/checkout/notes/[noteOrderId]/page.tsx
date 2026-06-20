"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CreditCard, ArrowLeft, Loader2, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function toToman(rials: number): string {
  return (rials / 10).toLocaleString("fa-IR");
}

const gradeMap: Record<string, string> = {
  GRADE_7: "پایه هفتم",
  GRADE_8: "پایه هشتم",
  GRADE_9: "پایه نهم",
  GRADE_10: "پایه دهم",
  GRADE_11: "پایه یازدهم",
  GRADE_12: "پایه دوازدهم",
};

interface NoteOrderData {
  id: string;
  amount: number;
  status: string;
  note: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    gradeLevel: string;
    pageCount: number;
    fileName: string;
  };
}

export default function NoteCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const [noteOrder, setNoteOrder] = useState<NoteOrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status !== "authenticated") return;
    if (!params.noteOrderId) return;

    fetch(`/api/notes/orders/${params.noteOrderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          setNoteOrder(data);
          if (data.status === "PAID") {
            setPaid(true);
          }
        }
      })
      .catch(() => {
        toast.error("خطا در دریافت اطلاعات سفارش");
      })
      .finally(() => setLoading(false));
  }, [params.noteOrderId, status, router]);

  async function handlePayment() {
    if (!noteOrder) return;
    setPaying(true);

    try {
      const res = await fetch(`/api/notes/orders/${noteOrder.id}/pay`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطا در پرداخت");
        setPaying(false);
        return;
      }

      setPaid(true);
      toast.success("پرداخت با موفقیت انجام شد!");
    } catch {
      toast.error("خطا در پرداخت");
      setPaying(false);
    }
  }

  async function handleDownload() {
    if (!noteOrder) return;
    try {
      const res = await fetch(`/api/notes/${noteOrder.note.id}/download`);
      const data = await res.json();
      if (res.ok && data.url) {
        window.open(data.url, "_blank");
      } else {
        toast.error(data.error || "خطا در دانلود جزوه");
      }
    } catch {
      toast.error("خطا در دانلود جزوه");
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

  if (!noteOrder) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">سفارش یافت نشد</h2>
            <Link href="/products">
              <Button variant="outline" className="gap-2 mt-4">
                بازگشت به محصولات
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
            <h1 className="text-2xl font-bold mb-6 text-center">تکمیل خرید جزوه</h1>

            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="space-y-4">
                  <h2 className="font-bold flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    خلاصه سفارش
                  </h2>
                  <div className="space-y-3 border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium text-sm block">{noteOrder.note.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {gradeMap[noteOrder.note.gradeLevel] || noteOrder.note.gradeLevel}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {noteOrder.note.pageCount} صفحه
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-3">
                      <span className="text-muted-foreground">مبلغ</span>
                      <span className="font-bold text-lg text-primary">
                        {toToman(noteOrder.amount)} تومان
                      </span>
                    </div>
                  </div>
                </div>

                {paid ? (
                  /* Success State */
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="h-7 w-7 text-green-600" />
                      </div>
                      <p className="font-bold text-green-700 mb-1">پرداخت موفق!</p>
                      <p className="text-sm text-muted-foreground">جزوه با موفقیت خریداری شد</p>
                    </div>
                    <Button
                      className="w-full gap-2 text-base py-6"
                      onClick={handleDownload}
                    >
                      <FileText className="h-5 w-5" />
                      دانلود جزوه
                    </Button>
                    <Link href="/products" className="block text-center text-sm text-muted-foreground hover:text-primary">
                      بازگشت به محصولات
                    </Link>
                  </div>
                ) : (
                  /* Payment Button */
                  <>
                    <Button
                      className="w-full gap-2 text-base py-6"
                      onClick={handlePayment}
                      disabled={paying}
                    >
                      {paying ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          در حال پرداخت...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5" />
                          پرداخت {toToman(noteOrder.amount)} تومان
                        </>
                      )}
                    </Button>

                    <Link
                      href="/products"
                      className="block text-center text-sm text-muted-foreground hover:text-primary"
                    >
                      بازگشت به محصولات
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
