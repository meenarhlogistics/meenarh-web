"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface PaystackReferenceCopyProps {
  reference?: string | null;
  className?: string;
}

export function PaystackReferenceCopy({ reference, className = "" }: PaystackReferenceCopyProps) {
  const [copied, setCopied] = useState(false);

  if (!reference) {
    return <span className={`text-xs text-muted-foreground ${className}`}>—</span>;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className={`flex items-center gap-1.5 min-w-0 ${className}`}>
      <span
        className="font-mono text-xs text-foreground truncate"
        title={reference}
      >
        {reference}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy Paystack reference"}
        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
        ) : (
          <Copy className="w-3.5 h-3.5" strokeWidth={2} />
        )}
      </button>
    </div>
  );
}
