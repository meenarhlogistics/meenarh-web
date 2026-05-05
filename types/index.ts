// User types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  default_address?: string;
  is_phone_verified?: boolean;
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

// API response types
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
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
  data: CartItem[];
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
  };
}

// Zone types
export interface Zone {
  id: number;
  name: string;
  base_price: number;
  price_per_km: number;
}
