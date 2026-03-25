"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { adminApi } from "@/lib/api/admin";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (status: "draft" | "published") => {
    setError("");
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      setError("Content is required");
      return;
    }

    setSaving(true);
    try {
      await adminApi.createBlogPost({
        title: title.trim(),
        content,
        cover_image_url: coverUrl.trim() || undefined,
        status,
      });
      router.push("/admin/blog");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to create post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">New Blog Post</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.push("/admin/blog")} disabled={saving}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => handleSave("draft")} disabled={saving}>
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button variant="primary" onClick={() => handleSave("published")} disabled={saving}>
            {saving ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title"
        id="blog-title"
      />

      <Input
        label="Cover Image URL (optional)"
        value={coverUrl}
        onChange={(e) => setCoverUrl(e.target.value)}
        placeholder="https://example.com/image.jpg"
        id="blog-cover"
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Content</label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>
    </div>
  );
}
