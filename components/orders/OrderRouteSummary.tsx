export interface OrderRouteSummaryProps {
  pickupRegionName?: string | null;
  pickupAddress?: string | null;
  deliveryRegionName?: string | null;
  deliveryRegionAreaName?: string | null;
  deliveryAddress?: string | null;
}

export function OrderRouteSummary({
  pickupRegionName,
  pickupAddress,
  deliveryRegionName,
  deliveryRegionAreaName,
  deliveryAddress,
}: OrderRouteSummaryProps) {
  const hasPickup = pickupRegionName || pickupAddress;
  const hasDelivery = deliveryRegionName || deliveryAddress;
  const hasSubArea = deliveryRegionAreaName && deliveryRegionAreaName.trim();

  if (!hasPickup && !hasDelivery && !hasSubArea) {
    return null;
  }

  return (
    <div className="mb-6 pb-6 border-b border-border">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Route</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {hasPickup && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Pickup area</p>
            {pickupRegionName && (
              <p className="font-medium text-foreground">{pickupRegionName}</p>
            )}
            {pickupAddress && (
              <p className="text-muted-foreground mt-0.5">{pickupAddress}</p>
            )}
          </div>
        )}
        {hasDelivery && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Delivery area</p>
            {deliveryRegionName && (
              <p className="font-medium text-foreground">{deliveryRegionName}</p>
            )}
            {hasSubArea && (
              <p className="text-foreground mt-0.5">
                <span className="text-muted-foreground">Sub-area: </span>
                {deliveryRegionAreaName}
              </p>
            )}
            {deliveryAddress && (
              <p className="text-muted-foreground mt-0.5">{deliveryAddress}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
