import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  GraduationCap,
  Users,
  BookOpen,
  Award,
  ArrowLeft,
  Clock,
  Signal,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const levelMap: Record<string, { label: string; color: string }> = {
  BEGINNER: { label: "مبتدی", color: "bg-green-100 text-green-700" },
  INTERMEDIATE: { label: "متوسط", color: "bg-yellow-100 text-yellow-700" },
  ADVANCED: { label: "پیشرفته", color: "bg-red-100 text-red-700" },
};

function toToman(rials: number): string {
  return (rials / 10).toLocaleString("fa-IR");
}

// Force dynamic rendering - don't try to query DB at build time
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const courses = await db.course.findMany({
    where: { published: true },
    include: {
      _count: {
        select: { lessons: true, enrollments: true },
      },
    },
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    students: await db.user.count({ where: { role: "STUDENT" } }),
    courses: await db.course.count({ where: { published: true } }),
    lessons: await db.lesson.count(),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-bl from-orange-50 via-white to-orange-50 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOTczMTYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2MmgxMnptMC00VjI0SDI0djJoMTJ6TTI0IDIyaDEydi0ySDI0djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <GraduationCap className="h-4 w-4" />
              آکادمی ریاضی ارفعان
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              یادگیری ریاضی با
              <span className="text-primary"> بهترین کیفیت</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-8">
              با دوره‌های آنلاین ریاضی از پایه هفتم تا دوازدهم، مسیر موفقیت
              خود را هموار کنید. آموزش تخصصی با حل تمرین‌های متنوع و آمادگی
              کامل برای کنکور
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/courses">
                <Button size="lg" className="gap-2 text-base px-8">
                  مشاهده دوره‌ها
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 text-base px-8"
                >
                  ثبت‌نام رایگان
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto mb-3">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold">{stats.students}+</div>
              <div className="text-sm text-muted-foreground mt-1">
                دانش‌آموز فعال
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto mb-3">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold">{stats.courses}+</div>
              <div className="text-sm text-muted-foreground mt-1">
                دوره آموزشی
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto mb-3">
                <Award className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold">{stats.lessons}+</div>
              <div className="text-sm text-muted-foreground mt-1">
                درس آموزشی
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">دوره‌های محبوب</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              جدیدترین و محبوب‌ترین دوره‌های ریاضی را مشاهده کنید و یادگیری
              خود را از همین امروز شروع کنید
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const level = levelMap[course.level] || levelMap.BEGINNER;
              return (
                <Card
                  key={course.id}
                  className="group overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Thumbnail placeholder */}
                  <div className="relative h-48 bg-gradient-to-bl from-orange-100 to-orange-50 flex items-center justify-center">
                    <GraduationCap className="h-16 w-16 text-primary/30" />
                    <div className="absolute top-3 right-3">
                      <Badge className={level.color}>{level.label}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-base mb-2 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-6">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {course._count.lessons} درس
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course._count.enrollments} نفر
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">
                        {course.price === 0
                          ? "رایگان"
                          : `${toToman(course.price)} تومان`}
                      </div>
                      <Link href={`/courses/${course.id}`}>
                        <Button size="sm" variant="outline" className="gap-1">
                          مشاهده
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/courses">
              <Button variant="outline" size="lg" className="gap-2">
                مشاهده همه دوره‌ها
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-muted/30" id="about">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">چرا آکادمی ارفعان؟</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ما تفاوت‌های بزرگی با سایر آموزشگاه‌ها داریم
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-white shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">اساتید مجرب</h3>
              <p className="text-sm text-muted-foreground leading-6">
                تدریس توسط بهترین اساتید ریاضی با سال‌ها تجربه آموزشی
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Signal className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">آموزش تعاملی</h3>
              <p className="text-sm text-muted-foreground leading-6">
                ویدیوهای آموزشی با کیفیت همراه با تمرین‌ها و فایل‌های پیوست
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-white shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-bold mb-2">پشتیبانی مستمر</h3>
              <p className="text-sm text-muted-foreground leading-6">
                پاسخگویی به سوالات دانش‌آموزان در تمام مراحل یادگیری
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground" id="contact">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            همین امروز شروع کنید!
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto leading-8">
            با ثبت‌نام در آکادمی ریاضی ارفعان، به بهترین منابع آموزشی ریاضی
            دسترسی پیدا کنید و مسیر موفقیت خود را هموار سازید
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="text-base px-8"
            >
              ثبت‌نام رایگان
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
