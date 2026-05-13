"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { Button, Badge } from "@/components/ui";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  Search,
  ChevronDown,
} from "lucide-react";

interface NavChild {
  href: string;
  label: string;
  /** When true, pathname must start with href (for nested routes) */
  prefixMatch?: boolean;
}

interface NavItem {
  href?: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** When true, pathname must start with href (for nested routes) */
  prefixMatch?: boolean;
  children?: NavChild[];
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  {
    label: "Delivery",
    icon: Package,
    children: [
      { href: "/dashboard/create", label: "Single Delivery", prefixMatch: true },
      { href: "/dashboard/create-bulk", label: "Bulk Delivery", prefixMatch: true },
    ],
  },
  { href: "/dashboard/cart", label: "Cart", icon: ShoppingCart },
  { href: "/dashboard/orders", label: "My Orders", icon: ClipboardList },
  { href: "/dashboard/track", label: "Track Order", icon: Search },
];

/** Exact match, or prefix match with a `/` boundary so `/dashboard/create`
 *  does not incorrectly match `/dashboard/create-bulk`. */
function matchPath(pathname: string, href: string, prefixMatch?: boolean) {
  if (!prefixMatch) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isChildActive = (children?: NavChild[]) =>
    !!children?.some((c) => matchPath(pathname, c.href, c.prefixMatch));

  // Auto-expand any parent whose child route is currently active
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navItems.forEach((item) => {
      if (item.children && isChildActive(item.children)) {
        initial[item.label] = true;
      }
    });
    return initial;
  });

  const toggleMenu = (label: string) =>
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      // Full reload so any cached authenticated state (queries, in-memory
      // stores) is dropped along with the cleared cookies.
      window.location.href = "/login";
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/meenarh logo.svg"
            alt="Meenarh Logistics"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <div>
            <h1 className="font-semibold text-foreground text-lg">Meenarh</h1>
            <p className="text-xs text-muted-foreground">Logistics</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.children && item.children.length > 0) {
            const parentActive = isChildActive(item.children);
            const open = openMenus[item.label] ?? false;

            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => toggleMenu(item.label)}
                  aria-expanded={open}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors duration-200
                    ${
                      parentActive
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div className="mt-1 ml-8 pl-3 border-l border-border space-y-1">
                    {item.children.map((child) => {
                      const childActive = matchPath(
                        pathname,
                        child.href,
                        child.prefixMatch
                      );
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`
                            block px-3 py-2 rounded-lg text-sm transition-colors
                            ${
                              childActive
                                ? "bg-accent text-foreground font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }
                          `}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const href = item.href!;
          const isActive = matchPath(pathname, href, item.prefixMatch);
          const isCart = href === "/dashboard/cart";

          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-colors transition-transform duration-200
                ${
                  isActive
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground hover:-translate-y-0.5"
                }
              `}
            >
              <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
              <span className="flex-1">{item.label}</span>
              {isCart && cartCount > 0 && (
                <Badge variant="error" className="ml-auto">
                  {cartCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold text-lg">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-foreground truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out…" : "Logout"}
        </Button>
      </div>
    </aside>
  );
}
