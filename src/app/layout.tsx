import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "آکادمی ریاضی عرفان | آموزش تخصصی ریاضی آنلاین",
  description:
    "آکادمی ریاضی عرفان - یادگیری ریاضی به روشی نوین، آنلاین و تعاملی با استفاده از پلتفرم SkyRoom. کلاس‌های ریاضی مقاطع متوسطه و کنکور با اساتید برتر.",
  keywords: [
    "آکادمی ریاضی عرفان",
    "آموزش ریاضی",
    "کلاس آنلاین ریاضی",
    "SkyRoom",
    "ریاضی متوسطه",
    "کنکور ریاضی",
    "آقایی‌زاده",
    "قلمچی",
  ],
  authors: [{ name: "آکادمی ریاضی عرفان" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "آکادمی ریاضی عرفان | آموزش تخصصی ریاضی آنلاین",
    description:
      "یادگیری ریاضی به روشی نوین، آنلاین و تعاملی با اساتید مجرب",
    type: "website",
    locale: "fa_IR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} antialiased bg-background text-foreground font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
