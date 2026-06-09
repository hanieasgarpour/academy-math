"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
  Search,
} from "lucide-react";

const levelMap: Record<string, { label: string; color: string }> = {
  BEGINNER: { label: "مبتدی", color: "bg-green-100 text-green-700" },
  INTERMEDIATE: { label: "متوسط", color: "bg-yellow-100 text-yellow-700" },
  ADVANCED: { label: "پیشرفته", color: "bg-red-100 text-red-700" },
};

interface CourseItem {
  id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  duration: string | null;
  thumbnail: string | null;
  _count: { lessons: number; enrollments: number };
}

export default function CoursesPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredCourses = useMemo(() => {
    let result = courses;
    if (search.trim()) {
      result = result.filter(
        (c) =>
          c.title.includes(search.trim()) ||
          c.description.includes(search.trim())
      );
    }
    if (levelFilter !== "ALL") {
      result = result.filter((c) => c.level === levelFilter);
    }
    return result;
  }, [search, levelFilter, courses]);

  function toToman(rials: number): string {
    return (rials / 10).toLocaleString("fa-IR");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-bl from-orange-50 via-white to-orange-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">دوره‌های آموزشی</h1>
            <p className="text-muted-foreground">
              بهترین دوره‌های ریاضی را انتخاب کنید و یادگیری خود را شروع کنید
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو در دوره‌ها..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-10"
                />
              </div>
              <div className="flex gap-2">
                {[
                  { value: "ALL", label: "همه" },
                  { value: "BEGINNER", label: "مبتدی" },
                  { value: "INTERMEDIATE", label: "متوسط" },
                  { value: "ADVANCED", label: "پیشرفته" },
                ].map((level) => (
                  <Button
                    key={level.value}
                    variant={levelFilter === level.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLevelFilter(level.value)}
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Course Grid */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted" />
                    <CardContent className="p-5">
                      <div className="h-5 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-20">
                <GraduationCap className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  دوره‌ای یافت نشد
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                  const level =
                    levelMap[course.level] || levelMap.BEGINNER;
                  return (
                    <Card
                      key={course.id}
                      className="group overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative h-48 bg-gradient-to-bl from-orange-100 to-orange-50 flex items-center justify-center">
                        <GraduationCap className="h-16 w-16 text-primary/30" />
                        <div className="absolute top-3 right-3">
                          <Badge className={level.color}>
                            {level.label}
                          </Badge>
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
                          {course.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {course.duration}
                            </div>
                          )}
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
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                            >
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
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
