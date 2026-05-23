"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { paymentsApi, type PaystackVerifyResponse } from "@/lib/api/payments";
import { useCartStore } from "@/lib/store/cartStore";
import type { CheckoutResponse } from "@/types";
import { getApiErrorMessage } from "@/lib/errors/apiError";

type SuccessData = NonNullable<CheckoutResponse["data"]>;

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_MS = 180000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isConfirmed(res: PaystackVerifyResponse) {
  return res.payment_state === "confirmed" || (!res.payment_state && res.success && !!res.data);
}

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchCart = useCartStore((s) => s.fetchCart);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [pendingPreview, setPendingPreview] = useState<SuccessData | null>(null);
  const [success, setSuccess] = useState<SuccessData | null>(null);

  const retryVerify = async () => {
    if (!reference) return;
    setLoading(true);
    setError("");
    setTimedOut(false);
    try {
      const res = await paymentsApi.verifyPaystack(reference);
      if (isConfirmed(res) && res.data) {
        setSuccess(res.data);
        setPendingPreview(null);
        await fetchCart();
      } else if (res.payment_state === "pending_payment" && res.data) {
        setPendingPreview(res.data);
        setTimedOut(true);
      } else {
        setError("Verification did not complete successfully.");
      }
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Could not verify payment. If you were charged, contact support with your reference."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const ref = searchParams.get("reference");
    if (!ref) {
      setError("Missing payment reference. Return to checkout and try again.");
      setLoading(false);
      return;
    }

    setReference(ref);
    let cancelled = false;

    (async () => {
      const started = Date.now();
      try {
        while (Date.now() - started < MAX_POLL_MS) {
          const res = await paymentsApi.verifyPaystack(ref);
          if (cancelled) return;

          if (isConfirmed(res) && res.data) {
            setSuccess(res.data);
            await fetchCart();
            return;
          }

          if (res.payment_state === "pending_payment" && res.data) {
            setPendingPreview(res.data);
          }

          await sleep(POLL_INTERVAL_MS);
        }

        if (!cancelled) {
          setTimedOut(true);
        }
      } catch (err) {
        if (cancelled) return;
        const msg = getApiErrorMessage(
          err,
          "Could not verify payment. If you were charged, contact support with your reference."
        );
        if (msg === "EMAIL_NOT_VERIFIED") {
          setError("Verify your email before orders can be created.");
          router.push("/dashboard/verify-email");
          return;
        }
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, fetchCart, router]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Confirming your payment…</p>
          {pendingPreview?.entries?.length || pendingPreview?.orders?.length ? (
            <p className="text-sm text-muted-foreground mt-3">
              Your order is reserved. Tracking will appear here once payment clears.
            </p>
          ) : null}
        </Card>
      </div>
    );
  }

  if (timedOut && !success) {
    const previewEntries =
      pendingPreview?.entries && pendingPreview.entries.length > 0
        ? pendingPreview.entries
        : pendingPreview?.orders?.map((order) => ({
            kind: "single" as const,
            tracking_number: order.tracking_number,
            price: order.price,
          })) ?? [];

    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 text-center space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">Payment still processing</h1>
          <p className="text-muted-foreground text-sm">
            Your bank may take a few minutes to confirm. We have reserved your order
            {reference ? (
              <>
                {" "}
                (reference <span className="font-mono">{reference}</span>)
              </>
            ) : null}
            .
          </p>
          {previewEntries.length > 0 && (
            <div className="bg-muted rounded-lg p-4 text-left space-y-2">
              <p className="text-sm text-muted-foreground text-center">Tracking numbers</p>
              {previewEntries.map((entry) => (
                <p key={entry.tracking_number} className="font-mono text-sm text-foreground">
                  {entry.tracking_number}
                </p>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" onClick={retryVerify}>
              Check again
            </Button>
            <Button variant="secondary" onClick={() => router.push("/dashboard/orders")}>
              View my orders
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 text-center space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">Payment verification</h1>
          <p className="text-destructive text-sm">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="secondary" onClick={() => router.push("/dashboard/cart")}>
              Back to checkout
            </Button>
            <Button variant="primary" onClick={() => router.push("/dashboard")}>
              Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!success) return null;

  const entries =
    success.entries && success.entries.length > 0
      ? success.entries
      : success.orders.map((order) => ({
          kind: success.checkout_kind === "bulk" ? "bulk" : "single",
          tracking_number: order.tracking_number,
          price: order.price,
          ...(success.bulk_item_count != null ? { bulk_item_count: success.bulk_item_count } : {}),
        }));
  const hasBulk = entries.some((entry) => entry.kind === "bulk");
  const hasSingle = entries.some((entry) => entry.kind === "single");
  const isMixed = success.checkout_kind === "mixed" || (hasBulk && hasSingle);
  const isBulkOnly = !isMixed && hasBulk;
  const deliveryCount = success.total_delivery_count ?? success.total_orders;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="p-8 text-center">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-3xl font-semibold text-foreground mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground mb-8">
          {isMixed ? (
            <>
              Mixed checkout created successfully — <strong>{deliveryCount} deliveries</strong>
            </>
          ) : isBulkOnly ? (
            <>
              Bulk order created successfully
              {success.bulk_item_count != null ? (
                <> — <strong>{success.bulk_item_count} items</strong></>
              ) : null}
            </>
          ) : (
            <>
              {success.total_orders}{" "}
              {success.total_orders === 1 ? "order" : "orders"} created successfully
            </>
          )}
        </p>

        <div className="bg-muted rounded-lg p-6 mb-8 text-left">
          <p className="text-sm text-muted-foreground mb-4 text-center">
            {isBulkOnly ? "Bulk order tracking" : "Tracking numbers"}
          </p>
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <div
                key={`${entry.kind}-${entry.tracking_number}`}
                className="bg-background rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {entry.kind === "bulk" ? "Bulk order" : `Order ${index + 1}`}
                  </p>
                  <p className="font-mono text-lg font-semibold text-foreground">
                    {entry.tracking_number}
                  </p>
                  {entry.kind === "bulk" && entry.bulk_item_count != null && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {entry.bulk_item_count} item{entry.bulk_item_count !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">
                    {entry.price != null ? `₦${Number(entry.price).toFixed(2)}` : "—"}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(entry.tracking_number)}
                    className="text-xs text-muted-foreground hover:text-foreground mt-1"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-6 pt-4 flex items-center justify-between">
            <span className="text-lg font-semibold text-foreground">Total paid</span>
            <span className="text-2xl font-bold text-primary">
              ₦{Number(success.total_price).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isBulkOnly ? (
            <>
              <Button variant="primary" size="lg" onClick={() => router.push("/dashboard/create-bulk")}>
                New bulk order
              </Button>
              <Button variant="secondary" size="lg" onClick={() => router.push("/dashboard/orders")}>
                View my orders
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" size="lg" onClick={() => router.push("/dashboard")}>
                {isMixed ? "Create another delivery" : "Create new order"}
              </Button>
              <Button variant="secondary" size="lg" onClick={() => router.push("/dashboard/orders")}>
                View my orders
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function PaystackCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading…</p>
          </Card>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
