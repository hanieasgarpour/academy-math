"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Clock,
  ArrowLeft,
  LayoutDashboard,
  FileText,
  Download,
} from "lucide-react";
import { toast } from "sonner";

const levelMap: Record<string, { label: string; color: string }> = {
  BEGINNER: { label: "مبتدی", color: "bg-green-100 text-green-700" },
  INTERMEDIATE: { label: "متوسط", color: "bg-yellow-100 text-yellow-700" },
  ADVANCED: { label: "پیشرفته", color: "bg-red-100 text-red-700" },
};

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "در انتظار", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "پرداخت شده", color: "bg-green-100 text-green-700" },
  FAILED: { label: "ناموفق", color: "bg-red-100 text-red-700" },
  CANCELLED: { label: "لغو شده", color: "bg-gray-100 text-gray-700" },
};

const gradeMap: Record<string, string> = {
  GRADE_7: "پایه هفتم",
  GRADE_8: "پایه هشتم",
  GRADE_9: "پایه نهم",
  GRADE_10: "پایه دهم",
  GRADE_11: "پایه یازدهم",
  GRADE_12: "پایه دوازدهم",
};

interface Enrollment {
  id: string;
  course: {
    id: string;
    title: string;
    level: string;
    duration: string | null;
    _count: { lessons: number };
  };
}

interface Order {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  course: { title: string };
}

interface NoteOrder {
  id: string;
  noteId: string;
  amount: number;
  status: string;
  createdAt: string;
  note: {
    id: string;
    title: string;
    gradeLevel: string;
    pageCount: number;
    price: number;
  };
}

function toToman(rials: number): string {
  return (rials / 10).toLocaleString("fa-IR");
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [noteOrders, setNoteOrders] = useState<NoteOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status !== "authenticated") return;

    Promise.all([
      fetch("/api/user/enrollments").then((r) => r.json()),
      fetch("/api/user/orders").then((r) => r.json()),
      fetch("/api/user/note-orders").then((r) => r.json()),
    ])
      .then(([enrollmentsData, ordersData, noteOrdersData]) => {
        setEnrollments(enrollmentsData);
        setOrders(ordersData);
        setNoteOrders(Array.isArray(noteOrdersData) ? noteOrdersData : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status, router]);

  async function handleNoteDownload(noteId: string) {
    try {
      const res = await fetch(`/api/notes/${noteId}/download`);
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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const paidNoteOrders = noteOrders.filter((o) => o.status === "PAID");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-bl from-orange-50 via-white to-orange-50 py-10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">داشبورد</h1>
            </div>
            <p className="text-muted-foreground">
              سلام {session?.user?.name}! خوش آمدید
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Enrolled Courses */}
          <div>
            <h2 className="text-xl font-bold mb-4">دوره‌های من</h2>
            {enrollments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <GraduationCap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    هنوز در هیچ دوره‌ای ثبت‌نام نکرده‌اید
                  </p>
                  <Link href="/courses">
                    <Button className="gap-2">
                      مشاهده دوره‌ها
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrollments.map((enrollment) => {
                  const level =
                    levelMap[enrollment.course.level] || levelMap.BEGINNER;
                  return (
                    <Card
                      key={enrollment.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-sm">
                            {enrollment.course.title}
                          </h3>
                          <Badge className={level.color}>{level.label}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          {enrollment.course.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {enrollment.course.duration}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" />
                            {enrollment.course._count.lessons} درس
                          </div>
                        </div>
                        <Link
                          href={`/courses/${enrollment.course.id}`}
                        >
                          <Button size="sm" className="w-full gap-1">
                            ورود به دوره
                            <ArrowLeft className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Purchased Notes */}
          <div>
            <h2 className="text-xl font-bold mb-4">جزوات خریداری شده</h2>
            {paidNoteOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    هنوز جزوه‌ای خریداری نکرده‌اید
                  </p>
                  <Link href="/products">
                    <Button className="gap-2">
                      مشاهده جزوات
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paidNoteOrders.map((noteOrder) => (
                  <Card
                    key={noteOrder.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <h3 className="font-bold text-sm line-clamp-1">
                            {noteOrder.note.title}
                          </h3>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0">
                          {gradeMap[noteOrder.note.gradeLevel] || noteOrder.note.gradeLevel}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-3">
                        {noteOrder.note.pageCount} صفحه
                      </div>
                      <Button
                        size="sm"
                        className="w-full gap-1"
                        onClick={() => handleNoteDownload(noteOrder.noteId)}
                      >
                        <Download className="h-3.5 w-3.5" />
                        دانلود جزوه
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div>
            <h2 className="text-xl font-bold mb-4">سفارش‌های اخیر</h2>
            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">سفارشی یافت نشد</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="text-right py-3 px-4 font-medium">
                            دوره
                          </th>
                          <th className="text-right py-3 px-4 font-medium">
                            مبلغ
                          </th>
                          <th className="text-right py-3 px-4 font-medium">
                            وضعیت
                          </th>
                          <th className="text-right py-3 px-4 font-medium">
                            تاریخ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((order) => {
                          const oStatus =
                            statusMap[order.status] || statusMap.PENDING;
                          return (
                            <tr
                              key={order.id}
                              className="border-b last:border-0"
                            >
                              <td className="py-3 px-4">
                                {order.course.title}
                              </td>
                              <td className="py-3 px-4">
                                {toToman(order.amount)} تومان
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={oStatus.color}>
                                  {oStatus.label}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "fa-IR"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
