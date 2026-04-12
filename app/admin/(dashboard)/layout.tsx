"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/lib/store/adminAuthStore";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, loadAuth } = useAdminAuthStore();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {isDesktop && <AdminSidebar />}
      {!isDesktop && <AdminNav />}
      <main
        className={`
          ${isDesktop ? "ml-[260px]" : ""}
          max-w-7xl mx-auto px-4 py-6 sm:py-8
        `}
      >
        {children}
      </main>
    </div>
  );
}
