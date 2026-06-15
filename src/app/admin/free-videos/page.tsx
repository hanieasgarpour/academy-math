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
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface FreeVideoItem {
  id: string;
  title: string;
  description: string | null;
  url: string;
  platform: string;
  order: number;
  published: boolean;
}

const platformLabels: Record<string, string> = {
  YOUTUBE: "یوتیوب",
  APARAT: "آپارات",
  CUSTOM: "لینک سفارشی",
};

export default function AdminFreeVideosPage() {
  const [videos, setVideos] = useState<FreeVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<FreeVideoItem | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    url: "",
    platform: "YOUTUBE",
    order: 0,
    published: true,
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    try {
      const res = await fetch("/api/admin/free-videos");
      const data = await res.json();
      setVideos(data);
    } catch {
      toast.error("خطا در دریافت ویدیوها");
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingVideo(null);
    setForm({ title: "", description: "", url: "", platform: "YOUTUBE", order: videos.length + 1, published: true });
    setDialogOpen(true);
  }

  function openEditDialog(video: FreeVideoItem) {
    setEditingVideo(video);
    setForm({
      title: video.title,
      description: video.description || "",
      url: video.url,
      platform: video.platform,
      order: video.order,
      published: video.published,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingVideo
        ? `/api/admin/free-videos?id=${editingVideo.id}`
        : "/api/admin/free-videos";
      const method = editingVideo ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "خطا در ذخیره ویدیو");
        return;
      }

      toast.success(editingVideo ? "ویدیو ویرایش شد" : "ویدیو اضافه شد");
      setDialogOpen(false);
      fetchVideos();
    } catch {
      toast.error("خطا در ذخیره ویدیو");
    }
  }

  async function deleteVideo(id: string) {
    if (!confirm("آیا از حذف این ویدیو اطمینان دارید؟")) return;
    try {
      const res = await fetch(`/api/admin/free-videos?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("ویدیو حذف شد");
        fetchVideos();
      }
    } catch {
      toast.error("خطا در حذف ویدیو");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">مدیریت ویدیوهای رایگان</h1>
        <Button className="gap-2" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          افزودن ویدیو
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">در حال بارگذاری...</div>
          ) : videos.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              هنوز ویدیوی رایگانی اضافه نشده است
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-right py-3 px-4 font-medium">عنوان</th>
                    <th className="text-right py-3 px-4 font-medium">پلتفرم</th>
                    <th className="text-right py-3 px-4 font-medium">ترتیب</th>
                    <th className="text-right py-3 px-4 font-medium">وضعیت</th>
                    <th className="text-right py-3 px-4 font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video) => (
                    <tr key={video.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="py-3 px-4 font-medium">{video.title}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{platformLabels[video.platform] || video.platform}</Badge>
                      </td>
                      <td className="py-3 px-4">{video.order}</td>
                      <td className="py-3 px-4">
                        <Badge variant={video.published ? "default" : "secondary"}>
                          {video.published ? "منتشر" : "پیش‌نویس"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <a href={video.url} target="_blank" rel="noopener noreferrer">
                            <Button size="icon" variant="ghost" title="مشاهده لینک">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </a>
                          <Button size="icon" variant="ghost" onClick={() => openEditDialog(video)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteVideo(video.id)} className="text-destructive">
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
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingVideo ? "ویرایش ویدیو" : "افزودن ویدیوی رایگان"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>عنوان ویدیو</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>توضیحات (اختیاری)</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>لینک ویدیو</Label>
              <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." dir="ltr" className="text-left" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>پلتفرم</Label>
                <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YOUTUBE">یوتیوب</SelectItem>
                    <SelectItem value="APARAT">آپارات</SelectItem>
                    <SelectItem value="CUSTOM">لینک سفارشی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>ترتیب نمایش</Label>
                <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} dir="ltr" className="text-left" />
              </div>
            </div>
            <Button type="submit" className="w-full">
              {editingVideo ? "ذخیره تغییرات" : "افزودن ویدیو"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
