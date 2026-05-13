"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { Button, Badge } from "@/components/ui";

interface TabChild {
  name: string;
  href: string;
  prefixMatch?: boolean;
}

interface Tab {
  name: string;
  href?: string;
  prefixMatch?: boolean;
  children?: TabChild[];
}

/** Exact match, or prefix match with a `/` boundary so `/dashboard/create`
 *  does not incorrectly match `/dashboard/create-bulk`. */
function matchPath(pathname: string, href: string, prefixMatch?: boolean) {
  if (!prefixMatch) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export function DashboardNav() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      // Full reload (not router.push) so cached authenticated state is dropped
      // alongside the cleared cookies.
      window.location.href = "/login";
    }
  };

  const tabs: Tab[] = [
    { name: "Overview", href: "/dashboard" },
    {
      name: "Delivery",
      children: [
        { name: "Single Delivery", href: "/dashboard/create", prefixMatch: true },
        { name: "Bulk Delivery", href: "/dashboard/create-bulk", prefixMatch: true },
      ],
    },
    { name: "Cart", href: "/dashboard/cart" },
    { name: "My Orders", href: "/dashboard/orders" },
    { name: "Track Order", href: "/dashboard/track" },
  ];

  const isChildActive = (children?: TabChild[]) =>
    !!children?.some((c) => matchPath(pathname, c.href, c.prefixMatch));

  const openItem = openMenu
    ? tabs.find((t) => t.name === openMenu && t.children)
    : null;

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
            disabled={isLoggingOut}
            className="text-sm"
          >
            {isLoggingOut ? "Logging out…" : "Logout"}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar -mb-px">
          {tabs.map((tab) => {
            if (tab.children && tab.children.length > 0) {
              const parentActive = isChildActive(tab.children);
              const open = openMenu === tab.name;
              return (
                <button
                  key={tab.name}
                  type="button"
                  onClick={() => setOpenMenu(open ? null : tab.name)}
                  aria-expanded={open}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-1 shrink-0 ${
                    parentActive || open
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {tab.name}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
              );
            }

            const href = tab.href!;
            const active = matchPath(pathname, href, tab.prefixMatch);
            const isCart = href === "/dashboard/cart";
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpenMenu(null)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
                  active
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

        {openItem?.children && (
          <div className="border-t border-border bg-muted/30">
            <div className="py-1">
              {openItem.children.map((child) => {
                const childActive = matchPath(
                  pathname,
                  child.href,
                  child.prefixMatch
                );
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={() => setOpenMenu(null)}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      childActive
                        ? "text-primary font-medium bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {child.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
