"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  GraduationCap,
  Monitor,
  Headphones,
  Menu,
  Phone,
  Mail,
  ExternalLink,
  Clock,
  User,
  Send,
  MapPin,
  ArrowUp,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

// --- Data ---
const navLinks = [
  { href: "#home", label: "خانه" },
  { href: "#classes", label: "کلاس‌ها" },
  { href: "#pricing", label: "شهریه و پرداخت" },
  { href: "#about", label: "درباره ما" },
  { href: "#contact", label: "تماس با ما" },
];

const classes = [
  {
    name: "ریاضی ششم",
    grade: "ششم",
    teacher: "دکتر باوفا",
    schedule: "شنبه‌ها - ساعت ۱۵:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/class-6",
    pricing: "basic",
  },
  {
    name: "ریاضی هفتم",
    grade: "هفتم",
    teacher: "دکتر باوفا",
    schedule: "یکشنبه‌ها - ساعت ۱۶:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/class-7",
    pricing: "basic",
  },
  {
    name: "ریاضی هشتم",
    grade: "هشتم",
    teacher: "استاد آقایی‌زاده",
    schedule: "دوشنبه‌ها - ساعت ۱۶:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/class-8",
    pricing: "basic",
  },
  {
    name: "ریاضی نهم",
    grade: "نهم",
    teacher: "استاد آقایی‌زاده",
    schedule: "سه‌شنبه‌ها - ساعت ۱۶:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/class-9",
    pricing: "basic",
  },
  {
    name: "ریاضی دهم",
    grade: "دهم",
    teacher: "استاد آقایی‌زاده",
    schedule: "چهارشنبه‌ها - ساعت ۱۷:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/class-10",
    pricing: "advanced",
  },
  {
    name: "ریاضی یازدهم",
    grade: "یازدهم",
    teacher: "استاد آقایی‌زاده",
    schedule: "پنجشنبه‌ها - ساعت ۱۷:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/class-11",
    pricing: "advanced",
  },
  {
    name: "ریاضی دوازدهم",
    grade: "دوازدهم",
    teacher: "استاد آقایی‌زاده",
    schedule: "شنبه‌ها - ساعت ۱۸:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/class-12",
    pricing: "advanced",
  },
  {
    name: "کنکور ریاضی",
    grade: "کنکور",
    teacher: "استاد آقایی‌زاده",
    schedule: "چهارشنبه‌ها - ساعت ۱۸:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/konkur",
    pricing: "advanced",
  },
];

const features = [
  {
    icon: Calculator,
    title: "تخصصی ریاضی",
    description:
      "تمام تمرکز ما بر روی آموزش تخصصی ریاضی است. از پایه تا پیشرفته، هر مبحث با دقت و وسواس تدریس می‌شود.",
  },
  {
    icon: Monitor,
    title: "کلاس‌های آنلاین",
    description:
      "کلاس‌ها به صورت زنده و تعاملی در پلتفرم SkyRoom برگزار می‌شوند. از هر کجای ایران همراه ما باشید.",
  },
  {
    icon: GraduationCap,
    title: "اساتید مجرب",
    description:
      "تیم تدریس ما از اساتید باتجربه و متخصص تشکیل شده که با روش‌های نوین، مفاهیم پیچیده را ساده می‌کنند.",
  },
  {
    icon: Headphones,
    title: "پشتیبانی مستمر",
    description:
      "شما در مسیر یادگیری تنها نیستید. پشتیبانی و پاسخگویی به سوالات دانش‌آموزان در تمام ایام هفته فعال است.",
  },
];

