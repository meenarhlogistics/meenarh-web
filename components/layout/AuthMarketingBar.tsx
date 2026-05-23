import Link from "next/link";
import { trackLoginUrl } from "@/lib/auth/trackLogin";

export function AuthMarketingBar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm"
      aria-label="Marketing links"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <Link href="/" className="font-medium text-foreground hover:text-primary">
          Home
        </Link>
        <Link href="/contact" className="text-muted-foreground hover:text-foreground">
          Contact
        </Link>
        <Link href={trackLoginUrl()} className="text-muted-foreground hover:text-foreground">
          Track
        </Link>
      </div>
    </nav>
  );
}
