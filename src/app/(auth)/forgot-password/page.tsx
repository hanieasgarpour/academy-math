"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, KeyRound, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) {
      toast.error("شماره تلفن را وارد کنید");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("کد تأیید ارسال شد");
        setStep(2);
        if (data.devCode) {
          setDevCode(data.devCode);
        }
      } else {
        toast.error(data.error || "خطا در ارسال کد");
      }
    } catch {
      toast.error("خطا در ارسال کد تأیید");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!code || !newPassword) {
      toast.error("تمام فیلدها را پر کنید");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("رمز عبور و تکرار آن یکسان نیست");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("رمز عبور تغییر کرد");
        router.push("/login");
      } else {
        toast.error(data.error || "خطا در تغییر رمز عبور");
      }
    } catch {
      toast.error("خطا در تغییر رمز عبور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-orange-50 via-white to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
          </Link>
          <CardTitle className="text-xl">فراموشی رمز عبور</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 1
              ? "شماره تلفنی که با آن ثبت‌نام کرده‌اید را وارد کنید"
              : "کد تأیید ارسال شده و رمز عبور جدید را وارد کنید"}
          </p>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">شماره تلفن</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <KeyRound className="h-4 w-4" />
                {loading ? "در حال ارسال..." : "ارسال کد تأیید"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {devCode && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 text-center">
                  کد تأیید (محیط توسعه): <strong dir="ltr">{devCode}</strong>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="code">کد تأیید</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="کد ۵ رقمی"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  dir="ltr"
                  className="text-left text-center text-lg tracking-widest"
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">رمز عبور جدید</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="حداقل ۶ کاراکتر"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="رمز عبور جدید را تکرار کنید"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "در حال تغییر..." : "تغییر رمز عبور"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full gap-2"
                onClick={() => setStep(1)}
              >
                <ArrowRight className="h-4 w-4" />
                بازگشت و ارسال مجدد کد
              </Button>
            </form>
          )}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            رمز عبورتان را به یاد دارید؟{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              وارد شوید
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
