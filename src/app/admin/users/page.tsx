"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Users } from "lucide-react";
import { toast } from "sonner";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: { enrollments: number; orders: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch {
      toast.error("خطا در دریافت کاربران");
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("آیا از حذف این کاربر اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("کاربر حذف شد");
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "خطا در حذف کاربر");
      }
    } catch {
      toast.error("خطا در حذف کاربر");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">مدیریت کاربران</h1>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              در حال بارگذاری...
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              کاربری یافت نشد
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-right py-3 px-4 font-medium">نام</th>
                    <th className="text-right py-3 px-4 font-medium">ایمیل</th>
                    <th className="text-right py-3 px-4 font-medium">تلفن</th>
                    <th className="text-right py-3 px-4 font-medium">نقش</th>
                    <th className="text-right py-3 px-4 font-medium">دوره‌ها</th>
                    <th className="text-right py-3 px-4 font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b last:border-0 hover:bg-muted/20"
                    >
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4" dir="ltr">
                        {user.email}
                      </td>
                      <td className="py-3 px-4" dir="ltr">
                        {user.phone || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={user.role === "ADMIN" ? "default" : "secondary"}
                        >
                          {user.role === "ADMIN" ? "مدیر" : "دانش‌آموز"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {user._count.enrollments}
                      </td>
                      <td className="py-3 px-4">
                        {user.role !== "ADMIN" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteUser(user.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
