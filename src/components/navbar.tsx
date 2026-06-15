"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  GraduationCap,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "خانه" },
  { href: "/courses", label: "دوره‌ها" },
  { href: "/#about", label: "درباره ما" },
  { href: "/#contact", label: "تماس با ما" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold hidden sm:inline-block">
            آکادمی ریاضی عرفان
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {status === "authenticated" && session?.user ? (
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">
                    {session.user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {session.user.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="gap-2">
                      <Shield className="h-4 w-4" />
                      پنل مدیریت
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    داشبورد
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="gap-2">
                    <User className="h-4 w-4" />
                    پروفایل
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="gap-2 text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  ورود
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">ثبت‌نام</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="باز کردن منو">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <SheetTitle className="text-base">
                  آکادمی ریاضی عرفان
                </SheetTitle>
                <SheetDescription className="sr-only">
                  منوی ناوبری موبایل
                </SheetDescription>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col p-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent transition-colors py-2.5 px-3 rounded-md"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Auth Section */}
              <div className="border-t p-4 mt-auto">
                {status === "authenticated" && session?.user ? (
                  <div className="flex flex-col gap-1">
                    <div className="px-3 py-2 text-sm font-medium border-b mb-2">
                      {session.user.name}
                    </div>
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent py-2.5 px-3 rounded-md"
                      >
                        <Shield className="h-4 w-4" />
                        پنل مدیریت
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent py-2.5 px-3 rounded-md"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      داشبورد
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent py-2.5 px-3 rounded-md"
                    >
                      <User className="h-4 w-4" />
                      پروفایل
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 hover:bg-destructive/10 py-2.5 px-3 rounded-md w-full text-right"
                    >
                      <LogOut className="h-4 w-4" />
                      خروج
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full">
                        ورود
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)}>
                      <Button className="w-full">ثبت‌نام</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
