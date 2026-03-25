"use client";

import Link from "next/link";
import Image from "next/image";

export default function VerifyPhoneSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl opacity-40 animate-float"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-40 animate-float-delayed"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 w/full max-w-md text-center">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Image
            src="/meenarh logo.svg"
            alt="Meenarh Logistics"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <span className="text-xl font-semibold text-foreground">
            Meenarh Logistics
          </span>
        </Link>

        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          <h1 className="text-2xl font-semibold text-foreground mb-3">
            Phone verified
          </h1>
          <p className="text-muted-foreground mb-6">
            Your WhatsApp number has been successfully verified. You can now
            continue using your account.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

