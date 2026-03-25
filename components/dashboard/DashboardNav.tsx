"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { Button, Badge } from "@/components/ui";

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const tabs = [
    { name: "Create Order", href: "/dashboard", active: pathname === "/dashboard" },
    { name: "Cart", href: "/dashboard/cart", active: pathname === "/dashboard/cart" },
    { name: "My Orders", href: "/dashboard/orders", active: pathname === "/dashboard/orders" },
    { name: "Track Order", href: "/dashboard/track", active: pathname === "/dashboard/track" },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            className="text-sm"
          >
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar -mb-px">
          {tabs.map((tab) => {
            const isCart = tab.href === "/dashboard/cart";
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
                  tab.active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {tab.name}
                {isCart && cartCount > 0 && (
                  <Badge variant="error" className="ml-1">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
