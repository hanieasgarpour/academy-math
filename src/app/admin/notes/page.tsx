"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface NoteItem {
  id: string;
  title: string;
  description: string | null;
  price: number;
  gradeLevel: string;
  pageCount: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  published: boolean;
}

const gradeLabels: Record<string, string> = {
  GRADE_7: "پایه هفتم",
  GRADE_8: "پایه هشتم",
  GRADE_9: "پایه نهم",
  GRADE_10: "پایه دهم",
  GRADE_11: "پایه یازدهم",
  GRADE_12: "پایه دوازدهم",
};

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    gradeLevel: "GRADE_7",
    pageCount: "",
    fileUrl: "",
    fileName: "",
    fileSize: 0,
    published: true,
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const res = await fetch("/api/admin/notes");
      const data = await res.json();
      setNotes(data);
    } catch {
      toast.error("خطا در دریافت جزوات");
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingNote(null);
    setForm({ title: "", description: "", price: "", gradeLevel: "GRADE_7", pageCount: "", fileUrl: "", fileName: "", fileSize: 0, published: true });
    setDialogOpen(true);
  }

  function openEditDialog(note: NoteItem) {
    setEditingNote(note);
    setForm({
      title: note.title,
      description: note.description || "",
      price: (note.price / 10).toString(),
      gradeLevel: note.gradeLevel,
      pageCount: note.pageCount.toString(),
      fileUrl: note.fileUrl,
      fileName: note.fileName,
      fileSize: note.fileSize,
      published: note.published,
    });
    setDialogOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subfolder", "notes");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "خطا در آپلود فایل");
        return;
      }

      setForm({
        ...form,
        fileUrl: data.url,
        fileName: data.fileName || file.name,
        fileSize: data.fileSize || file.size,
      });
      toast.success("فایل آپلود شد");
    } catch {
      toast.error("خطا در آپلود فایل");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.fileUrl) {
      toast.error("لطفاً فایل جزوه را آپلود کنید");
      return;
    }

    try {
      const url = editingNote
        ? `/api/admin/notes?id=${editingNote.id}`
        : "/api/admin/notes";
      const method = editingNote ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description || null,
          price: parseInt(form.price) * 10,
          gradeLevel: form.gradeLevel,
          pageCount: form.pageCount,
          fileUrl: form.fileUrl,
          fileName: form.fileName,
          fileSize: form.fileSize,
          published: form.published,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "خطا در ذخیره جزوه");
        return;
      }

      toast.success(editingNote ? "جزوه ویرایش شد" : "جزوه اضافه شد");
      setDialogOpen(false);
      fetchNotes();
    } catch {
      toast.error("خطا در ذخیره جزوه");
    }
  }

  async function deleteNote(id: string) {
    if (!confirm("آیا از حذف این جزوه اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/admin/notes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("جزوه حذف شد");
        fetchNotes();
      }
    } catch {
      toast.error("خطا در حذف جزوه");
    }
  }

  function toToman(rials: number): string {
    return (rials / 10).toLocaleString("fa-IR");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مدیریت جزوات</h1>
        <Button className="gap-2" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          افزودن جزوه
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">در حال بارگذاری...</div>
          ) : notes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              هنوز جزوه‌ای اضافه نشده است
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-right py-3 px-4 font-medium">عنوان</th>
                    <th className="text-right py-3 px-4 font-medium">پایه</th>
                    <th className="text-right py-3 px-4 font-medium">صفحات</th>
                    <th className="text-right py-3 px-4 font-medium">قیمت</th>
                    <th className="text-right py-3 px-4 font-medium">وضعیت</th>
                    <th className="text-right py-3 px-4 font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((note) => (
                    <tr key={note.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="py-3 px-4 font-medium">{note.title}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{gradeLabels[note.gradeLevel] || note.gradeLevel}</Badge>
                      </td>
                      <td className="py-3 px-4">{note.pageCount}</td>
                      <td className="py-3 px-4">
                        {note.price === 0 ? "رایگان" : `${toToman(note.price)} تومان`}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={note.published ? "default" : "secondary"}>
                          {note.published ? "منتشر" : "پیش‌نویس"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openEditDialog(note)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteNote(note.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingNote ? "ویرایش جزوه" : "افزودن جزوه جدید"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>عنوان جزوه</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>توضیحات (اختیاری)</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>قیمت (تومان)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} dir="ltr" className="text-left" required />
              </div>
              <div className="space-y-2">
                <Label>پایه تحصیلی</Label>
                <Select value={form.gradeLevel} onValueChange={(v) => setForm({ ...form, gradeLevel: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GRADE_7">پایه هفتم</SelectItem>
                    <SelectItem value="GRADE_8">پایه هشتم</SelectItem>
                    <SelectItem value="GRADE_9">پایه نهم</SelectItem>
                    <SelectItem value="GRADE_10">پایه دهم</SelectItem>
                    <SelectItem value="GRADE_11">پایه یازدهم</SelectItem>
                    <SelectItem value="GRADE_12">پایه دوازدهم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>تعداد صفحات</Label>
              <Input type="number" value={form.pageCount} onChange={(e) => setForm({ ...form, pageCount: e.target.value })} dir="ltr" className="text-left" />
            </div>
            <div className="space-y-2">
              <Label>فایل جزوه (PDF)</Label>
              {form.fileUrl ? (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm text-green-700 flex-1 truncate">{form.fileName}</span>
                  <Button type="button" variant="outline" size="sm" onClick={() => setForm({ ...form, fileUrl: "", fileName: "", fileSize: 0 })}>
                    تغییر فایل
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">فایل PDF را انتخاب کنید</span>
                    </>
                  )}
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={uploading || !form.fileUrl}>
              {editingNote ? "ذخیره تغییرات" : "افزودن جزوه"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
