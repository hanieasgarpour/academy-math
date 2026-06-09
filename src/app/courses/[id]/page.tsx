"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Clock,
  Users,
  BookOpen,
  Lock,
  ArrowLeft,
  ShoppingCart,
  Play,
  FileText,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

const levelMap: Record<string, { label: string; color: string }> = {
  BEGINNER: { label: "مبتدی", color: "bg-green-100 text-green-700" },
  INTERMEDIATE: { label: "متوسط", color: "bg-yellow-100 text-yellow-700" },
  ADVANCED: { label: "پیشرفته", color: "bg-red-100 text-red-700" },
};

interface Lesson {
  id: string;
  title: string;
  order: number;
  videoUrl: string | null;
  _count: { files: number };
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  duration: string | null;
  thumbnail: string | null;
  lessons: Lesson[];
  _count: { lessons: number; enrollments: number };
}

function toToman(rials: number): string {
  return (rials / 10).toLocaleString("fa-IR");
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    Promise.all([
      fetch(`/api/courses/${params.id}`).then((r) => r.json()),
      session
        ? fetch(`/api/enrollments/check?courseId=${params.id}`).then((r) =>
            r.json()
          )
        : Promise.resolve({ enrolled: false }),
    ])
      .then(([courseData, enrollmentData]) => {
        setCourse(courseData);
        setEnrolled(enrollmentData.enrolled);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id, session]);

  async function handleBuy() {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course?.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطا در ایجاد سفارش");
        return;
      }

      router.push(`/checkout/${data.order.id}`);
    } catch {
      toast.error("خطا در ایجاد سفارش");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">دوره یافت نشد</h2>
            <Link href="/courses">
              <Button variant="outline" className="gap-2 mt-4">
                بازگشت به دوره‌ها
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const level = levelMap[course.level] || levelMap.BEGINNER;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Course Header */}
        <section className="bg-gradient-to-bl from-orange-50 via-white to-orange-50 py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Course Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={level.color}>{level.label}</Badge>
                  {course.duration && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                  )}
                </div>
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-muted-foreground leading-8 mb-6">
                  {course.description}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {course._count.lessons} درس
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course._count.enrollments} دانش‌آموز
                  </div>
                </div>
              </div>

              {/* Buy/Enroll Card */}
              <Card className="lg:w-80 shrink-0">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary">
                      {course.price === 0
                        ? "رایگان"
                        : `${toToman(course.price)} تومان`}
                    </div>
                  </div>
                  {enrolled ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                        <CheckCircle className="h-5 w-5" />
                        شما در این دوره ثبت‌نام کرده‌اید
                      </div>
                      <Button
                        className="w-full gap-2"
                        onClick={() =>
                          router.push(
                            `/courses/${course.id}/lessons/${course.lessons[0]?.id}`
                          )
                        }
                        disabled={course.lessons.length === 0}
                      >
                        <Play className="h-4 w-4" />
                        ورود به دوره
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full gap-2"
                      onClick={handleBuy}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      خرید دوره
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Lessons List */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-bold mb-6">فهرست دروس</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    enrolled
                      ? "hover:bg-muted/50 cursor-pointer"
                      : "opacity-70"
                  }`}
                  onClick={() => {
                    if (enrolled) {
                      router.push(
                        `/courses/${course.id}/lessons/${lesson.id}`
                      );
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        enrolled
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{lesson.title}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        {lesson.videoUrl && (
                          <div className="flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            ویدیو
                          </div>
                        )}
                        {lesson._count.files > 0 && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {lesson._count.files} فایل
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {!enrolled ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
            {!enrolled && course.lessons.length > 0 && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
                <Lock className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  برای مشاهده دروس ابتدا دوره را خریداری کنید
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
