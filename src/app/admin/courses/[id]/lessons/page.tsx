"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Pencil,
  Trash2,
  Video,
  FileText,
  ArrowLeft,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface FileItem {
  id: string;
  name: string;
  url: string;
  fileType: string;
  fileSize: number;
}

interface LessonItem {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  order: number;
  files: FileItem[];
}

export default function AdminLessonsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [form, setForm] = useState({
    title: "",
    content: "",
    videoUrl: "",
    order: 0,
  });
  const [fileForm, setFileForm] = useState({
    name: "",
    url: "",
    fileType: "application/pdf",
    fileSize: "",
  });

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  async function fetchLessons() {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/lessons`);
      const data = await res.json();
      if (res.ok) setLessons(data);
    } catch {
      toast.error("خطا در دریافت دروس");
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingLesson(null);
    setForm({
      title: "",
      content: "",
      videoUrl: "",
      order: lessons.length + 1,
    });
    setDialogOpen(true);
  }

  function openEditDialog(lesson: LessonItem) {
    setEditingLesson(lesson);
    setForm({
      title: lesson.title,
      content: lesson.content || "",
      videoUrl: lesson.videoUrl || "",
      order: lesson.order,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingLesson
        ? `/api/admin/lessons/${editingLesson.id}`
        : `/api/admin/courses/${courseId}/lessons`;
      const method = editingLesson ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "خطا در ذخیره درس");
        return;
      }

      toast.success(editingLesson ? "درس ویرایش شد" : "درس ایجاد شد");
      setDialogOpen(false);
      fetchLessons();
    } catch {
      toast.error("خطا در ذخیره درس");
    }
  }

  async function deleteLesson(id: string) {
    if (!confirm("آیا از حذف این درس اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/admin/lessons/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("درس حذف شد");
        fetchLessons();
      }
    } catch {
      toast.error("خطا در حذف درس");
    }
  }

  function openFileModal(lessonId: string) {
    setSelectedLessonId(lessonId);
    setFileForm({ name: "", url: "", fileType: "application/pdf", fileSize: "" });
    setFileDialogOpen(true);
  }

  async function handleFileSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/lessons/${selectedLessonId}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fileForm,
          fileSize: parseInt(fileForm.fileSize) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "خطا در افزودن فایل");
        return;
      }

      toast.success("فایل اضافه شد");
      setFileDialogOpen(false);
      fetchLessons();
    } catch {
      toast.error("خطا در افزودن فایل");
    }
  }

  async function deleteFile(fileId: string, lessonId: string) {
    if (!confirm("آیا از حذف این فایل اطمینان دارید؟")) return;
    try {
      const res = await fetch(
        `/api/admin/lessons/${lessonId}/files?fileId=${fileId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        toast.success("فایل حذف شد");
        fetchLessons();
      }
    } catch {
      toast.error("خطا در حذف فایل");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/courses")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">مدیریت دروس</h1>
        </div>
        <Button className="gap-2" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          افزودن درس
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          در حال بارگذاری...
        </div>
      ) : lessons.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            هنوز درسی ایجاد نشده است. اولین درس را اضافه کنید!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <Card key={lesson.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold mt-0.5 shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm">{lesson.title}</h3>
                      {lesson.content && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {lesson.content}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {lesson.videoUrl && (
                          <Badge
                            variant="outline"
                            className="gap-1 text-xs text-blue-600"
                          >
                            <Video className="h-3 w-3" />
                            ویدیو دارد
                          </Badge>
                        )}
                        {lesson.files.length > 0 && (
                          <Badge
                            variant="outline"
                            className="gap-1 text-xs text-green-600"
                          >
                            <FileText className="h-3 w-3" />
                            {lesson.files.length} فایل
                          </Badge>
                        )}
                      </div>

                      {/* Files List */}
                      {lesson.files.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {lesson.files.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center justify-between text-xs bg-muted/50 rounded px-2 py-1.5"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-3 w-3 text-primary" />
                                <span>{file.name}</span>
                                <span className="text-muted-foreground">
                                  ({(file.fileSize / 1024).toFixed(0)} KB)
                                </span>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-destructive"
                                onClick={() => deleteFile(file.id, lesson.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openFileModal(lesson.id)}
                      title="افزودن فایل/جزوه"
                    >
                      <FileText className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEditDialog(lesson)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteLesson(lesson.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lesson Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? "ویرایش درس" : "افزودن درس جدید"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>عنوان درس</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>محتوای درس (اختیاری)</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>لینک ویدیو (اختیاری)</Label>
              <Input
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="https://..."
                dir="ltr"
                className="text-left"
              />
            </div>
            <div className="space-y-2">
              <Label>ترتیب</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: parseInt(e.target.value) || 0 })
                }
                dir="ltr"
                className="text-left"
              />
            </div>
            <Button type="submit" className="w-full">
              {editingLesson ? "ذخیره تغییرات" : "ایجاد درس"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* File Dialog */}
      <Dialog open={fileDialogOpen} onOpenChange={setFileDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>افزودن فایل / جزوه</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>نام فایل</Label>
              <Input
                value={fileForm.name}
                onChange={(e) =>
                  setFileForm({ ...fileForm, name: e.target.value })
                }
                placeholder="مثلاً: جزوه فصل ۱"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>لینک فایل</Label>
              <Input
                value={fileForm.url}
                onChange={(e) =>
                  setFileForm({ ...fileForm, url: e.target.value })
                }
                placeholder="https://..."
                dir="ltr"
                className="text-left"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>نوع فایل</Label>
                <Input
                  value={fileForm.fileType}
                  onChange={(e) =>
                    setFileForm({ ...fileForm, fileType: e.target.value })
                  }
                  placeholder="application/pdf"
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <div className="space-y-2">
                <Label>حجم (بایت)</Label>
                <Input
                  type="number"
                  value={fileForm.fileSize}
                  onChange={(e) =>
                    setFileForm({ ...fileForm, fileSize: e.target.value })
                  }
                  placeholder="1024000"
                  dir="ltr"
                  className="text-left"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              افزودن فایل
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
