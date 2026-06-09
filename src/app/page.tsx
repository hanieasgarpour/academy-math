"use client";

import { useState, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ShoppingCart,
  X,
  LogIn,
  LogOut,
  UserPlus,
  Play,
  BookOpen,
  Package,
  Video,
  FileText,
  ChevronDown,
  Star,
  Award,
  Briefcase,
  BookMarked,
  Shield,
  Home,
  Users,
  Trash2,
  Eye,
  Download,
  Calendar,
  Info,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Sheet removed - using custom mobile menu for RTL compatibility
import {
  useAppStore,
  type PageView,
  type CartItem,
  type PurchasedItem,
} from "@/store/use-store";
import { useToast } from "@/hooks/use-toast";

// --- Data ---
const ACADEMY_NAME = "آکادمی ریاضی عرفان";

const navLinks: { href: PageView; label: string; icon: typeof Home }[] = [
  { href: "home", label: "خانه", icon: Home },
  { href: "classes", label: "کلاس‌ها", icon: GraduationCap },
  { href: "products", label: "محصولات", icon: Package },
  { href: "free-videos", label: "ویدیوهای رایگان", icon: Video },
  { href: "booklets", label: "جزوه‌ها", icon: FileText },
  { href: "about", label: "درباره ما", icon: Info },
  { href: "contact", label: "تماس با ما", icon: Phone },
];

const classes = [
  {
    id: "class-6",
    name: "ریاضی ششم",
    grade: "ششم",
    teacher: "دکتر باوفا",
    schedule: "شنبه‌ها - ساعت ۱۵:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/class-6",
    pricing: "basic",
  },
  {
    id: "class-7",
    name: "ریاضی هفتم",
    grade: "هفتم",
    teacher: "دکتر باوفا",
    schedule: "یکشنبه‌ها - ساعت ۱۶:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/class-7",
    pricing: "basic",
  },
  {
    id: "class-8",
    name: "ریاضی هشتم",
    grade: "هشتم",
    teacher: "استاد آقایی‌زاده",
    schedule: "دوشنبه‌ها - ساعت ۱۶:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/class-8",
    pricing: "basic",
  },
  {
    id: "class-9",
    name: "ریاضی نهم",
    grade: "نهم",
    teacher: "استاد آقایی‌زاده",
    schedule: "سه‌شنبه‌ها - ساعت ۱۶:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/class-9",
    pricing: "basic",
  },
  {
    id: "class-10",
    name: "ریاضی دهم",
    grade: "دهم",
    teacher: "استاد آقایی‌زاده",
    schedule: "چهارشنبه‌ها - ساعت ۱۷:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/class-10",
    pricing: "advanced",
  },
  {
    id: "class-11",
    name: "ریاضی یازدهم",
    grade: "یازدهم",
    teacher: "استاد آقایی‌زاده",
    schedule: "پنجشنبه‌ها - ساعت ۱۷:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/class-11",
    pricing: "advanced",
  },
  {
    id: "class-12",
    name: "ریاضی دوازدهم",
    grade: "دوازدهم",
    teacher: "استاد آقایی‌زاده",
    schedule: "شنبه‌ها - ساعت ۱۸:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/class-12",
    pricing: "advanced",
  },
  {
    id: "class-konkur",
    name: "کنکور ریاضی",
    grade: "کنکور",
    teacher: "استاد آقایی‌زاده",
    schedule: "چهارشنبه‌ها - ساعت ۱۸:۰۰",
    skyroomUrl: "https://www.skyroom.online/ch/academy-math/konkur",
    pricing: "advanced",
  },
];

const videoPackages = [
  {
    id: "vp-6",
    name: "پکیج ویدیویی ریاضی ششم",
    grade: "ششم",
    price: 1500000,
    priceLabel: "۱,۵۰۰,۰۰۰",
    description:
      "شامل تمام مباحث ریاضی پایه ششم به صورت ویدیویی با تدریس استاد آقایی‌زاده. این پکیج شامل حل تمرین‌ها، مثال‌های کنکوری و نکات کلیدی امتحانی است.",
    lessons: 48,
    hours: 36,
    teacher: "دکتر باوفا",
  },
  {
    id: "vp-9",
    name: "پکیج ویدیویی ریاضی نهم",
    grade: "نهم",
    price: 1800000,
    priceLabel: "۱,۸۰۰,۰۰۰",
    description:
      "شامل تمام مباحث ریاضی پایه نهم به صورت ویدیویی با تدریس استاد آقایی‌زاده. پوشش کامل فصول کتاب درسی همراه با تست‌های کنکوری و نکات ویژه.",
    lessons: 56,
    hours: 42,
    teacher: "استاد آقایی‌زاده",
  },
];

const booklets = [
  {
    id: "bl-6",
    name: "جزوه ریاضی ششم",
    grade: "ششم",
    price: 250000,
    priceLabel: "۲۵۰,۰۰۰",
    description: "جزوه جامع ریاضی ششم شامل خلاصه مباحث، فرمول‌ها و نمونه سوال",
    pages: 120,
  },
  {
    id: "bl-7",
    name: "جزوه ریاضی هفتم",
    grade: "هفتم",
    price: 250000,
    priceLabel: "۲۵۰,۰۰۰",
    description: "جزوه جامع ریاضی هفتم شامل خلاصه مباحث، فرمول‌ها و نمونه سوال",
    pages: 130,
  },
  {
    id: "bl-8",
    name: "جزوه ریاضی هشتم",
    grade: "هشتم",
    price: 300000,
    priceLabel: "۳۰۰,۰۰۰",
    description: "جزوه جامع ریاضی هشتم شامل خلاصه مباحث، فرمول‌ها و نمونه سوال",
    pages: 140,
  },
  {
    id: "bl-9",
    name: "جزوه ریاضی نهم",
    grade: "نهم",
    price: 300000,
    priceLabel: "۳۰۰,۰۰۰",
    description: "جزوه جامع ریاضی نهم شامل خلاصه مباحث، فرمول‌ها و نمونه سوال",
    pages: 150,
  },
  {
    id: "bl-10",
    name: "جزوه ریاضی دهم",
    grade: "دهم",
    price: 350000,
    priceLabel: "۳۵۰,۰۰۰",
    description: "جزوه جامع ریاضی دهم شامل خلاصه مباحث، فرمول‌ها و تست‌های کنکوری",
    pages: 180,
  },
  {
    id: "bl-11",
    name: "جزوه ریاضی یازدهم",
    grade: "یازدهم",
    price: 350000,
    priceLabel: "۳۵۰,۰۰۰",
    description: "جزوه جامع ریاضی یازدهم شامل خلاصه مباحث، فرمول‌ها و تست‌های کنکوری",
    pages: 190,
  },
  {
    id: "bl-12",
    name: "جزوه ریاضی دوازدهم",
    grade: "دوازدهم",
    price: 400000,
    priceLabel: "۴۰۰,۰۰۰",
    description: "جزوه جامع ریاضی دوازدهم شامل خلاصه مباحث، فرمول‌ها و تست‌های کنکوری",
    pages: 210,
  },
  {
    id: "bl-konkur",
    name: "جزوه ویژه کنکور",
    grade: "کنکور",
    price: 500000,
    priceLabel: "۵۰۰,۰۰۰",
    description: "جزوه ویژه آمادگی کنکور شامل تست‌های طبقه‌بندی شده و نکات طلایی",
    pages: 250,
  },
];

const freeVideos = [
  {
    id: "fv-1",
    title: "آموزش رایگان فصل اول ریاضی نهم",
    description: "تدریس رایگان فصل اول ریاضی نهم - اعداد صحیح",
    youtubeUrl: "https://www.youtube.com/watch?v=example1",
    grade: "نهم",
    duration: "۴۵ دقیقه",
  },
  {
    id: "fv-2",
    title: "آموزش رایگان فصل دوم ریاضی نهم",
    description: "تدریس رایگان فصل دوم ریاضی نهم - نسبت و تناسب",
    youtubeUrl: "https://www.youtube.com/watch?v=example2",
    grade: "نهم",
    duration: "۵۰ دقیقه",
  },
  {
    id: "fv-3",
    title: "حل تست‌های کنکور ریاضی - جبر و تابع",
    description: "حل تست‌های کنکور سال‌های گذشته در مبحث جبر و تابع",
    youtubeUrl: "https://www.youtube.com/watch?v=example3",
    grade: "کنکور",
    duration: "۶۰ دقیقه",
  },
  {
    id: "fv-4",
    title: "آموزش رایگان هندسه تحلیلی دهم",
    description: "مبحث فاصله و میان‌نقطه در هندسه تحلیلی",
    youtubeUrl: "https://www.youtube.com/watch?v=example4",
    grade: "دهم",
    duration: "۴۰ دقیقه",
  },
  {
    id: "fv-5",
    title: "نکات طلایی مثلثات یازدهم",
    description: "خلاصه نکات مهم مثلثات پایه یازدهم",
    youtubeUrl: "https://www.youtube.com/watch?v=example5",
    grade: "یازدهم",
    duration: "۳۵ دقیقه",
  },
  {
    id: "fv-6",
    title: "مرور سریع حسابان دوازدهم",
    description: "مرور مهم‌ترین فرمول‌ها و نکات حسابان دوازدهم",
    youtubeUrl: "https://www.youtube.com/watch?v=example6",
    grade: "دوازدهم",
    duration: "۵۵ دقیقه",
  },
];

const terms = [
  {
    id: "summer",
    name: "ترم تابستانه",
    period: "۲۰ تیر تا ۲۰ شهریور",
    months: 2,
  },
  {
    id: "winter",
    name: "ترم زمستانه",
    period: "۱۸ مهر تا ۲۰ اردیبهشت",
    months: 7,
  },
];

const pricing = {
  basic: { monthly: 650000, monthlyLabel: "۶۵۰,۰۰۰" },
  advanced: { monthly: 800000, monthlyLabel: "۸۰۰,۰۰۰" },
};

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

// --- Helper: Format number ---
function formatPrice(num: number): string {
  return num.toLocaleString("fa-IR");
}

// --- Navbar ---
function Navbar() {
  const { currentPage, setCurrentPage, user, logout, cart, setShowLoginModal } =
    useAppStore();
  const { toast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    toast({
      title: "خروج موفق",
      description: "با موفقیت خارج شدید",
    });
  };

  const handleNavClick = (page: PageView) => {
    setCurrentPage(page);
    setMobileOpen(false);
  };

  return (
    <>
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-orange-200/50 bg-white/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <button
          onClick={() => setCurrentPage("home")}
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600 text-white">
            <Calculator className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-orange-800 sm:text-xl">
            {ACADEMY_NAME}
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => setCurrentPage(link.href as PageView)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                currentPage === link.href
                  ? "bg-orange-100 text-orange-900"
                  : "text-orange-700 hover:bg-orange-50 hover:text-orange-900"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <button
            onClick={() => setCurrentPage("cart")}
            className="relative rounded-md p-2 text-orange-700 hover:bg-orange-50"
          >
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {cart.length}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage("profile")}
                className="hidden items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50 sm:flex"
              >
                <User className="h-4 w-4" />
                {user.name}
                {user.role === "admin" && (
                  <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0 mr-1">ادمین</Badge>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="rounded-md p-2 text-orange-700 hover:bg-orange-50"
                title="خروج"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Button
              onClick={() => setShowLoginModal(true)}
              className="bg-orange-600 text-white hover:bg-orange-700 gap-1"
              size="sm"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">ورود / ثبت‌نام</span>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-orange-700"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
    <MobileMenu mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
    </>
  );
}

// --- Mobile Menu Portal (renders outside nav to avoid transform stacking context issues) ---
function MobileMenu({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (v: boolean) => void }) {
  const { currentPage, setCurrentPage, user, cart } = useAppStore();

  const handleNavClick = (page: PageView) => {
    setCurrentPage(page);
    setMobileOpen(false);
  };

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {mobileOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer Panel - slides from right in RTL */}
          <motion.div
            key="mobile-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 z-[9999] h-full w-72 bg-white shadow-2xl"
            dir="rtl"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-orange-100">
              <div className="flex items-center gap-2 text-orange-800 font-bold">
                <Calculator className="h-5 w-5" />
                {ACADEMY_NAME}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-orange-700 hover:bg-orange-50"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Drawer Content */}
            <div className="flex flex-col gap-1 p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href as PageView)}
                  className={`flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-colors ${
                    currentPage === link.href
                      ? "bg-orange-100 text-orange-900"
                      : "text-orange-700 hover:bg-orange-50"
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </button>
              ))}
              <Separator className="my-2" />
              <button
                onClick={() => handleNavClick("cart")}
                className="flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium text-orange-700 hover:bg-orange-50"
              >
                <ShoppingCart className="h-5 w-5" />
                سبد خرید
                {cart.length > 0 && (
                  <Badge className="bg-red-500 text-white mr-auto">
                    {cart.length}
                  </Badge>
                )}
              </button>
              {user && (
                <button
                  onClick={() => handleNavClick("profile")}
                  className="flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium text-orange-700 hover:bg-orange-50"
                >
                  <User className="h-5 w-5" />
                  <span>پروفایل ({user.name})</span>
                  {user.role === "admin" && (
                    <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0 mr-auto">ادمین</Badge>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

// --- Login Modal ---
function LoginModal() {
  const { showLoginModal, setShowLoginModal, login, setPendingAction } =
    useAppStore();
  const { toast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister && (!name || !email || !phone || !password)) return;
    if (!isRegister && (!email || !password)) return;

    // Check for admin login
    if (!isRegister && email === "admin@erfan.ir" && password === "admin123") {
      const adminUser = {
        id: "admin-1",
        name: "مدیر آکادمی",
        email: "admin@erfan.ir",
        phone: "09123456789",
        role: "admin" as const,
      };
      login(adminUser);
      toast({
        title: "ورود موفق",
        description: "به عنوان مدیر وارد شدید",
      });
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setPendingAction(null);
      return;
    }

    const user = {
      id: Date.now().toString(),
      name: name || email.split("@")[0],
      email,
      phone: phone || "",
      role: "user" as const,
    };
    login(user);
    toast({
      title: isRegister ? "ثبت‌نام موفق" : "ورود موفق",
      description: isRegister
        ? "حساب کاربری شما با موفقیت ایجاد شد"
        : "با موفقیت وارد حساب کاربری خود شدید",
    });
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");

    // Execute pending action after login
    setPendingAction(null);
  };

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-orange-800">
            {isRegister ? "ثبت‌نام" : "ورود"} به {ACADEMY_NAME}
          </DialogTitle>
          <DialogDescription>
            {isRegister
              ? "برای استفاده از خدمات سایت، ابتدا ثبت‌نام کنید"
              : "با حساب کاربری خود وارد شوید"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="reg-name" className="text-orange-800">
                نام و نام خانوادگی
              </Label>
              <Input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام خود را وارد کنید"
                className="border-orange-200 focus-visible:ring-orange-500"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="auth-email" className="text-orange-800">
              ایمیل
            </Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="border-orange-200 focus-visible:ring-orange-500"
              dir="ltr"
              required
            />
          </div>
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="reg-phone" className="text-orange-800">
                شماره تلفن
              </Label>
              <Input
                id="reg-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                className="border-orange-200 focus-visible:ring-orange-500"
                dir="ltr"
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="auth-password" className="text-orange-800">
              رمز عبور
            </Label>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور"
              className="border-orange-200 focus-visible:ring-orange-500"
              dir="ltr"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-orange-600 text-white hover:bg-orange-700 py-5"
          >
            {isRegister ? (
              <>
                <UserPlus className="h-4 w-4 ml-2" />
                ثبت‌نام
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 ml-2" />
                ورود
              </>
            )}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-orange-600 hover:text-orange-800 hover:underline"
            >
              {isRegister
                ? "حساب کاربری دارید؟ وارد شوید"
                : "حساب کاربری ندارید؟ ثبت‌نام کنید"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Hero Section ---
function HeroSection() {
  const { setCurrentPage } = useAppStore();

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
            fontSize:
              item.size === "text-2xl"
                ? "1.5rem"
                : item.size === "text-3xl"
                ? "1.875rem"
                : item.size === "text-4xl"
                ? "2.25rem"
                : "3rem",
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
              آموزش آنلاین در SkyRoom
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 text-4xl font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {ACADEMY_NAME}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mb-4 max-w-2xl text-lg text-orange-100 sm:text-xl md:text-2xl"
          >
            یادگیری ریاضی به روشی نوین، آنلاین و تعاملی
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mx-auto mb-10 max-w-xl text-base text-orange-200/80 sm:text-lg"
          >
            کلاس‌های زنده و تعاملی با بهترین اساتید در پلتفرم SkyRoom
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              onClick={() => setCurrentPage("classes")}
              size="lg"
              className="bg-white text-orange-700 hover:bg-orange-50 px-8 py-6 text-lg font-bold shadow-lg shadow-orange-900/20"
            >
              مشاهده کلاس‌ها
            </Button>
            <Button
              onClick={() => setCurrentPage("products")}
              size="lg"
              variant="outline"
              className="border-2 border-white/40 bg-transparent text-white hover:bg-white/10 px-8 py-6 text-lg font-bold"
            >
              فروشگاه محصولات
            </Button>
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

// --- Features Section ---
function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
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
          <h2 className="mb-4 text-3xl font-extrabold text-orange-900 sm:text-4xl">
            چرا {ACADEMY_NAME}؟
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
              <Card className="card-hover h-full border-orange-100 bg-white text-center">
                <CardContent className="pt-8 pb-6 flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-orange-800">
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

// --- Classes Page ---
function ClassesPage() {
  const { user, setShowLoginModal, addToCart, setPendingAction, purchases } =
    useAppStore();
  const { toast } = useToast();
  const [selectedTerm, setSelectedTerm] = useState<string>("summer");

  const handlePurchaseClass = (cls: (typeof classes)[0], paymentType: "monthly" | "term") => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const term = terms.find((t) => t.id === selectedTerm);
    const priceInfo = pricing[cls.pricing as "basic" | "advanced"];
    const price =
      paymentType === "monthly"
        ? priceInfo.monthly
        : priceInfo.monthly * (term?.months || 2);

    const cartItem: CartItem = {
      id: `${cls.id}-${paymentType}-${selectedTerm}`,
      name: `${cls.name} - ${paymentType === "monthly" ? "شهریه ماهیانه" : `شهریه ترم ${term?.name || ""}`}`,
      price,
      type: paymentType === "monthly" ? "class_monthly" : "class_term",
      grade: cls.grade,
      teacher: cls.teacher,
      term: term?.name,
    };
    addToCart(cartItem);
    toast({
      title: "اضافه شد به سبد خرید",
      description: `${cartItem.name} به سبد خرید اضافه شد`,
    });
  };

  const isPurchased = (classId: string) => {
    return purchases.some((p) => p.id.startsWith(classId) && p.type === "class");
  };

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
            کلاس‌ها
          </Badge>
          <h2 className="mb-4 text-3xl font-extrabold text-orange-900 sm:text-4xl">
            کلاس‌های آموزشی
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            کلاس‌های تخصصی ریاضی برای تمام مقاطع تحصیلی با اساتید مجرب
          </p>
        </motion.div>

        {/* Term Selection */}
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Label className="text-orange-800 font-bold">انتخاب ترم:</Label>
          <div className="flex gap-3">
            {terms.map((term) => (
              <button
                key={term.id}
                onClick={() => setSelectedTerm(term.id)}
                className={`rounded-xl px-6 py-3 text-sm font-bold transition-all ${
                  selectedTerm === term.id
                    ? "bg-orange-600 text-white shadow-lg"
                    : "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200"
                }`}
              >
                {term.name}
                <span className="block text-xs font-normal mt-0.5 opacity-80">
                  {term.period}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Classes Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {classes.map((cls, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <Card className="card-hover h-full border-orange-100 bg-white">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-bold text-orange-800">
                      {cls.name}
                    </CardTitle>
                    <Badge className="bg-orange-600 text-white hover:bg-orange-700">
                      {cls.grade}
                    </Badge>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    کلاس تخصصی {cls.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4 text-orange-600" />
                    <span>{cls.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span>
                      {terms.find((t) => t.id === selectedTerm)?.period}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="text-center bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <p className="text-sm text-muted-foreground">
                      شهریه ماهیانه:
                    </p>
                    <p className="text-lg font-bold text-orange-700">
                      {pricing[cls.pricing as "basic" | "advanced"].monthlyLabel}{" "}
                      تومان
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  {isPurchased(cls.id) ? (
                    <a
                      href={cls.skyroomUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-orange-600 text-white hover:bg-orange-700 gap-2">
                        <ExternalLink className="h-4 w-4" />
                        ورود به کلاس
                      </Button>
                    </a>
                  ) : (
                    <>
                      <Button
                        onClick={() => handlePurchaseClass(cls, "monthly")}
                        className="w-full bg-orange-600 text-white hover:bg-orange-700 gap-2"
                      >
                        <CreditCard className="h-4 w-4" />
                        خرید ماهیانه
                      </Button>
                      <Button
                        onClick={() => handlePurchaseClass(cls, "term")}
                        variant="outline"
                        className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        خرید ترمی
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Term Info */}
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
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-amber-800 mb-2">
                  اطلاعات ترم‌ها
                </h4>
                <ul className="text-sm text-amber-700 space-y-1.5">
                  <li>
                    ترم تابستانه: از ۲۰ تیر تا ۲۰ شهریور (۲ ماه) - پرداخت
                    ماهیانه یا یکجای ترم
                  </li>
                  <li>
                    ترم زمستانه: از ۱۸ مهر تا ۲۰ اردیبهشت (۷ ماه) - پرداخت
                    ماهیانه یا یکجای ترم
                  </li>
                  <li>
                    با خرید ماهیانه، لینک کلاس به مدت یک ماه در اختیار شما قرار
                    می‌گیرد
                  </li>
                  <li>
                    با خرید ترمی، لینک کلاس برای کل ترم در اختیار شما قرار
                    می‌گیرد
                  </li>
                  <li>
                    پایه متوسطه اول (ششم تا نهم): ۶۵۰,۰۰۰ تومان ماهیانه
                  </li>
                  <li>
                    پایه متوسطه دوم (دهم تا کنکور): ۸۰۰,۰۰۰ تومان ماهیانه
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// --- Products Page ---
function ProductsPage() {
  const { user, setShowLoginModal, addToCart } = useAppStore();
  const { toast } = useToast();

  const handleAddToCart = (item: CartItem) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    addToCart(item);
    toast({
      title: "اضافه شد به سبد خرید",
      description: `${item.name} به سبد خرید اضافه شد`,
    });
  };

  return (
    <section className="py-20 bg-orange-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100">
            محصولات
          </Badge>
          <h2 className="mb-4 text-3xl font-extrabold text-orange-900 sm:text-4xl">
            پکیج‌های ویدیویی آموزشی
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            پکیج‌های کامل ویدیویی ریاضی برای پایه‌های ششم و نهم با تدریس اساتید
            برتر
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto"
        >
          {videoPackages.map((pkg, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <Card className="card-hover h-full border-purple-100 bg-white overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-l from-purple-600 to-orange-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-white/20 text-white border-white/30">
                      پایه {pkg.grade}
                    </Badge>
                    <Package className="h-8 w-8 opacity-60" />
                  </div>
                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                </div>

                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <Video className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">تعداد درس</p>
                      <p className="font-bold text-purple-700">
                        {pkg.lessons} درس
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <Clock className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">مدت زمان</p>
                      <p className="font-bold text-orange-700">
                        {pkg.hours} ساعت
                      </p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3 text-center">
                      <User className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">استاد</p>
                      <p className="font-bold text-amber-700 text-xs">
                        {pkg.teacher}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <p className="text-3xl font-extrabold text-orange-700">
                      {pkg.priceLabel}
                    </p>
                    <p className="text-sm text-orange-600">تومان</p>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: pkg.id,
                        name: pkg.name,
                        price: pkg.price,
                        type: "video_package",
                        grade: pkg.grade,
                        teacher: pkg.teacher,
                      })
                    }
                    className="w-full bg-purple-600 text-white hover:bg-purple-700 gap-2 py-5"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    افزودن به سبد خرید
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 max-w-3xl mx-auto"
        >
          <Card className="border-purple-200 bg-purple-50/50">
            <CardContent className="flex items-start gap-4 pt-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500 text-white">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-purple-800 mb-2">
                  نکات مهم
                </h4>
                <ul className="text-sm text-purple-700 space-y-1.5">
                  <li>
                    پس از پرداخت موفق، لینک دانلود پکیج ویدیویی در اختیار شما
                    قرار می‌گیرد
                  </li>
                  <li>
                    پکیج‌ها شامل تمام مباحث کتاب درسی مربوطه هستند
                  </li>
                  <li>ویدیوها قابل دانلود و مشاهده آفلاین هستند</li>
                  <li>پشتیبانی و پاسخگویی به سوالات در خصوص مباحث پکیج</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// --- Free Videos Page ---
function FreeVideosPage() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <Badge className="mb-4 bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
            ویدیوهای رایگان
          </Badge>
          <h2 className="mb-4 text-3xl font-extrabold text-orange-900 sm:text-4xl">
            ویدیوهای آموزشی رایگان
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            مجموعه‌ای از ویدیوهای رایگان آموزش ریاضی در کانال یوتوب ما
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {freeVideos.map((video, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <Card className="card-hover h-full border-red-100 bg-white">
                {/* Thumbnail placeholder */}
                <div className="relative bg-gradient-to-bl from-red-500 to-orange-600 h-44 flex items-center justify-center rounded-t-lg">
                  <Play className="h-16 w-16 text-white/80" />
                  <Badge className="absolute top-3 right-3 bg-white/20 text-white border-white/30">
                    پایه {video.grade}
                  </Badge>
                  <span className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-orange-800">
                    {video.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {video.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full bg-red-600 text-white hover:bg-red-700 gap-2">
                      <ExternalLink className="h-4 w-4" />
                      تماشا در یوتوب
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* YouTube Channel CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white">
                <Video className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-red-800 mb-2">
                  کانال یوتوب {ACADEMY_NAME}
                </h4>
                <p className="text-sm text-red-700 mb-4">
                  برای مشاهده تمام ویدیوهای رایگان و جدید، به کانال یوتوب ما
                  بپیوندید. ویدیوهای آموزشی جدید هر هفته آپلود می‌شوند.
                </p>
                <a
                  href="https://www.youtube.com/@academy-math"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-red-600 text-white hover:bg-red-700 gap-2">
                    <ExternalLink className="h-4 w-4" />
                    ورود به کانال یوتوب
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// --- Booklets Page ---
function BookletsPage() {
  const { user, setShowLoginModal, addToCart } = useAppStore();
  const { toast } = useToast();
  const [selectedGrade, setSelectedGrade] = useState<string>("all");

  const filteredBooklets =
    selectedGrade === "all"
      ? booklets
      : booklets.filter((b) => b.grade === selectedGrade);

  const handleAddToCart = (item: CartItem) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    addToCart(item);
    toast({
      title: "اضافه شد به سبد خرید",
      description: `${item.name} به سبد خرید اضافه شد`,
    });
  };

  return (
    <section className="py-20 bg-orange-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
            جزوه‌ها
          </Badge>
          <h2 className="mb-4 text-3xl font-extrabold text-orange-900 sm:text-4xl">
            جزوه‌های طبقه‌بندی شده
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            جزوه‌های جامع ریاضی برای هر پایه تحصیلی با نکات کلیدی و نمونه سوال
          </p>
        </motion.div>

        {/* Grade Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedGrade("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedGrade === "all"
                ? "bg-orange-600 text-white"
                : "bg-white text-orange-700 border border-orange-200 hover:bg-orange-50"
            }`}
          >
            همه پایه‌ها
          </button>
          {["ششم", "هفتم", "هشتم", "نهم", "دهم", "یازدهم", "دوازدهم", "کنکور"].map(
            (grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedGrade === grade
                    ? "bg-orange-600 text-white"
                    : "bg-white text-orange-700 border border-orange-200 hover:bg-orange-50"
                }`}
              >
                پایه {grade}
              </button>
            )
          )}
        </div>

        {/* Booklets Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {filteredBooklets.map((booklet, index) => (
            <motion.div
              key={booklet.id}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <Card className="card-hover h-full border-orange-100 bg-white">
                {/* Booklet icon header */}
                <div className="bg-gradient-to-bl from-orange-500 to-orange-600 h-24 flex items-center justify-center rounded-t-lg">
                  <BookOpen className="h-10 w-10 text-white/80" />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-bold text-orange-800">
                      {booklet.name}
                    </CardTitle>
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                      {booklet.grade}
                    </Badge>
                  </div>
                  <CardDescription className="text-muted-foreground text-xs">
                    {booklet.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">تعداد صفحات:</span>
                    <span className="font-bold text-orange-700">
                      {booklet.pages} صفحه
                    </span>
                  </div>
                  <div className="text-center bg-orange-50 rounded-lg p-3 border border-orange-100">
                    <span className="text-xl font-bold text-orange-700">
                      {booklet.priceLabel}
                    </span>
                    <span className="text-sm text-orange-600 mr-1">تومان</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() =>
                      handleAddToCart({
                        id: booklet.id,
                        name: booklet.name,
                        price: booklet.price,
                        type: "booklet",
                        grade: booklet.grade,
                      })
                    }
                    className="w-full bg-orange-600 text-white hover:bg-orange-700 gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    افزودن به سبد خرید
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// --- Cart Page ---
function CartPage() {
  const { cart, removeFromCart, clearCart, user, setShowLoginModal, addPurchase } =
    useAppStore();
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "class_monthly":
        return "شهریه ماهیانه کلاس";
      case "class_term":
        return "شهریه ترمی کلاس";
      case "video_package":
        return "پکیج ویدیویی";
      case "booklet":
        return "جزوه";
      default:
        return type;
    }
  };

  const handleRemoveFromCart = (id: string, name: string) => {
    removeFromCart(id);
    toast({
      title: "حذف شد",
      description: `${name} از سبد خرید حذف شد`,
    });
  };

  const handleCheckout = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // Create purchased items from cart
    const now = new Date().toLocaleDateString("fa-IR");
    cart.forEach((item) => {
      let purchaseType: "class" | "video_package" | "booklet";
      let skyroomUrl: string | undefined;
      let downloadUrl: string | undefined;

      if (item.type === "class_monthly" || item.type === "class_term") {
        purchaseType = "class";
        // Find the matching class to get skyroomUrl
        const matchingClass = classes.find((cls) => item.id.startsWith(cls.id));
        skyroomUrl = matchingClass?.skyroomUrl;
      } else if (item.type === "video_package") {
        purchaseType = "video_package";
        downloadUrl = `https://academy-math.ir/download/${item.id}`;
      } else {
        purchaseType = "booklet";
        downloadUrl = `https://academy-math.ir/download/${item.id}`;
      }

      const purchase: PurchasedItem = {
        id: `purchase-${item.id}`,
        name: item.name,
        type: purchaseType,
        purchasedAt: now,
        ...(skyroomUrl && { skyroomUrl }),
        ...(downloadUrl && { downloadUrl }),
      };
      addPurchase(purchase);
    });

    // Clear cart after successful checkout
    clearCart();

    // Show success toast and dialog
    toast({
      title: "خرید موفق",
      description: "خرید شما با موفقیت انجام شد. از پروفایل می‌توانید به محصول دسترسی داشته باشید.",
    });
    setShowSuccessDialog(true);
  };

  if (cart.length === 0) {
    return (
      <section className="py-20 bg-white min-h-[60vh] flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <ShoppingCart className="h-20 w-20 text-orange-200 mx-auto mb-6" />
          <h2 className="mb-4 text-2xl font-bold text-orange-800">
            سبد خرید شما خالی است
          </h2>
          <p className="text-muted-foreground mb-8">
            برای خرید کلاس، پکیج ویدیویی یا جزوه، به صفحات مربوطه مراجعه کنید
          </p>
          <Button
            onClick={() => useAppStore.getState().setCurrentPage("classes")}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            مشاهده کلاس‌ها
          </Button>
        </div>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-orange-800 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-orange-600" />
                خرید با موفقیت انجام شد
              </DialogTitle>
              <DialogDescription>
                خرید شما با موفقیت تکمیل شد. از بخش پروفایل می‌توانید به کلاس‌ها و محصولات خریداری شده دسترسی داشته باشید.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => {
                  setShowSuccessDialog(false);
                  useAppStore.getState().setCurrentPage("profile");
                }}
                className="flex-1 bg-orange-600 text-white hover:bg-orange-700"
              >
                مشاهده خریدها
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSuccessDialog(false)}
                className="flex-1 border-orange-200 text-orange-700"
              >
                بستن
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200">
            سبد خرید
          </Badge>
          <h2 className="mb-4 text-3xl font-extrabold text-orange-900 sm:text-4xl">
            سبد خرید شما
          </h2>
        </motion.div>

        <div className="space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="border-orange-100">
              <CardContent className="flex items-center justify-between pt-6 gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-orange-800">{item.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="text-xs border-orange-200 text-orange-600"
                    >
                      {getTypeLabel(item.type)}
                    </Badge>
                    {item.grade && (
                      <Badge
                        variant="outline"
                        className="text-xs border-orange-200 text-orange-600"
                      >
                        پایه {item.grade}
                      </Badge>
                    )}
                    {item.teacher && (
                      <Badge
                        variant="outline"
                        className="text-xs border-orange-200 text-orange-600"
                      >
                        {item.teacher}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-orange-700">
                    {formatPrice(item.price)} تومان
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFromCart(item.id, item.name)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total & Checkout */}
        <Card className="mt-6 border-orange-200">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-orange-800">
                مجموع سبد خرید:
              </span>
              <span className="text-2xl font-extrabold text-orange-700">
                {formatPrice(total)} تومان
              </span>
            </div>
            <Separator />
            <div className="flex gap-3">
              <Button
                onClick={handleCheckout}
                className="flex-1 bg-orange-600 text-white hover:bg-orange-700 gap-2 py-6 text-base font-bold"
              >
                <CreditCard className="h-5 w-5" />
                پرداخت و تکمیل خرید
              </Button>
              <Button
                variant="outline"
                onClick={clearCart}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              پرداخت امن از طریق درگاه بانکی
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-orange-800 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-orange-600" />
              خرید با موفقیت انجام شد
            </DialogTitle>
            <DialogDescription>
              خرید شما با موفقیت تکمیل شد. از بخش پروفایل می‌توانید به کلاس‌ها و محصولات خریداری شده دسترسی داشته باشید.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                useAppStore.getState().setCurrentPage("profile");
              }}
              className="flex-1 bg-orange-600 text-white hover:bg-orange-700"
            >
              مشاهده خریدها
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSuccessDialog(false)}
              className="flex-1 border-orange-200 text-orange-700"
            >
              بستن
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

