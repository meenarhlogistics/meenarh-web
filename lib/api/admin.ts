import axios from "axios";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${encodeURIComponent(name)}=`;
  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(prefix))
    ?.slice(prefix.length) ?? null;
}

const adminClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

adminClient.interceptors.request.use((config) => {
  const method = (config.method || "get").toLowerCase();
  const unsafe = ["post", "put", "patch", "delete"].includes(method);
  if (unsafe) {
    const csrf = getCookie("csrf_token");
    if (csrf) {
      config.headers["X-CSRF-Token"] = decodeURIComponent(csrf);
    }
  }
  return config;
});

adminClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined" && !window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export const adminApi = {
  // Auth
  async login(email: string, password: string) {
    const res = await adminClient.post("/admin/login", { email, password });
    return res.data;
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    const res = await adminClient.post<{ success: boolean; message: string }>("/admin/logout", {});
    return res.data;
  },

  // Blog
  async getBlogPosts() {
    const res = await adminClient.get("/admin/blog");
    return res.data;
  },
  async getBlogPost(id: number) {
    const res = await adminClient.get(`/admin/blog/${id}`);
    return res.data;
  },
  async createBlogPost(data: { title: string; content: string; cover_image_url?: string; status?: string }) {
    const res = await adminClient.post("/admin/blog", data);
    return res.data;
  },
  async updateBlogPost(id: number, data: { title?: string; content?: string; cover_image_url?: string; status?: string }) {
    const res = await adminClient.put(`/admin/blog/${id}`, data);
    return res.data;
  },
  async deleteBlogPost(id: number) {
    const res = await adminClient.delete(`/admin/blog/${id}`);
    return res.data;
  },

  // Settings
  async getSettings() {
    const res = await adminClient.get("/admin/settings");
    return res.data;
  },
  async updateSettings(settings: Record<string, string>) {
    const res = await adminClient.put("/admin/settings", settings);
    return res.data;
  },

  // Customers
  async getCustomers() {
    const res = await adminClient.get("/admin/customers");
    return res.data;
  },
  async getCustomer(id: number) {
    const res = await adminClient.get(`/admin/customers/${id}`);
    return res.data;
  },
  async getCustomerOrders(id: number) {
    const res = await adminClient.get(`/admin/customers/${id}/orders`);
    return res.data;
  },
  async getCustomerCart(id: number) {
    const res = await adminClient.get(`/admin/customers/${id}/cart`);
    return res.data;
  },

  // Promo Codes
  async getPromoCodes() {
    const res = await adminClient.get("/admin/promo-codes");
    return res.data;
  },
  async getPromoCode(id: number) {
    const res = await adminClient.get(`/admin/promo-codes/${id}`);
    return res.data;
  },
  async createPromoCode(data: {
    code: string;
    discount_type: string;
    discount_value: number;
    min_order_value?: number | null;
    max_uses?: number | null;
    expires_at?: string | null;
  }) {
    const res = await adminClient.post("/admin/promo-codes", data);
    return res.data;
  },
  async updatePromoCode(id: number, data: Record<string, unknown>) {
    const res = await adminClient.put(`/admin/promo-codes/${id}`, data);
    return res.data;
  },
  async togglePromoCode(id: number) {
    const res = await adminClient.patch(`/admin/promo-codes/${id}/toggle`);
    return res.data;
  },
  async deletePromoCode(id: number) {
    const res = await adminClient.delete(`/admin/promo-codes/${id}`);
    return res.data;
  },

  // Analytics
  async getAnalyticsOverview(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);
    const res = await adminClient.get(`/admin/analytics/overview?${params}`);
    return res.data;
  },
  async getAnalyticsLocations(limit?: number) {
    const res = await adminClient.get(`/admin/analytics/locations${limit ? `?limit=${limit}` : ""}`);
    return res.data;
  },
  async getAnalyticsTrends(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);
    const res = await adminClient.get(`/admin/analytics/trends?${params}`);
    return res.data;
  },

  // Orders
  async getOrders() {
    const res = await adminClient.get("/admin/orders");
    return res.data;
  },
  async updateOrderStatus(id: number, status: string, note?: string) {
    const res = await adminClient.patch(`/admin/orders/${id}/status`, { status, note });
    return res.data;
  },

  // Bulk orders
  async getBulkOrders() {
    const res = await adminClient.get("/admin/bulk-orders");
    return res.data;
  },
  async getBulkOrder(id: number) {
    const res = await adminClient.get(`/admin/bulk-orders/${id}`);
    return res.data;
  },
  async updateBulkItemStatus(bulkId: number, itemId: number, status: string, note?: string) {
    const res = await adminClient.patch(
      `/admin/bulk-orders/${bulkId}/items/${itemId}/status`,
      { status, note }
    );
    return res.data;
  },

  // Region flat rates (pickup × delivery matrix)
  async listRegionPickups() {
    const res = await adminClient.get("/admin/regions/pickups");
    return res.data;
  },
  async createRegionPickup(data: {
    name: string;
    slug?: string | null;
    sort_order?: number;
    is_active?: boolean;
  }) {
    const res = await adminClient.post("/admin/regions/pickups", data);
    return res.data;
  },
  async updateRegionPickup(id: number, data: Record<string, unknown>) {
    const res = await adminClient.put(`/admin/regions/pickups/${id}`, data);
    return res.data;
  },
  async deleteRegionPickup(id: number) {
    const res = await adminClient.delete(`/admin/regions/pickups/${id}`);
    return res.data;
  },

  async listRegionDeliveries() {
    const res = await adminClient.get("/admin/regions/deliveries");
    return res.data;
  },
  async createRegionDelivery(data: {
    name: string;
    description?: string | null;
    sort_order?: number;
    is_active?: boolean;
  }) {
    const res = await adminClient.post("/admin/regions/deliveries", data);
    return res.data;
  },
  async updateRegionDelivery(id: number, data: Record<string, unknown>) {
    const res = await adminClient.put(`/admin/regions/deliveries/${id}`, data);
    return res.data;
  },
  async deleteRegionDelivery(id: number) {
    const res = await adminClient.delete(`/admin/regions/deliveries/${id}`);
    return res.data;
  },

  async listRegionRates(pickup_region_id?: number) {
    const q =
      pickup_region_id != null && pickup_region_id > 0
        ? `?pickup_region_id=${pickup_region_id}`
        : "";
    const res = await adminClient.get(`/admin/regions/rates${q}`);
    return res.data;
  },
  async createRegionRate(data: {
    pickup_region_id: number;
    delivery_region_id: number;
    price_ngn: number;
    eta_min_hours: number;
    eta_max_hours: number;
    eta_label?: string | null;
    is_active?: boolean;
  }) {
    const res = await adminClient.post("/admin/regions/rates", data);
    return res.data;
  },
  async updateRegionRate(id: number, data: Record<string, unknown>) {
    const res = await adminClient.put(`/admin/regions/rates/${id}`, data);
    return res.data;
  },
  async deleteRegionRate(id: number) {
    const res = await adminClient.delete(`/admin/regions/rates/${id}`);
    return res.data;
  },

  // Admin users
  async createAdminUser(name: string, email: string, password: string, role: "admin" | "staff") {
    const res = await adminClient.post("/admin/users", { name, email, password, role });
    return res.data;
  },
};

export default adminClient;
