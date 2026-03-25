"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useCartStore } from "@/lib/store/cartStore";
import { Button, Badge } from "@/components/ui";
import { Package, ShoppingCart, ClipboardList, Search } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Create Order", icon: Package },
  { href: "/dashboard/cart", label: "Cart", icon: ShoppingCart },
  { href: "/dashboard/orders", label: "My Orders", icon: ClipboardList },
  { href: "/dashboard/track", label: "Track Order", icon: Search },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
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
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isCart = item.href === "/dashboard/cart";

          return (
            <Link
              key={item.href}
              href={item.href}
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
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
