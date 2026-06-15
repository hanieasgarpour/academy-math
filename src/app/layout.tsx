import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/auth-provider";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "آکادمی ریاضی عرفان",
  description: "آموزش آنلاین ریاضی با بهترین اساتید - از پایه تا پیشرفته",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} font-sans antialiased bg-background text-foreground`}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" dir="rtl" />
        </AuthProvider>
      </body>
    </html>
  );
}
