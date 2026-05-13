"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useAdminAuthStore } from "@/lib/store/adminAuthStore";
import { Button } from "@/components/ui";
import { adminNavItems } from "@/components/admin/adminNavConfig";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAdminAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      // Full reload so any cached admin state is dropped with the cleared cookies.
      window.location.href = "/admin/login";
    }
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const isParentActive = (children?: { href: string }[]) =>
    !!children?.some((c) => isActive(c.href));

  // Auto-expand any parent whose child route is currently active
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    adminNavItems.forEach((item) => {
      if (item.children && isParentActive(item.children)) {
        initial[item.label] = true;
      }
    });
    return initial;
  });

  const toggleMenu = (label: string) =>
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-card border-r border-border flex flex-col">
      <div className="p-4 sm:p-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/meenarh logo.svg"
            alt="Meenarh Logistics"
            width={36}
            height={36}
            className="w-9 h-9"
          />
          <div>
            <h1 className="font-semibold text-foreground">Meenarh</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
        {adminNavItems.map((item) => {
          const Icon = item.icon;

          if (item.children && item.children.length > 0) {
            const parentActive = isParentActive(item.children);
            const open = openMenus[item.label] ?? false;

            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => toggleMenu(item.label)}
                  aria-expanded={open}
                  className={`
                    group w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
                    transition-colors duration-200
                    ${
                      parentActive
                        ? "bg-accent text-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div className="mt-1 ml-7 pl-3 border-l border-border space-y-1">
                    {item.children.map((child) => {
                      const childActive = isActive(child.href);
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

          // Standard leaf item
          const href = item.href!;
          return (
            <Link
              key={href}
              href={href}
              className={`
              group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
              transition-colors transition-transform duration-200
              ${
                isActive(href)
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:-translate-y-0.5"
              }
            `}
            >
              <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 sm:p-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-foreground truncate">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.role || "admin"}
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
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </aside>
  );
}