// --- About / Teacher Page ---
function AboutPage() {
  return (
    <section className="py-20 bg-white">
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
            درباره ما
          </Badge>
          <h2 className="mb-4 text-3xl font-extrabold text-orange-900 sm:text-4xl">
            درباره {ACADEMY_NAME}
          </h2>
        </motion.div>

        {/* Academy Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Card className="border-orange-100 overflow-hidden">
            <div className="bg-gradient-to-l from-orange-600 to-orange-600 p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">{ACADEMY_NAME}</h3>
              <p className="text-orange-100 leading-relaxed max-w-3xl">
                آکادمی ریاضی عرفان با هدف ارائه آموزش تخصصی و باکیفیت ریاضیات به
                دانش‌آموزان سراسر ایران تأسیس شده است. ما با بهره‌گیری از
                اساتید برتر کشور و پلتفرم آموزش آنلاین SkyRoom، کلاس‌های زنده و
                تعاملی را فراهم کرده‌ایم تا هر دانش‌آموزی از هر نقطه ایران بتواند
                از آموزش‌های تخصصی ریاضی بهره‌مند شود. تمرکز انحصاری ما بر روی
                ریاضی و به‌کارگیری روش‌های نوین تدریس، ما را از سایر مراکز
                آموزشی متمایز کرده است.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Main Teacher - Aghaeizadeh */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="border-amber-200 bg-amber-50/30 overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-bl from-amber-500 to-orange-600 text-white shrink-0">
                  <GraduationCap className="h-10 w-10" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-extrabold text-orange-800">
                    محمد حسن آقایی‌زاده
                  </CardTitle>
                  <p className="text-amber-700 font-medium mt-1">
                    بنیان‌گذار و استاد اصلی {ACADEMY_NAME}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <p className="text-muted-foreground leading-relaxed">
                استاد محمد حسن آقایی‌زاده از اساتید شناخته‌شده و برتر ریاضی در
                ایران هستند که سال‌ها سابقه تدریس در بهترین مدارس کشور اعم از
                مدارس دولتی، غیرانتفاعی و تیزهوشان را دارا هستند. ایشان معلم
                رسمی آموزش و پرورش بوده و به عنوان استاد برتر کانون فرهنگی آموزش
                قلم‌چی و خانه ریاضی شناخته می‌شوند. رزومه درخشان ایشان در زمینه
                آموزش ریاضی و آمادگی دانش‌آموزان برای کنکور، زبانزدی خاص و عام
                است.
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <Award className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-amber-800">استاد برتر قلم‌چی</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    از اساتید برتر و شناخته‌شده کانون فرهنگی آموزش قلم‌چی با
                    پروفایل رسمی تأیید‌شده
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                      <BookMarked className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-orange-800">استاد برتر خانه ریاضی</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    از اساتید برتر و فعال خانه ریاضی با سابقه درخشان در آموزش
                    ریاضیات
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                      <Shield className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-orange-800">معلم رسمی آموزش و پرورش</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    دارای سمت رسمی معلمی در آموزش و پرورش با سابقه تدریس در
                    مدارس دولتی
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                      <Star className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-purple-800">تدریس در مدارس تیزهوشان</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    سابقه تدریس در بهترین مدارس تیزهوشان و غیرانتفاعی کشور
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-blue-800">تدریس در مدارس غیرانتفاعی</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    تجربه تدریس در برترین مدارس غیرانتفاعی تهران و سایر شهرها
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-amber-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-red-800">تخصص کنکور</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    متخصص آمادگی ریاضی کنکور با سال‌ها تجربه و نتایج درخشان
                    دانش‌آموزان
                  </p>
                </div>
              </div>

              <div className="bg-amber-100/50 rounded-xl p-4 border border-amber-200">
                <p className="text-sm text-amber-800 leading-relaxed">
                  استاد آقایی‌زاده در حال حاضر کلاس‌های پایه هشتم تا دوازدهم و
                  کنکور را در {ACADEMY_NAME} تدریس می‌کنند. ایشان با روش تدریس
                  منحصر به فرد خود، مفاهیم پیچیده ریاضی را به زبانی ساده و قابل
                  فهم برای دانش‌آموزان بیان می‌کنند. رزومه کامل ایشان با جستجوی
                  نامشان در اینترنت قابل مشاهده است.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Second Teacher - Bavauf */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-orange-100">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-600 text-white shrink-0">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-orange-800">
                    دکتر باوفا
                  </CardTitle>
                  <p className="text-orange-600 font-medium mt-1">
                    استاد ریاضی پایه ششم و هفتم
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                دکتر باوفا از اساتید مجرب و متخصص ریاضی هستند که کلاس‌های پایه
                ششم و هفتم را در {ACADEMY_NAME} تدریس می‌کنند. ایشان با رویکردی
                صبورانه و دوستانه، مبانی ریاضی را برای دانش‌آموزان پایه متوسطه
                اول به بهترین شکل تثبیت می‌کنند و زمینه‌سازی محکمی برای ادامه
                مسیر تحصیلی فراهم می‌سازند.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// --- Contact Section ---
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
    // Placeholder
  };

  return (
    <section className="py-20 bg-orange-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <Badge className="mb-4 bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
            تماس
          </Badge>
          <h2 className="mb-4 text-3xl font-extrabold text-orange-900 sm:text-4xl">
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
              <Card className="border-orange-100 bg-orange-50/50">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      تلفن تماس
                    </p>
                    <p className="text-lg font-bold text-orange-800" dir="ltr">
                      +98 938 731 3618
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
              <Card className="border-orange-100 bg-orange-50/50">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      ایمیل
                    </p>
                    <p className="text-lg font-bold text-orange-800" dir="ltr">
                      ef.aghaeizadeh@gmail.com
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
                      نحوه برگزاری
                    </p>
                    <p className="text-lg font-bold text-amber-800">
                      تمام کلاس‌ها به صورت آنلاین در SkyRoom برگزار می‌شوند
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
            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-orange-800">
                  پیام خود را ارسال کنید
                </CardTitle>
                <CardDescription>
                  فرم زیر را پر کنید، در اسرع وقت با شما تماس می‌گیریم.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-orange-800">
                      نام و نام خانوادگی
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="نام خود را وارد کنید"
                      value={formData.name}
                      onChange={handleChange}
                      className="border-orange-200 focus-visible:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-orange-800">
                      ایمیل
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-orange-200 focus-visible:ring-orange-500"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-orange-800">
                      پیام
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="پیام خود را بنویسید..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="border-orange-200 focus-visible:ring-orange-500 resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-orange-600 text-white hover:bg-orange-700 gap-2 py-5"
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

// --- Profile Page ---
function ProfilePage() {
  const { user, purchases, logout, setCurrentPage } = useAppStore();
  const { toast } = useToast();

  if (!user) {
    return (
      <section className="py-20 bg-white min-h-[60vh] flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <User className="h-20 w-20 text-orange-200 mx-auto mb-6" />
          <h2 className="mb-4 text-2xl font-bold text-orange-800">
            ابتدا وارد حساب کاربری خود شوید
          </h2>
        </div>
      </section>
    );
  }

  const handleLogout = () => {
    logout();
    toast({
      title: "خروج موفق",
      description: "با موفقیت خارج شدید",
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <Card className="border-orange-100 overflow-hidden">
            <div className="bg-gradient-to-l from-orange-600 to-orange-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    {user.role === "admin" && (
                      <Badge className="bg-amber-400 text-amber-900 border-0 text-xs px-2 py-0.5 font-bold">
                        ادمین
                      </Badge>
                    )}
                  </div>
                  <p className="text-orange-200" dir="ltr">
                    {user.email}
                  </p>
                  {user.phone && (
                    <p className="text-orange-200" dir="ltr">
                      {user.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <CardContent className="pt-6">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50 gap-2"
              >
                <LogOut className="h-4 w-4" />
                خروج از حساب کاربری
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Purchases */}
        <h3 className="text-xl font-bold text-orange-800 mb-4">
          خریدهای من
        </h3>
        {purchases.length === 0 ? (
          <Card className="border-orange-100">
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-orange-200 mx-auto mb-4" />
              <p className="text-muted-foreground">
                هنوز خریدی انجام نداده‌اید
              </p>
              <Button
                onClick={() => setCurrentPage("classes")}
                className="mt-4 bg-orange-600 text-white hover:bg-orange-700"
              >
                مشاهده کلاس‌ها و محصولات
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {purchases.map((purchase) => (
              <Card key={purchase.id} className="border-orange-100">
                <CardContent className="flex items-center justify-between pt-6">
                  <div>
                    <h4 className="font-bold text-orange-800">
                      {purchase.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      تاریخ خرید: {purchase.purchasedAt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {purchase.skyroomUrl && (
                      <a
                        href={purchase.skyroomUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          className="bg-orange-600 text-white hover:bg-orange-700 gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          ورود به کلاس
                        </Button>
                      </a>
                    )}
                    {purchase.downloadUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-orange-200 text-orange-700 gap-1"
                      >
                        <Download className="h-3 w-3" />
                        دانلود
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// --- Footer ---
function Footer() {
  const { setCurrentPage } = useAppStore();

  return (
    <footer className="bg-orange-900 text-orange-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600 text-white">
                <Calculator className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white">
                {ACADEMY_NAME}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-orange-300">
              آکادمی ریاضی عرفان با هدف آموزش نوین و تعاملی ریاضیات به
              دانش‌آموزان سراسر ایران فعالیت می‌کند.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">دسترسی سریع</h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => setCurrentPage(link.href as PageView)}
                  className="text-right text-sm text-orange-300 transition-colors hover:text-white"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">خدمات ما</h3>
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => setCurrentPage("classes")}
                className="text-right text-sm text-orange-300 transition-colors hover:text-white"
              >
                کلاس‌های آنلاین
              </button>
              <button
                onClick={() => setCurrentPage("products")}
                className="text-right text-sm text-orange-300 transition-colors hover:text-white"
              >
                پکیج‌های ویدیویی
              </button>
              <button
                onClick={() => setCurrentPage("booklets")}
                className="text-right text-sm text-orange-300 transition-colors hover:text-white"
              >
                جزوه‌های آموزشی
              </button>
              <button
                onClick={() => setCurrentPage("free-videos")}
                className="text-right text-sm text-orange-300 transition-colors hover:text-white"
              >
                ویدیوهای رایگان
              </button>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">اطلاعات تماس</h3>
            <div className="space-y-2 text-sm text-orange-300">
              <p dir="ltr" className="text-right">
                +98 938 731 3618
              </p>
              <p dir="ltr" className="text-right">
                ef.aghaeizadeh@gmail.com
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-orange-700" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-orange-400">
            تمامی حقوق محفوظ است {ACADEMY_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}

// --- Scroll To Top ---
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

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
      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        size="icon"
        className="h-12 w-12 rounded-full bg-orange-600 text-white shadow-lg hover:bg-orange-700"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}

// --- Main Page ---
export default function Home() {
  const { currentPage } = useAppStore();

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <>
            <HeroSection />
            <FeaturesSection />
          </>
        );
      case "classes":
        return <ClassesPage />;
      case "products":
        return <ProductsPage />;
      case "free-videos":
        return <FreeVideosPage />;
      case "booklets":
        return <BookletsPage />;
      case "about":
        return <AboutPage />;
      case "cart":
        return <CartPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return (
          <>
            <HeroSection />
            <FeaturesSection />
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <LoginModal />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      {/* Always show contact and footer */}
      {currentPage !== "profile" && currentPage !== "cart" && (
        <ContactSection />
      )}
      <Footer />
      <ScrollToTop />
    </div>
  );
}
