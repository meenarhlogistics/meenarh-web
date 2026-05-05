"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, loadAuth, user } = useAuthStore();
  const { fetchCart } = useCartStore();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    // Load auth from localStorage on mount
    loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    // Fetch cart when authenticated
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    if (user?.is_phone_verified) return;
    if (pathname === "/dashboard/verify-phone") return;
    router.replace("/dashboard/verify-phone");
  }, [isAuthenticated, isLoading, pathname, router, user?.is_phone_verified]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      {isDesktop && <DashboardSidebar />}
      
      {/* Mobile Navigation */}
      {!isDesktop && <DashboardNav />}
      
      {/* Main Content */}
      <main
        className={`
          ${isDesktop ? "ml-[280px]" : ""}
          max-w-7xl mx-auto px-4 py-8
        `}
      >
        {children}
      </main>
    </div>
  );
}
