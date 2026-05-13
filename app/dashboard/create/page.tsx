import { Suspense } from "react";
import { CreateOrderForm } from "@/components/dashboard/CreateOrderForm";

function CreateOrderFormFallback() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 bg-muted rounded-lg animate-pulse" />
      <div className="h-48 bg-card rounded-xl border border-border animate-pulse" />
    </div>
  );
}

export default function CreateOrderPage() {
  return (
    <Suspense fallback={<CreateOrderFormFallback />}>
      <CreateOrderForm />
    </Suspense>
  );
}
