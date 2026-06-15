"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, FileText } from "lucide-react";
import { toast } from "sonner";

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "در انتظار", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "پرداخت شده", color: "bg-green-100 text-green-700" },
  FAILED: { label: "ناموفق", color: "bg-red-100 text-red-700" },
  CANCELLED: { label: "لغو شده", color: "bg-gray-100 text-gray-700" },
};

interface CourseOrderItem {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  course: { title: string };
}

interface NoteOrderItem {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  note: { title: string };
}

function toToman(rials: number): string {
  return (rials / 10).toLocaleString("fa-IR");
}

export default function AdminOrdersPage() {
  const [courseOrders, setCourseOrders] = useState<CourseOrderItem[]>([]);
  const [noteOrders, setNoteOrders] = useState<NoteOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const [courseRes, noteRes] = await Promise.all([
        fetch("/api/admin/orders?type=course"),
        fetch("/api/admin/orders?type=note"),
      ]);
      const courseData = await courseRes.json();
      const noteData = await noteRes.json();
      setCourseOrders(courseData);
      setNoteOrders(noteData);
    } catch {
      toast.error("خطا در دریافت سفارش‌ها");
    } finally {
      setLoading(false);
    }
  }

  const filteredCourseOrders =
    filter === "ALL" ? courseOrders : courseOrders.filter((o) => o.status === filter);

  const filteredNoteOrders =
    filter === "ALL" ? noteOrders : noteOrders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">مدیریت سفارش‌ها</h1>
        <div className="flex gap-2">
          {[
            { value: "ALL", label: "همه" },
            { value: "PENDING", label: "در انتظار" },
            { value: "PAID", label: "پرداخت شده" },
            { value: "FAILED", label: "ناموفق" },
          ].map((s) => (
            <Button
              key={s.value}
              variant={filter === s.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(s.value)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="course" dir="rtl">
        <TabsList className="grid grid-cols-2 w-full max-w-xs">
          <TabsTrigger value="course" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            سفارش دوره‌ها
          </TabsTrigger>
          <TabsTrigger value="note" className="gap-2">
            <FileText className="h-4 w-4" />
            سفارش جزوات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="course">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  در حال بارگذاری...
                </div>
              ) : filteredCourseOrders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  سفارشی یافت نشد
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-right py-3 px-4 font-medium">کاربر</th>
                        <th className="text-right py-3 px-4 font-medium">دوره</th>
                        <th className="text-right py-3 px-4 font-medium">مبلغ</th>
                        <th className="text-right py-3 px-4 font-medium">وضعیت</th>
                        <th className="text-right py-3 px-4 font-medium">تاریخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourseOrders.map((order) => {
                        const s = statusMap[order.status] || statusMap.PENDING;
                        return (
                          <tr
                            key={order.id}
                            className="border-b last:border-0 hover:bg-muted/20"
                          >
                            <td className="py-3 px-4">
                              <div>{order.user.name}</div>
                              <div className="text-xs text-muted-foreground" dir="ltr">
                                {order.user.email}
                              </div>
                            </td>
                            <td className="py-3 px-4">{order.course.title}</td>
                            <td className="py-3 px-4">
                              {toToman(order.amount)} تومان
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={s.color}>{s.label}</Badge>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="note">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  در حال بارگذاری...
                </div>
              ) : filteredNoteOrders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  سفارش جزوه‌ای یافت نشد
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-right py-3 px-4 font-medium">کاربر</th>
                        <th className="text-right py-3 px-4 font-medium">جزوه</th>
                        <th className="text-right py-3 px-4 font-medium">مبلغ</th>
                        <th className="text-right py-3 px-4 font-medium">وضعیت</th>
                        <th className="text-right py-3 px-4 font-medium">تاریخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNoteOrders.map((order) => {
                        const s = statusMap[order.status] || statusMap.PENDING;
                        return (
                          <tr
                            key={order.id}
                            className="border-b last:border-0 hover:bg-muted/20"
                          >
                            <td className="py-3 px-4">
                              <div>{order.user.name}</div>
                              <div className="text-xs text-muted-foreground" dir="ltr">
                                {order.user.email}
                              </div>
                            </td>
                            <td className="py-3 px-4">{order.note.title}</td>
                            <td className="py-3 px-4">
                              {toToman(order.amount)} تومان
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={s.color}>{s.label}</Badge>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
