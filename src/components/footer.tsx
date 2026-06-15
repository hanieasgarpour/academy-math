import Link from "next/link";
import { GraduationCap, Phone, Mail, Monitor } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Academy Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">آکادمی ریاضی عرفان</span>
            </div>
            <p className="text-sm text-muted-foreground leading-7">
              آکادمی ریاضی عرفان با هدف آموزش با کیفیت ریاضی به دانش‌آموزان
              پایه‌های هفتم تا دوازدهم تأسیس شده است. ما با بهره‌گیری از
              بهترین اساتید و روش‌های تدریس نوین، مسیر یادگیری را برای شما
              هموار می‌کنیم.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-bold">دسترسی سریع</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                صفحه اصلی
              </Link>
              <Link
                href="/courses"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                دوره‌ها
              </Link>
              <Link
                href="/#about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                درباره ما
              </Link>
              <Link
                href="/#contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                تماس با ما
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-base font-bold">اطلاعات تماس</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span dir="ltr">۰۹۳۸۷۳۱۳۶۱۸</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span dir="ltr">ef.aghaeizadeh@gmail.com</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Monitor className="h-4 w-4 text-primary mt-0.5" />
                <span>تمامی کلاس‌ها به‌صورت آنلاین و در بستر اسکای‌روم با قلم نوری برگزار می‌شود</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © ۱۴۰۳ آکادمی ریاضی عرفان. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
