"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Calendar, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "در انتظار", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "پرداخت شده", color: "bg-green-100 text-green-700" },
  FAILED: { label: "ناموفق", color: "bg-red-100 text-red-700" },
  CANCELLED: { label: "لغو شده", color: "bg-gray-100 text-gray-700" },
};

function toToman(rials: number): string {
  return (rials / 10).toLocaleString("fa-IR");
}

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    createdAt: string;
  } | null>(null);
  const [orders, setOrders] = useState<
    { id: string; amount: number; status: string; createdAt: string; course: { title: string } }[]
  >([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    Promise.all([
      fetch("/api/user/profile").then((r) => r.json()),
      fetch("/api/user/orders").then((r) => r.json()),
    ])
      .then(([profileData, ordersData]) => {
        setProfile(profileData);
        setName(profileData.name);
        setPhone(profileData.phone || "");
        setOrders(ordersData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status, router]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phone || undefined }),
      });

      if (res.ok) {
        toast.success("پروفایل بروزرسانی شد");
      } else {
        toast.error("خطا در بروزرسانی پروفایل");
      }
    } catch {
      toast.error("خطا در بروزرسانی پروفایل");
    } finally {
      setSaving(false);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold mb-6">پروفایل من</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    اطلاعات حساب
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">نام و نام خانوادگی</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                      id="email"
                      value={profile?.email || ""}
                      disabled
                      dir="ltr"
                      className="text-left"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">شماره تلفن</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="شماره تلفن خود را وارد کنید"
                      dir="ltr"
                      className="text-left"
                    />
                  </div>
                  <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    ذخیره تغییرات
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Account Summary */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-5">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold">{profile?.name}</h3>
                    <p className="text-sm text-muted-foreground" dir="ltr">
                      {profile?.email}
                    </p>
                    <Badge className="mt-2">
                      {profile?.role === "ADMIN" ? "مدیر" : "دانش‌آموز"}
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span dir="ltr">{profile?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span dir="ltr">{profile?.phone || "ثبت نشده"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        عضویت:{" "}
                        {profile?.createdAt
                          ? new Date(profile.createdAt).toLocaleDateString("fa-IR")
                          : "—"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Order History */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">تاریخچه سفارش‌ها</h2>
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
                          <th className="text-right py-3 px-4 font-medium">دوره</th>
                          <th className="text-right py-3 px-4 font-medium">مبلغ</th>
                          <th className="text-right py-3 px-4 font-medium">وضعیت</th>
                          <th className="text-right py-3 px-4 font-medium">تاریخ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => {
                          const oStatus = statusMap[order.status] || statusMap.PENDING;
                          return (
                            <tr key={order.id} className="border-b last:border-0">
                              <td className="py-3 px-4">{order.course.title}</td>
                              <td className="py-3 px-4">
                                {toToman(order.amount)} تومان
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={oStatus.color}>
                                  {oStatus.label}
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
