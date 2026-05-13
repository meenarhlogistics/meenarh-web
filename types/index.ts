// User types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  default_address?: string;
  is_phone_verified?: boolean;
  is_email_verified?: boolean;
  /** When false, backend skips mandatory verification (local dev without Resend). Omitted/truthy = enforced. */
  email_verification_enforced?: boolean;
}

// Order types
export interface Order {
  id: number;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  pickup_address: string;
  delivery_address: string;
  package_description?: string;
  item_value?: number;
  quantity?: number;
  is_fragile?: boolean;
  price: number | null;
  pickup_region_id?: number | null;
  delivery_region_id?: number | null;
  delivery_region_area_id?: number | null;
  eta_min_hours?: number | null;
  eta_max_hours?: number | null;
  eta_label?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderEvent {
  id: number;
  status: string;
  description: string;
  created_at: string;
}

export interface OrderDetail extends Order {
  sender_phone: string;
  receiver_phone: string;
  package_description?: string;
  zone_id?: number | null;
  distance_km?: number | null;
  events: OrderEvent[];
}

// API request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  default_address?: string;
}

export interface CreateOrderRequest {
  sender_name?: string;
  sender_phone?: string;
  pickup_address?: string;
  receiver_name: string;
  receiver_phone: string;
  delivery_address: string;
  package_description?: string;
  item_value?: number;
  quantity?: number;
  is_fragile?: boolean;
  zone_id?: number;
  distance_km?: number;
  pickup_region_id?: number;
  delivery_region_id?: number;
  delivery_region_area_id?: number;
}

// Cart types
export interface CartItem {
  id: number;
  user_id: number;
  kind?: "single";
  sender_name?: string;
  sender_phone?: string;
  pickup_address?: string;
  receiver_name: string;
  receiver_phone: string;
  delivery_address: string;
  package_description?: string;
  item_value?: number;
  quantity?: number;
  is_fragile?: boolean;
  zone_id?: number | null;
  distance_km?: number | null;
  pickup_region_id?: number | null;
  delivery_region_id?: number | null;
  delivery_region_area_id?: number | null;
  eta_min_hours?: number | null;
  eta_max_hours?: number | null;
  eta_label?: string | null;
  estimated_price?: number | null;
  created_at: string;
  updated_at?: string;
}

export interface BulkCartItem {
  id: number;
  cart_bulk_entry_id: number;
  sort_index: number;
  pickup_region_id: number;
  pickup_address?: string | null;
  delivery_region_id: number;
  delivery_region_area_id?: number | null;
  delivery_address: string;
  receiver_name: string;
  receiver_phone: string;
  package_description?: string | null;
  item_value?: number | null;
  quantity?: number;
  is_fragile?: boolean;
  estimated_price?: number | null;
  eta_min_hours?: number | null;
  eta_max_hours?: number | null;
  eta_label?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface BulkCartEntry {
  id: number;
  user_id: number;
  kind: "bulk";
  sender_name?: string;
  sender_phone?: string;
  pickup_address?: string;
  estimated_total?: number | null;
  estimated_price?: number | null;
  item_count: number;
  items: BulkCartItem[];
  created_at: string;
  updated_at?: string;
}

export type CartEntry = (CartItem & { kind: "single" }) | BulkCartEntry;

// API response types
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    verificationEmailSent?: boolean;
  };
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    tracking_number: string;
    price: number;
  };
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
}

export interface TrackOrderResponse {
  success: boolean;
  data: OrderDetail;
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}

export interface CartResponse {
  success: boolean;
  data: CartEntry[];
}

export interface AddToCartResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    estimated_price: number | null;
  };
}

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: {
    orders: Array<{
      tracking_number: string;
      price: number;
    }>;
    total_orders: number;
    total_price: number;
    entries?: Array<{
      kind: "single" | "bulk";
      tracking_number: string;
      price: number;
      bulk_item_count?: number;
    }>;
    /** Discriminates cart vs bulk checkout so the callback page can tailor success copy. */
    checkout_kind?: "cart" | "bulk" | "mixed";
    /** Number of items inside a bulk order (only present when checkout_kind === "bulk"). */
    bulk_item_count?: number;
    total_delivery_count?: number;
  };
}

// Zone types
export interface Zone {
  id: number;
  name: string;
  base_price: number;
  price_per_km: number;
}

// ─── Bulk order types ─────────────────────────────────────────────────────────

/** One destination line within a bulk order */
export interface BulkOrderItem {
  id: number;
  bulk_order_id: number;
  sort_index: number;
  /** Required per-item pickup zone */
  pickup_region_id: number;
  /** Effective pickup street address (override or inherited from parent) */
  pickup_address: string;
  delivery_region_id: number;
  delivery_region_area_id?: number | null;
  delivery_address: string;
  receiver_name: string;
  receiver_phone: string;
  package_description?: string | null;
  item_value?: number | null;
  quantity?: number;
  is_fragile?: boolean;
  price_ngn: number;
  eta_min_hours?: number | null;
  eta_max_hours?: number | null;
  eta_label?: string | null;
  status: 'Pending' | 'Picked Up' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  created_at: string;
  updated_at: string;
  events?: OrderEvent[];
}

/** Parent bulk order (summary row, no item events) */
export interface BulkOrder {
  id: number;
  tracking_number: string;
  sender_name: string;
  sender_phone?: string;
  pickup_address: string;
  price: number;
  status: 'Order Created';
  created_at: string;
  updated_at: string;
  item_count?: number;
  type?: 'bulk';
}

/** Full bulk order with items and events */
export interface BulkOrderDetail extends BulkOrder {
  events: OrderEvent[];
  items: BulkOrderItem[];
  customer_name?: string;
  customer_email?: string;
}

/** Item shape inside CreateBulkOrderRequest */
export interface BulkOrderItemRequest {
  pickup_region_id: number;
  pickup_address?: string;
  delivery_region_id: number;
  delivery_region_area_id?: number;
  delivery_address: string;
  receiver_name: string;
  receiver_phone: string;
  package_description?: string;
  item_value?: number;
  quantity?: number;
  is_fragile?: boolean;
}

export interface CreateBulkOrderRequest {
  sender_name?: string;
  sender_phone?: string;
  pickup_address?: string;
  items: BulkOrderItemRequest[];
}

export interface BulkOrderResponse {
  success: boolean;
  message: string;
  data: {
    tracking_number: string;
    total_price: number;
    item_count: number;
  };
}

export interface BulkOrdersResponse {
  success: boolean;
  data: BulkOrder[];
}

export interface BulkOrderDetailResponse {
  success: boolean;
  data: BulkOrderDetail;
}

/** Unified history entry (single order or bulk order header) */
export type OrderHistoryEntry =
  | (Order & { type: 'single' })
  | (BulkOrder & { type: 'bulk' });
