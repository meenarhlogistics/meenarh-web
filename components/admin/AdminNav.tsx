"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useAdminAuthStore } from "@/lib/store/adminAuthStore";
import { Button } from "@/components/ui";
import { adminNavItems } from "@/components/admin/adminNavConfig";

export function AdminNav() {
  const pathname = usePathname();
  const { user, logout } = useAdminAuthStore();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
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

  const openItem = openMenu
    ? adminNavItems.find((i) => i.label === openMenu && i.children)
    : null;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-primary text-sm font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className="text-sm font-medium text-foreground truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-muted-foreground truncate capitalize">{user?.role || "admin"}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="shrink-0 text-sm"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>

        <div className="flex gap-1 overflow-x-auto no-scrollbar -mb-px pb-px">
          {adminNavItems.map((item) => {
            if (item.children && item.children.length > 0) {
              const parentActive = isParentActive(item.children);
              const open = openMenu === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setOpenMenu(open ? null : item.label)}
                  aria-expanded={open}
                  className={`px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0 flex items-center gap-1 ${
                    parentActive || open
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
              );
            }

            const href = item.href!;
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpenMenu(null)}
                className={`px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {openItem?.children && (
          <div className="border-t border-border bg-muted/30">
            <div className="py-1">
              {openItem.children.map((child) => {
                const childActive = isActive(child.href);
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
                    {child.label}
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
