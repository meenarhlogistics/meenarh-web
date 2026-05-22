"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, FormErrorAlert } from "@/components/ui";
import { getApiErrorDetails, type ParsedApiError } from "@/lib/errors/apiError";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { adminApi } from "@/lib/api/admin";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ParsedApiError | null>(null);

  const handleSave = async (status: "draft" | "published") => {
    setErrorDetails(null);
    if (!title.trim()) {
      setErrorDetails({ message: "Title is required" });
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      setErrorDetails({ message: "Content is required" });
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
      setErrorDetails(getApiErrorDetails(err, "Failed to create post"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">New Blog Post</h1>
        <div className="flex flex-col-reverse sm:flex-row flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="secondary" onClick={() => router.push("/admin/blog")} disabled={saving} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => handleSave("draft")} disabled={saving} className="w-full sm:w-auto">
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button variant="primary" onClick={() => handleSave("published")} disabled={saving} className="w-full sm:w-auto">
            {saving ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <FormErrorAlert
        message={errorDetails?.message}
        items={errorDetails?.items}
      />

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
