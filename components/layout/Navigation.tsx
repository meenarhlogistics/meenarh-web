"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/lib/store/authStore";

interface NavigationProps {
  logo?: string;
  links?: Array<{ label: string; href: string }>;
  ctaText?: string;
  ctaHref?: string;
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

  // Override CTA based on auth state
  const displayCtaText = isAuthenticated ? "Dashboard" : ctaText;
  const displayCtaHref = isAuthenticated ? "/dashboard" : ctaHref;

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-4xl">
      <div className="bg-card/70 backdrop-blur-[20px] rounded-xl px-4 py-3 shadow-md border border-border">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
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

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const isRoute = !link.href.startsWith("#");
              const isActive = isRoute && pathname.startsWith(link.href);
              const cls = `text-sm font-medium transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`;
              return isRoute ? (
                <Link key={link.href} href={link.href} className={cls}>
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href} className={cls}>
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-3">
            <Link href={displayCtaHref}>
              <Button variant="dark" size="sm" className="text-sm">
                {displayCtaText}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            {links.length > 0 && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-foreground"
                aria-label="Toggle menu"
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

        {/* Mobile Menu */}
        {isMenuOpen && links.length > 0 && (
          <div className="md:hidden mt-4 pt-4 border-t border-border">
            <div className="flex flex-col gap-3">
              {links.map((link) => {
                const isRoute = !link.href.startsWith("#");
                const cls = "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2";
                return isRoute ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cls}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cls}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
