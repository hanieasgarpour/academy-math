import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, ShoppingCart, CreditCard, FileText } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [
    userCount,
    courseCount,
    orderCount,
    noteOrderCount,
    courseRevenue,
    noteRevenue,
  ] = await Promise.all([
    db.user.count({ where: { role: "STUDENT" } }),
    db.course.count(),
    db.order.count(),
    db.noteOrder.count(),
    db.order.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    db.noteOrder.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
  ]);

  const totalRevenue = (courseRevenue._sum.amount || 0) + (noteRevenue._sum.amount || 0);

  const recentCourseOrders = await db.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  });

  const recentNoteOrders = await db.noteOrder.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      note: { select: { title: true } },
    },
  });

  function toToman(rials: number): string {
    return (rials / 10).toLocaleString("fa-IR");
  }

  const stats = [
    {
      title: "دانش‌آموزان",
      value: userCount,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "دوره‌ها",
      value: courseCount,
      icon: BookOpen,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "سفارش‌ها",
      value: orderCount + noteOrderCount,
      icon: ShoppingCart,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "درآمد کل (تومان)",
      value: toToman(totalRevenue),
      icon: CreditCard,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">داشبورد</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">درآمد دوره‌ها (تومان)</p>
                <p className="text-xl font-bold mt-1">{toToman(courseRevenue._sum.amount || 0)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">درآمد جزوه‌ها (تومان)</p>
                <p className="text-xl font-bold mt-1">{toToman(noteRevenue._sum.amount || 0)}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Course Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            آخرین سفارش‌های دوره
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentCourseOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              هنوز سفارش دوره‌ای ثبت نشده است
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">کاربر</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">دوره</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">مبلغ</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCourseOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 px-2">{order.user.name}</td>
                      <td className="py-3 px-2">{order.course.title}</td>
                      <td className="py-3 px-2">{toToman(order.amount)} تومان</td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "PAID"
                              ? "bg-green-100 text-green-700"
                              : order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status === "PAID"
                            ? "پرداخت شده"
                            : order.status === "PENDING"
                            ? "در انتظار"
                            : "ناموفق"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Note Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            آخرین سفارش‌های جزوه
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentNoteOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              هنوز سفارش جزوه‌ای ثبت نشده است
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">کاربر</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">جزوه</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">مبلغ</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {recentNoteOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 px-2">{order.user.name}</td>
                      <td className="py-3 px-2">{order.note.title}</td>
                      <td className="py-3 px-2">{toToman(order.amount)} تومان</td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "PAID"
                              ? "bg-green-100 text-green-700"
                              : order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status === "PAID"
                            ? "پرداخت شده"
                            : order.status === "PENDING"
                            ? "در انتظار"
                            : "ناموفق"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/courses">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">مدیریت دوره‌ها</p>
                <p className="text-sm text-muted-foreground">افزودن و ویرایش دوره‌ها</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">مدیریت کاربران</p>
                <p className="text-sm text-muted-foreground">مشاهده و مدیریت کاربران</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
