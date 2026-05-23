"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/lib/store/authStore";
import { DASHBOARD_TRACK_PATH } from "@/lib/auth/trackLogin";
import type { NavLink } from "@/lib/constants";

interface NavigationProps {
  logo?: string;
  links?: NavLink[];
  ctaText?: string;
  ctaHref?: string;
}

function resolveHref(link: NavLink, isAuthenticated: boolean): string {
  if (link.label === "Track" || link.href === DASHBOARD_TRACK_PATH) {
    return isAuthenticated ? DASHBOARD_TRACK_PATH : link.guestHref ?? link.href;
  }
  return link.href;
}

export function Navigation({
  logo = "Meenarh",
  links = [],
  ctaText = "Request Pickup",
  ctaHref = "#request-pickup",
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, loadAuth } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  const resolvedLinks = useMemo(
    () =>
      links.map((link) => ({
        ...link,
        resolvedHref: resolveHref(link, isAuthenticated),
      })),
    [links, isAuthenticated]
  );

  const displayCtaText = isAuthenticated ? "Dashboard" : ctaText;
  const displayCtaHref = isAuthenticated ? "/dashboard" : ctaHref;

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-5xl">
      <div className="bg-card/70 backdrop-blur-[20px] rounded-xl px-4 py-3 shadow-md border border-border">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/meenarh logo.svg"
              alt={logo}
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-medium text-foreground text-sm hidden sm:block">
              {logo}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-4 xl:gap-5">
            {resolvedLinks.map((link) => {
              const isRoute = !link.resolvedHref.startsWith("#");
              const isActive =
                isRoute &&
                (link.resolvedHref === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.resolvedHref.split("?")[0]));
              const cls = `text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`;
              return isRoute ? (
                <Link key={link.label} href={link.resolvedHref} className={cls}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.resolvedHref} className={cls}>
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href={displayCtaHref} className="hidden sm:block">
              <Button variant="dark" size="sm" className="text-sm">
                {displayCtaText}
              </Button>
            </Link>

            {links.length > 0 && (
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-foreground"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>

        {isMenuOpen && links.length > 0 && (
          <div className="lg:hidden mt-4 pt-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {resolvedLinks.map((link) => {
                const isRoute = !link.resolvedHref.startsWith("#");
                const cls =
                  "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2.5 min-h-11 flex items-center";
                return isRoute ? (
                  <Link
                    key={link.label}
                    href={link.resolvedHref}
                    className={cls}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.resolvedHref}
                    className={cls}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                );
              })}
              <Link
                href={displayCtaHref}
                className="sm:hidden pt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="dark" size="sm" className="w-full text-sm">
                  {displayCtaText}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
