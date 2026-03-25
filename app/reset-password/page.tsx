import { Suspense } from "react";
import { ResetPasswordForm } from "./ResetPasswordForm";

function ResetPasswordFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <p className="text-muted-foreground text-sm">Loading…</p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
