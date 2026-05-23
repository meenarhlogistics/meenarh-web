import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogApi } from "@/lib/api/blog";
import { Calendar, User, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const post = await blogApi.getPost(slug);
    return {
      title: `${post.title} — Meenarh Logistics`,
      description: post.title,
    };
  } catch {
    return { title: "Post not found — Meenarh Logistics" };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await blogApi.getPost(slug);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All articles
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-5">
            {post.title}
          </h1>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author_name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_at || post.created_at)}
            </span>
          </div>
        </header>

        {post.cover_image_url && (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-muted">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <article
          className="prose prose-neutral dark:prose-invert max-w-none
              prose-headings:font-semibold prose-headings:text-foreground
              prose-p:text-foreground/80 prose-p:leading-relaxed
              prose-a:text-foreground prose-a:underline prose-a:underline-offset-2
              prose-img:rounded-xl prose-img:shadow-sm
              prose-ul:text-foreground/80 prose-ol:text-foreground/80
              prose-strong:text-foreground
              prose-blockquote:border-l-foreground/30 prose-blockquote:text-muted-foreground"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
            {post.content}
          </ReactMarkdown>
        </article>

        <div className="mt-14 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-foreground/70 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all articles
          </Link>
        </div>
      </div>
    </main>
  );
}
