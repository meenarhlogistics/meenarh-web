"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { adminApi } from "@/lib/api/admin";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params.id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchPost = useCallback(async () => {
    try {
      const res = await adminApi.getBlogPost(postId);
      const post = res.data;
      setTitle(post.title);
      setContent(post.content);
      setCoverUrl(post.cover_image_url || "");
      setStatus(post.status);
    } catch {
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleSave = async (newStatus?: "draft" | "published") => {
    setError("");
    setSaving(true);
    try {
      await adminApi.updateBlogPost(postId, {
        title: title.trim(),
        content,
        cover_image_url: coverUrl.trim() || undefined,
        status: newStatus || status,
      });
      router.push("/admin/blog");
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Edit Post</h1>
        <div className="flex flex-col-reverse sm:flex-row flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="secondary" onClick={() => router.push("/admin/blog")} disabled={saving} className="w-full sm:w-auto">
            Cancel
          </Button>
          {status === "published" ? (
            <Button variant="primary" onClick={() => handleSave()} disabled={saving} className="w-full sm:w-auto">
              {saving ? "Saving..." : "Update"}
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => handleSave("draft")} disabled={saving} className="w-full sm:w-auto">
                {saving ? "Saving..." : "Save Draft"}
              </Button>
              <Button variant="primary" onClick={() => handleSave("published")} disabled={saving} className="w-full sm:w-auto">
                {saving ? "Publishing..." : "Publish"}
              </Button>
            </>
          )}
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
