const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  cover_image_url?: string;
  author_name: string;
  published_at: string;
  created_at: string;
}

export interface BlogPostDetail extends BlogPost {
  content: string;
  status: string;
  updated_at: string;
}

export const blogApi = {
  async getPosts(): Promise<BlogPost[]> {
    const res = await fetch(`${BASE_URL}/blog`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();
    return data.data || [];
  },

  async getPost(slug: string): Promise<BlogPostDetail> {
    const res = await fetch(`${BASE_URL}/blog/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Post not found");
    const data = await res.json();
    return data.data;
  },
};
