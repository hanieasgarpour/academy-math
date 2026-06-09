"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "در انتظار", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "پرداخت شده", color: "bg-green-100 text-green-700" },
  FAILED: { label: "ناموفق", color: "bg-red-100 text-red-700" },
  CANCELLED: { label: "لغو شده", color: "bg-gray-100 text-gray-700" },
};

interface OrderItem {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  course: { title: string };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);
    } catch {
      toast.error("خطا در دریافت سفارش‌ها");
    } finally {
      setLoading(false);
    }
  }

  function toToman(rials: number): string {
    return (rials / 10).toLocaleString("fa-IR");
  }

  const filteredOrders =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

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

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              در حال بارگذاری...
            </div>
          ) : filteredOrders.length === 0 ? (
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
                  {filteredOrders.map((order) => {
                    const status = statusMap[order.status] || statusMap.PENDING;
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
                          <Badge className={status.color}>
                            {status.label}
                          </Badge>
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
    </div>
  );
}
