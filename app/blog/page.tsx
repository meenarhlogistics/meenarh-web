import Link from "next/link";
import Image from "next/image";
import { Navigation, Footer } from "@/components/layout";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";
import { blogApi, type BlogPost } from "@/lib/api/blog";
import { Calendar, User, ArrowRight, PackageX, AlertTriangle, PenLine } from "lucide-react";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-foreground/20 transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative w-full aspect-[16/9] bg-muted overflow-hidden">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <PackageX className="w-10 h-10 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h2 className="text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-foreground/80 transition-colors">
          {post.title}
        </h2>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {post.author_name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(post.published_at || post.created_at)}
          </span>
        </div>
      </div>

      <div className="px-5 pb-4">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground group-hover:gap-2 transition-all">
          Read article <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  let error = false;

  try {
    posts = await blogApi.getPosts();
  } catch {
    error = true;
  }

  return (
    <>
      <Navigation
        logo={SITE_CONFIG.name}
        links={NAV_LINKS}
        ctaText="Login"
        ctaHref="/login"
      />

      <main className="min-h-screen pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              From Meenarh Logistics
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Blog
            </h1>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Updates, delivery tips, and news from the Meenarh team.
            </p>
          </div>

          {/* Error state */}
          {error && (
            <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-3">
              <AlertTriangle className="w-10 h-10 text-yellow-500" />
              <p className="font-medium text-foreground">Could not load posts</p>
              <p className="text-sm mt-1">Please try again later.</p>
            </div>
          )}

          {/* Empty state */}
          {!error && posts.length === 0 && (
            <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-3">
              <PenLine className="w-10 h-10 text-muted-foreground" />
              <p className="font-medium text-foreground">No posts yet</p>
              <p className="text-sm mt-1">Check back soon for updates.</p>
            </div>
          )}

          {/* Post grid */}
          {!error && posts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer
        companyName={SITE_CONFIG.name}
        tagline={SITE_CONFIG.tagline}
        whatsappLink={SITE_CONFIG.whatsappLink}
        whatsappLabel={SITE_CONFIG.whatsappLabel}
      />
    </>
  );
}
