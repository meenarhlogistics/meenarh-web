import type { LucideIcon } from "lucide-react";
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

export type AdminNavChild = {
  href: string;
  label: string;
};

export type AdminNavItem = {
  href?: string;
  label: string;
  icon: LucideIcon;
  children?: AdminNavChild[];
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Orders",
    icon: Package,
    children: [
      { href: "/admin/orders", label: "Single Order" },
      { href: "/admin/bulk-orders", label: "Bulk Order" },
    ],
  },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/region-rates", label: "Delivery rates", icon: MapPinned },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/promo-codes", label: "Promo Codes", icon: Tag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/users", label: "Admin Users", icon: Shield },
];
