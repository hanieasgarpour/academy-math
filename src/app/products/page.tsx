"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  FileText,
  Download,
  ExternalLink,
  Youtube,
  BookOpen,
  GraduationCap,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const gradeMap: Record<string, string> = {
  GRADE_7: "پایه هفتم",
  GRADE_8: "پایه هشتم",
  GRADE_9: "پایه نهم",
  GRADE_10: "پایه دهم",
  GRADE_11: "پایه یازدهم",
  GRADE_12: "پایه دوازدهم",
};

const platformIcons: Record<string, { icon: typeof Youtube; label: string; color: string }> = {
  YOUTUBE: { icon: Youtube, label: "یوتیوب", color: "text-red-500" },
  APARAT: { icon: Play, label: "آپارات", color: "text-blue-500" },
  CUSTOM: { icon: ExternalLink, label: "لینک", color: "text-green-500" },
};

interface FreeVideoItem {
  id: string;
  title: string;
  description: string | null;
  url: string;
  platform: string;
  thumbnail: string | null;
}

interface NoteItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  gradeLevel: string;
  pageCount: number;
  fileName: string;
}

interface CourseItem {
  id: string;
  title: string;
  description: string;
  price: number;
  level: string;
  duration: string | null;
  _count: { lessons: number; enrollments: number };
}

const levelMap: Record<string, { label: string; color: string }> = {
  BEGINNER: { label: "مبتدی", color: "bg-green-100 text-green-700" },
  INTERMEDIATE: { label: "متوسط", color: "bg-yellow-100 text-yellow-700" },
  ADVANCED: { label: "پیشرفته", color: "bg-red-100 text-red-700" },
};

function toToman(rials: number): string {
  return (rials / 10).toLocaleString("fa-IR");
}

export default function ProductsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [freeVideos, setFreeVideos] = useState<FreeVideoItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/free-videos").then((r) => r.json()).catch(() => []),
      fetch("/api/notes").then((r) => r.json()).catch(() => []),
      fetch("/api/courses").then((r) => r.json()).catch(() => []),
    ])
      .then(([videosData, notesData, coursesData]) => {
        setFreeVideos(Array.isArray(videosData) ? videosData : []);
        setNotes(Array.isArray(notesData) ? notesData : []);
        setCourses(Array.isArray(coursesData) ? coursesData : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleNoteDownload(noteId: string) {
    if (!session) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(`/api/notes/${noteId}/download`);
      const data = await res.json();
      if (res.ok) {
        window.open(data.url, "_blank");
      } else {
        toast.error(data.error || "خطا در دانلود جزوه");
      }
    } catch {
      toast.error("خطا در دانلود جزوه");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-bl from-orange-50 via-white to-orange-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">محصولات آکادمی</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-8">
              ویدیوهای رایگان، جزوات آموزشی و دوره‌های کامل ریاضی را اینجا پیدا کنید
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="free-videos" dir="rtl" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-8">
              <TabsTrigger value="free-videos" className="gap-2">
                <Play className="h-4 w-4" />
                ویدیوهای رایگان
              </TabsTrigger>
              <TabsTrigger value="notes" className="gap-2">
                <FileText className="h-4 w-4" />
                جزوات
              </TabsTrigger>
              <TabsTrigger value="courses" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                دوره‌ها
              </TabsTrigger>
            </TabsList>

            {/* Free Videos Tab */}
            <TabsContent value="free-videos">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : freeVideos.length === 0 ? (
                <div className="text-center py-16">
                  <Play className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">ویدیوی رایگانی وجود ندارد</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {freeVideos.map((video) => {
                    const platform = platformIcons[video.platform] || platformIcons.CUSTOM;
                    const PlatformIcon = platform.icon;
                    return (
                      <a
                        key={video.id}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                          {/* Thumbnail */}
                          <div className="relative h-44 bg-gradient-to-bl from-orange-100 to-red-50 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <PlatformIcon className={`h-8 w-8 ${platform.color}`} />
                            </div>
                            <div className="absolute top-3 right-3">
                              <Badge variant="secondary" className="gap-1 text-xs">
                                <PlatformIcon className="h-3 w-3" />
                                {platform.label}
                              </Badge>
                            </div>
                            <div className="absolute bottom-3 left-3">
                              <Badge className="bg-green-500 text-white text-xs">رایگان</Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                              {video.title}
                            </h3>
                            {video.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-5">
                                {video.description}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </a>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-56 bg-muted rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">جزوه‌ای وجود ندارد</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notes.map((note) => (
                    <Card key={note.id} className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="h-7 w-7 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm mb-1 line-clamp-1">{note.title}</h3>
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {gradeMap[note.gradeLevel] || note.gradeLevel}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {note.pageCount} صفحه
                              </span>
                            </div>
                            {note.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-5 mb-3">
                                {note.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="text-lg font-bold text-primary">
                                {note.price === 0 ? "رایگان" : `${toToman(note.price)} تومان`}
                              </div>
                              <Button
                                size="sm"
                                className="gap-1"
                                onClick={() => handleNoteDownload(note.id)}
                              >
                                <Download className="h-3.5 w-3.5" />
                                {note.price === 0 ? "دانلود" : "خرید"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-56 bg-muted rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-16">
                  <GraduationCap className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">دوره‌ای وجود ندارد</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => {
                    const level = levelMap[course.level] || levelMap.BEGINNER;
                    return (
                      <Card key={course.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="relative h-40 bg-gradient-to-bl from-orange-100 to-orange-50 flex items-center justify-center">
                          <GraduationCap className="h-14 w-14 text-primary/30" />
                          <div className="absolute top-3 right-3">
                            <Badge className={level.color}>{level.label}</Badge>
                          </div>
                        </div>
                        <CardContent className="p-5">
                          <h3 className="font-bold text-sm mb-2 line-clamp-1">{course.title}</h3>
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
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-primary">
                              {course.price === 0 ? "رایگان" : `${toToman(course.price)} تومان`}
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
              )}
              <div className="text-center mt-8">
                <Link href="/courses">
                  <Button variant="outline" size="lg" className="gap-2">
                    مشاهده همه دوره‌ها
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
