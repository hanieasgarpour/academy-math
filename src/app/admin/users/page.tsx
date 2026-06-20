"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Users, UserPlus, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  _count: { enrollments: number; orders: number; noteOrders: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state (create user)
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("ADMIN");

  // Reset password dialog state
  const [resetUser, setResetUser] = useState<UserItem | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState("");
  const [resetting, setResetting] = useState(false);

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

  async function createUser() {
    if (!newName || !newEmail || !newPassword) {
      toast.error("لطفاً تمام فیلدهای الزامی را پر کنید");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          phone: newPhone || undefined,
          role: newRole,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("کاربر با موفقیت ایجاد شد");
        setDialogOpen(false);
        resetForm();
        fetchUsers();
      } else {
        toast.error(data.error || "خطا در ایجاد کاربر");
      }
    } catch {
      toast.error("خطا در ایجاد کاربر");
    } finally {
      setCreating(false);
    }
  }

  function resetForm() {
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewPhone("");
    setNewRole("ADMIN");
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

  function openResetDialog(user: UserItem) {
    setResetUser(user);
    setResetPasswordValue("");
  }

  function closeResetDialog() {
    setResetUser(null);
    setResetPasswordValue("");
  }

  async function resetPassword() {
    if (!resetUser) return;
    if (resetPasswordValue.length < 6) {
      toast.error("رمز عبور جدید باید حداقل ۶ کاراکتر باشد");
      return;
    }

    setResetting(true);
    try {
      const res = await fetch(
        `/api/admin/users/${resetUser.id}/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword: resetPasswordValue }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "رمز عبور با موفقیت تغییر کرد");
        closeResetDialog();
      } else {
        toast.error(data.error || "خطا در تغییر رمز عبور");
      }
    } catch {
      toast.error("خطا در تغییر رمز عبور");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          مدیریت کاربران
        </h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              افزودن کاربر جدید
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>افزودن کاربر جدید</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">نام و نام خانوادگی *</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="نام کامل"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">ایمیل *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="example@email.com"
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">رمز عبور *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="حداقل ۶ کاراکتر"
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">شماره تلفن</Label>
                <Input
                  id="phone"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="09xxxxxxxxx"
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <div className="space-y-2">
                <Label>نقش</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">مدیر</SelectItem>
                    <SelectItem value="STUDENT">دانش‌آموز</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full gap-2"
                onClick={createUser}
                disabled={creating}
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    در حال ایجاد...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    ایجاد کاربر
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reset Password Dialog */}
      <Dialog
        open={resetUser !== null}
        onOpenChange={(open) => {
          if (!open) closeResetDialog();
        }}
      >
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              تغییر رمز عبور کاربر
            </DialogTitle>
          </DialogHeader>
          {resetUser && (
            <div className="space-y-4 py-2">
              <div className="text-sm bg-muted/40 rounded-lg p-3 space-y-1">
                <div>
                  <span className="text-muted-foreground">نام: </span>
                  <span className="font-medium">{resetUser.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ایمیل: </span>
                  <span className="font-medium" dir="ltr">{resetUser.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resetPassword">رمز عبور جدید</Label>
                <Input
                  id="resetPassword"
                  type="password"
                  value={resetPasswordValue}
                  onChange={(e) => setResetPasswordValue(e.target.value)}
                  placeholder="حداقل ۶ کاراکتر"
                  dir="ltr"
                  className="text-left"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  این رمز جایگزین رمز قبلی کاربر می‌شود. کاربر می‌تواند بعداً از
                  صفحه پروفایل رمز خود را دوباره تغییر دهد.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={closeResetDialog}
                  disabled={resetting}
                >
                  انصراف
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={resetPassword}
                  disabled={resetting || resetPasswordValue.length < 6}
                >
                  {resetting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      در حال تغییر...
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" />
                      تغییر رمز
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                    <th className="text-right py-3 px-4 font-medium">جزوه‌ها</th>
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
                        {user._count.noteOrders}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openResetDialog(user)}
                            title="ریست رمز عبور"
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                          {user.role !== "ADMIN" && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteUser(user.id)}
                              className="text-destructive"
                              title="حذف کاربر"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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