const mathSymbols = [
  { symbol: "∑", top: "10%", left: "5%", size: "text-4xl", delay: 0 },
  { symbol: "∫", top: "20%", left: "85%", size: "text-5xl", delay: 1 },
  { symbol: "π", top: "60%", left: "10%", size: "text-3xl", delay: 2 },
  { symbol: "√", top: "70%", left: "80%", size: "text-4xl", delay: 0.5 },
  { symbol: "∞", top: "40%", left: "90%", size: "text-5xl", delay: 1.5 },
  { symbol: "Δ", top: "80%", left: "15%", size: "text-3xl", delay: 2.5 },
  { symbol: "λ", top: "30%", left: "75%", size: "text-4xl", delay: 0.8 },
  { symbol: "θ", top: "55%", left: "5%", size: "text-3xl", delay: 1.8 },
  { symbol: "α", top: "15%", left: "45%", size: "text-2xl", delay: 3 },
  { symbol: "÷", top: "85%", left: "50%", size: "text-3xl", delay: 0.3 },
];

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// --- Sub-Components ---

function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-emerald-200/50 bg-white/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Calculator className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-emerald-800">
            آکادمی ریاضی
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 hover:text-emerald-900"
            >
              {link.label}
            </a>
          ))}
          <a href="#classes">
            <Button className="mr-2 bg-emerald-600 text-white hover:bg-emerald-700">
              ورود به کلاس
            </Button>
          </a>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-emerald-700">
                <Menu className="h-6 w-6" />
                <span className="sr-only">منو</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-emerald-800">
                  <Calculator className="h-5 w-5" />
                  آکادمی ریاضی
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 px-4 pt-4">
                {navLinks.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <a
                      href={link.href}
                      className="rounded-md px-4 py-3 text-base font-medium text-emerald-700 transition-colors hover:bg-emerald-50 hover:text-emerald-900"
                    >
                      {link.label}
                    </a>
                  </SheetClose>
                ))}
                <Separator className="my-2" />
                <SheetClose asChild>
                  <a href="#classes">
                    <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                      ورود به کلاس
                    </Button>
                  </a>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section
      id="home"
      className="hero-gradient relative min-h-[85vh] overflow-hidden flex items-center"
    >
      {/* Floating Math Symbols */}
      {mathSymbols.map((item, i) => (
        <motion.span
          key={i}
          className="math-symbol-lg pointer-events-none select-none"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size === "text-2xl" ? "1.5rem" : item.size === "text-3xl" ? "1.875rem" : item.size === "text-4xl" ? "2.25rem" : "3rem",
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {item.symbol}
        </motion.span>
      ))}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30 text-sm px-4 py-1.5 hover:bg-white/30">
              🎓 آموزش آنلاین در SkyRoom
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 text-4xl font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            آکادمی تخصصی ریاضی
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mb-4 max-w-2xl text-lg text-emerald-100 sm:text-xl md:text-2xl"
          >
            یادگیری ریاضی به روشی نوین، آنلاین و تعاملی
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mx-auto mb-10 max-w-xl text-base text-emerald-200/80 sm:text-lg"
          >
            کلاس‌های زنده و تعاملی با بهترین اساتید در پلتفرم SkyRoom
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a href="#classes">
              <Button
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg font-bold shadow-lg shadow-emerald-900/20"
              >
                مشاهده کلاس‌ها
              </Button>
            </a>
            <a href="#about">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/40 bg-transparent text-white hover:bg-white/10 px-8 py-6 text-lg font-bold"
              >
                درباره ما
              </Button>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}

