import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  FileText,
  Download,
  Lock,
  BookOpen,
} from "lucide-react";

const levelMap: Record<string, { label: string; color: string }> = {
  BEGINNER: { label: "مبتدی", color: "bg-green-100 text-green-700" },
  INTERMEDIATE: { label: "متوسط", color: "bg-yellow-100 text-yellow-700" },
  ADVANCED: { label: "پیشرفته", color: "bg-red-100 text-red-700" },
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id: courseId, lessonId } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/login?callbackUrl=/courses/${courseId}/lessons/${lessonId}`);
  }

  // Check enrollment
  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  });

  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  // Get lesson data
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: { files: true },
  });

  if (!lesson || lesson.courseId !== courseId) {
    redirect(`/courses/${courseId}`);
  }

  // Get all lessons for navigation
  const allLessons = await db.lesson.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
    select: { id: true, title: true, order: true },
  });

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { title: true, level: true },
  });

  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null;

  const level = course?.level
    ? levelMap[course.level] || levelMap.BEGINNER
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/courses" className="hover:text-primary transition-colors">
              دوره‌ها
            </Link>
            <span>/</span>
            <Link
              href={`/courses/${courseId}`}
              className="hover:text-primary transition-colors"
            >
              {course?.title}
            </Link>
            <span>/</span>
            <span className="text-foreground">{lesson.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Video Player */}
              {lesson.videoUrl ? (
                <Card className="mb-6 overflow-hidden">
                  <div className="aspect-video bg-black flex items-center justify-center">
                    <div className="text-center text-white/60">
                      <Play className="h-16 w-16 mx-auto mb-3" />
                      <p className="text-sm">پخش ویدیو: {lesson.title}</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="mb-6">
                  <div className="aspect-video bg-muted flex items-center justify-center rounded-t-lg">
                    <div className="text-center text-muted-foreground">
                      <BookOpen className="h-16 w-16 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">این درس ویدیو ندارد</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Lesson Content */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h1 className="text-xl font-bold mb-4">{lesson.title}</h1>
                  {lesson.content ? (
                    <div className="prose prose-sm max-w-none text-muted-foreground leading-8">
                      {lesson.content}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      محتوای متنی برای این درس ثبت نشده است.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Files */}
              {lesson.files.length > 0 && (
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      فایل‌های پیوست
                    </h2>
                    <div className="space-y-3">
                      {lesson.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-primary" />
                            <div>
                              <div className="text-sm font-medium">
                                {file.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {(file.fileSize / 1024).toFixed(0)} کیلوبایت
                              </div>
                            </div>
                          </div>
                          <Link href={`/api/files/download/${file.id}`}>
                            <Button size="sm" variant="outline" className="gap-1">
                              <Download className="h-3.5 w-3.5" />
                              دانلود
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                {prevLesson ? (
                  <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`}>
                    <Button variant="outline" className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      درس قبلی
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}
                {nextLesson ? (
                  <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                    <Button className="gap-2">
                      درس بعدی
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>

            {/* Sidebar - Lesson List */}
            <div className="lg:w-72 shrink-0">
              <Card className="sticky top-20">
                <CardContent className="p-4">
                  <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    فهرست دروس
                    {level && (
                      <Badge className={`text-xs mr-auto ${level.color}`}>
                        {level.label}
                      </Badge>
                    )}
                  </h3>
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    {allLessons.map((l, index) => (
                      <Link
                        key={l.id}
                        href={`/courses/${courseId}/lessons/${l.id}`}
                        className={`flex items-center gap-2 p-2 rounded-md text-sm transition-colors ${
                          l.id === lessonId
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        <span className="text-xs">{index + 1}.</span>
                        <span className="line-clamp-1">{l.title}</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
