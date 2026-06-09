"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

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
  published: boolean;
  _count: { lessons: number; enrollments: number };
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    level: "BEGINNER",
    duration: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      setCourses(data);
    } catch {
      toast.error("خطا در دریافت دوره‌ها");
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingCourse(null);
    setForm({ title: "", description: "", price: "", level: "BEGINNER", duration: "" });
    setDialogOpen(true);
  }

  function openEditDialog(course: CourseItem) {
    setEditingCourse(course);
    setForm({
      title: course.title,
      description: course.description,
      price: (course.price / 10).toString(),
      level: course.level,
      duration: course.duration || "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      price: parseInt(form.price) * 10, // Convert toman to rials
      level: form.level,
      duration: form.duration || null,
    };

    try {
      const url = editingCourse
        ? `/api/admin/courses?id=${editingCourse.id}`
        : "/api/admin/courses";
      const method = editingCourse ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "خطا در ذخیره دوره");
        return;
      }

      toast.success(editingCourse ? "دوره ویرایش شد" : "دوره ایجاد شد");
      setDialogOpen(false);
      fetchCourses();
    } catch {
      toast.error("خطا در ذخیره دوره");
    }
  }

  async function togglePublish(course: CourseItem) {
    try {
      const res = await fetch(`/api/admin/courses?id=${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !course.published }),
      });

      if (res.ok) {
        toast.success(course.published ? "دوره غیرفعال شد" : "دوره منتشر شد");
        fetchCourses();
      }
    } catch {
      toast.error("خطا در تغییر وضعیت");
    }
  }

  async function deleteCourse(id: string) {
    if (!confirm("آیا از حذف این دوره اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/admin/courses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("دوره حذف شد");
        fetchCourses();
      }
    } catch {
      toast.error("خطا در حذف دوره");
    }
  }

  function toToman(rials: number): string {
    return (rials / 10).toLocaleString("fa-IR");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مدیریت دوره‌ها</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              افزودن دوره
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? "ویرایش دوره" : "افزودن دوره جدید"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>عنوان دوره</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>توضیحات</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>قیمت (تومان)</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                    dir="ltr"
                    className="text-left"
                  />
                </div>
                <div className="space-y-2">
                  <Label>سطح</Label>
                  <Select
                    value={form.level}
                    onValueChange={(v) => setForm({ ...form, level: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">مبتدی</SelectItem>
                      <SelectItem value="INTERMEDIATE">متوسط</SelectItem>
                      <SelectItem value="ADVANCED">پیشرفته</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>مدت دوره (اختیاری)</Label>
                <Input
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  placeholder="مثلاً: ۳۰ ساعت"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingCourse ? "ذخیره تغییرات" : "ایجاد دوره"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">در حال بارگذاری...</div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              هنوز دوره‌ای ایجاد نشده است
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-right py-3 px-4 font-medium">عنوان</th>
                    <th className="text-right py-3 px-4 font-medium">سطح</th>
                    <th className="text-right py-3 px-4 font-medium">قیمت</th>
                    <th className="text-right py-3 px-4 font-medium">دروس</th>
                    <th className="text-right py-3 px-4 font-medium">وضعیت</th>
                    <th className="text-right py-3 px-4 font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => {
                    const level = levelMap[course.level] || levelMap.BEGINNER;
                    return (
                      <tr key={course.id} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="py-3 px-4 font-medium">{course.title}</td>
                        <td className="py-3 px-4">
                          <Badge className={level.color}>{level.label}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          {course.price === 0
                            ? "رایگان"
                            : `${toToman(course.price)} تومان`}
                        </td>
                        <td className="py-3 px-4">{course._count.lessons}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={course.published ? "default" : "secondary"}
                          >
                            {course.published ? "منتشر" : "پیش‌نویس"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => togglePublish(course)}
                              title={course.published ? "غیرفعال کردن" : "انتشار"}
                            >
                              {course.published ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openEditDialog(course)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteCourse(course.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