function ClassesSection() {
  return (
    <section id="classes" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
            کلاس‌ها
          </Badge>
          <h2 className="mb-4 text-3xl font-extrabold text-emerald-900 sm:text-4xl">
            کلاس‌های آموزشی
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            کلاس‌های تخصصی ریاضی برای تمام مقاطع تحصیلی با اساتید مجرب
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {classes.map((cls, index) => (
            <motion.div key={index} variants={fadeInUp} transition={{ duration: 0.5 }}>
              <Card className="card-hover h-full border-emerald-100 bg-white">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-bold text-emerald-800">
                      {cls.name}
                    </CardTitle>
                    <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
                      {cls.grade}
                    </Badge>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    کلاس تخصصی {cls.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4 text-emerald-600" />
                    <span>{cls.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    <span>{cls.schedule}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <a
                    href={cls.skyroomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 gap-2">
                      <ExternalLink className="h-4 w-4" />
                      ورود به کلاس
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-20 bg-emerald-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
            ویژگی‌ها
          </Badge>
          <h2 className="mb-4 text-3xl font-extrabold text-emerald-900 sm:text-4xl">
            چرا آکادمی ریاضی؟
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            دلایلی که ما را از سایر مراکز آموزشی متمایز می‌کند
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <Card className="card-hover h-full border-emerald-100 bg-white text-center">
                <CardContent className="pt-8 pb-6 flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-800">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PricingSection() {
  const pricingPlans = [
    {
      title: "پایه متوسطه اول",
      subtitle: "ششم تا نهم",
      price: "۶۵۰,۰۰۰",
      priceNote: "تومان ماهیانه",
      period: "مرداد تا اسفند ۱۴۰۴",
      totalMonths: 8,
      totalPrice: "5,200,000",
      features: [
        "ریاضی ششم - دکتر باوفا",
        "ریاضی هفتم - دکتر باوفا",
        "ریاضی هشتم - استاد آقایی‌زاده",
        "ریاضی نهم - استاد آقایی‌زاده",
        "کلاس‌های زنده در SkyRoom",
        "پشتیبانی و پاسخگویی",
        "جزوه و تمرین",
      ],
      popular: false,
      paymentUrl: "#payment-basic",
    },
    {
      title: "پایه متوسطه دوم",
      subtitle: "دهم تا کنکور",
      price: "۸۰۰,۰۰۰",
      priceNote: "تومان ماهیانه",
      period: "مرداد تا اسفند ۱۴۰۴",
      totalMonths: 8,
      totalPrice: "6,400,000",
      features: [
        "ریاضی دهم - استاد آقایی‌زاده",
        "ریاضی یازدهم - استاد آقایی‌زاده",
        "ریاضی دوازدهم - استاد آقایی‌زاده",
        "کنکور ریاضی - استاد آقایی‌زاده",
        "کلاس‌های زنده در SkyRoom",
        "پشتیبانی و پاسخگویی",
        "جزوه و تمرین تخصصی کنکور",
      ],
      popular: true,
      paymentUrl: "#payment-advanced",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-emerald-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
            شهریه و پرداخت
          </Badge>
          <h2 className="mb-4 text-3xl font-extrabold text-emerald-900 sm:text-4xl">
            شهریه دوره‌های آموزشی
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            هزینه شهریه از مرداد ماه تا پایان اسفند ۱۴۰۴ (۸ ماه) محاسبه می‌شود
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div key={index} variants={fadeInUp} transition={{ duration: 0.5 }}>
              <Card
                className={`card-hover h-full relative overflow-hidden ${
                  plan.popular
                    ? "border-2 border-amber-400 shadow-lg shadow-amber-100"
                    : "border-emerald-100"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-amber-400 text-center py-1.5">
                    <span className="text-sm font-bold text-amber-900">
                      پرفروش‌ترین
                    </span>
                  </div>
                )}
                <CardHeader className={plan.popular ? "pt-10" : ""}>
                  <div className="text-center">
                    <CardTitle className="text-2xl font-extrabold text-emerald-800">
                      {plan.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.subtitle}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price */}
                  <div className="text-center bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-extrabold text-emerald-700">
                        {plan.price}
                      </span>
                      <span className="text-sm text-emerald-600">
                        {plan.priceNote}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      دوره {plan.period} ({plan.totalMonths} ماه)
                    </p>
                    <Separator className="my-3 bg-emerald-200" />
                    <p className="text-sm text-emerald-700">
                      مجموع دوره: <span className="font-bold">{plan.totalPrice}</span> تومان
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Payment Button */}
                  <a href={plan.paymentUrl} className="block">
                    <Button
                      className={`w-full gap-2 py-6 text-base font-bold ${
                        plan.popular
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      <CreditCard className="h-5 w-5" />
                      پرداخت آنلاین شهریه
                    </Button>
                  </a>

                  <p className="text-xs text-center text-muted-foreground">
                    پرداخت امن از طریق درگاه بانکی
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Payment Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-amber-800 mb-2">
                  نکات مهم پرداخت
                </h4>
                <ul className="text-sm text-amber-700 space-y-1.5 list-disc list-inside">
                  <li>شهریه به صورت ماهیانه از مرداد تا اسفند ۱۴۰۴ محاسبه می‌شود</li>
                  <li>پرداخت از طریق درگاه امن بانکی انجام می‌شود</li>
                  <li>در صورت پرداخت یک‌جای کل دوره، تخفیف ویژه اعمال می‌شود</li>
                  <li>برای اطلاعات بیشتر درباره تخفیف پرداخت یک‌جا با ما تماس بگیرید</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder - no actual submission
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
            تماس
          </Badge>
          <h2 className="mb-4 text-3xl font-extrabold text-emerald-900 sm:text-4xl">
            تماس با ما
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            سوالی دارید؟ با ما در ارتباط باشید
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <Card className="border-emerald-100 bg-emerald-50/50">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      تلفن تماس
                    </p>
                    <p className="text-lg font-bold text-emerald-800" dir="ltr">
                      +۹۸ ۹۳۸ ۷۳۱ ۳۶۱۸
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <Card className="border-emerald-100 bg-emerald-50/50">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      ایمیل
                    </p>
                    <p className="text-lg font-bold text-emerald-800" dir="ltr">
                      ef.aghaeizadeh@gmail.com
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <Card className="border-emerald-100 bg-emerald-50/50">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      اینستاگرام و تلگرام
                    </p>
                    <p className="text-lg font-bold text-emerald-800" dir="ltr">
                      @academy_math
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      آدرس
                    </p>
                    <p className="text-lg font-bold text-amber-800">
                      🔔 تمام کلاس‌ها به صورت آنلاین برگزار می‌شوند
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-emerald-100">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-emerald-800">
                  پیام خود را ارسال کنید
                </CardTitle>
                <CardDescription>
                  فرم زیر را پر کنید، در اسرع وقت با شما تماس می‌گیریم.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-emerald-800">
                      نام و نام خانوادگی
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="نام خود را وارد کنید"
                      value={formData.name}
                      onChange={handleChange}
                      className="border-emerald-200 focus-visible:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-emerald-800">
                      ایمیل
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-emerald-200 focus-visible:ring-emerald-500"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-emerald-800">
                      پیام
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="پیام خود را بنویسید..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="border-emerald-200 focus-visible:ring-emerald-500 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700 gap-2 py-5"
                  >
                    <Send className="h-4 w-4" />
                    ارسال پیام
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-emerald-900 text-emerald-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Calculator className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">
                آکادمی ریاضی
              </span>
            </div>
            <p className="text-sm leading-relaxed text-emerald-300">
              آکادمی تخصصی ریاضی با هدف آموزش نوین و تعاملی ریاضیات به
              دانش‌آموزان سراسر ایران فعالیت می‌کند.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">دسترسی سریع</h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-emerald-300 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">اطلاعات تماس</h3>
            <div className="space-y-2 text-sm text-emerald-300">
              <p dir="ltr" className="text-right">
                📞 +۹۸ ۹۳۸ ۷۳۱ ۳۶۱۸
              </p>
              <p dir="ltr" className="text-right">
                ✉️ ef.aghaeizadeh@gmail.com
              </p>
              <p>📱 @academy_math</p>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-emerald-700" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-emerald-400">
            © ۱۴۰۴ آکادمی ریاضی. تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-emerald-400 transition-colors hover:text-white"
              aria-label="اینستاگرام"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-emerald-400 transition-colors hover:text-white"
              aria-label="تلگرام"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    if (window.scrollY > 400) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", toggleVisible);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.8,
      }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <a href="#home">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700"
          aria-label="بازگشت به بالا"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </a>
    </motion.div>
  );
}

// --- Main Page ---
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ClassesSection />
        <PricingSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
