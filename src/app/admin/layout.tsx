import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ShoppingCart,
  CreditCard,
  GraduationCap,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/courses", label: "دوره‌ها", icon: BookOpen },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-l bg-muted/30">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold">پنل مدیریت</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            بازگشت به سایت
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b flex items-center px-4 gap-4 bg-background">
          <div className="lg:hidden">
            <MobileSidebar />
          </div>
          <div className="text-sm text-muted-foreground">
            پنل مدیریت آکادمی ریاضی ارفعان
          </div>
          <div className="mr-auto text-sm">
            {session.user.name}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function MobileSidebar() {
  return (
    <div className="flex items-center gap-2">
      {sidebarLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Icon className="h-4 w-4" />
          </Link>
        );
      })}
    </div>
  );
}
