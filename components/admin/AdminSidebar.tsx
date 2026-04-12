"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAdminAuthStore } from "@/lib/store/adminAuthStore";
import { Button } from "@/components/ui";
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Tag,
  Settings,
  Shield,
  MapPinned,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/region-rates", label: "Delivery rates", icon: MapPinned },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/promo-codes", label: "Promo Codes", icon: Tag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Admin Users", icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAdminAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/admin/login";
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
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

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
              transition-colors transition-transform duration-200
              ${
                isActive(item.href)
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

      <div className="p-4 border-t border-border space-y-3">
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
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
