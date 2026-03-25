(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api/admin.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "adminApi",
    ()=>adminApi,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const adminClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: ("TURBOPACK compile-time value", "http://localhost:5000/api") || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json"
    }
});
adminClient.interceptors.request.use((config)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        const token = localStorage.getItem("meenarh_admin_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});
adminClient.interceptors.response.use((response)=>response, (error)=>{
    if (error.response?.status === 401) {
        localStorage.removeItem("meenarh_admin_token");
        localStorage.removeItem("meenarh_admin_user");
        if (("TURBOPACK compile-time value", "object") !== "undefined" && !window.location.pathname.includes("/admin/login")) {
            window.location.href = "/admin/login";
        }
    }
    return Promise.reject(error);
});
const adminApi = {
    // Auth
    async login (email, password) {
        const res = await adminClient.post("/admin/login", {
            email,
            password
        });
        return res.data;
    },
    // Blog
    async getBlogPosts () {
        const res = await adminClient.get("/admin/blog");
        return res.data;
    },
    async getBlogPost (id) {
        const res = await adminClient.get(`/admin/blog/${id}`);
        return res.data;
    },
    async createBlogPost (data) {
        const res = await adminClient.post("/admin/blog", data);
        return res.data;
    },
    async updateBlogPost (id, data) {
        const res = await adminClient.put(`/admin/blog/${id}`, data);
        return res.data;
    },
    async deleteBlogPost (id) {
        const res = await adminClient.delete(`/admin/blog/${id}`);
        return res.data;
    },
    // Settings
    async getSettings () {
        const res = await adminClient.get("/admin/settings");
        return res.data;
    },
    async updateSettings (settings) {
        const res = await adminClient.put("/admin/settings", settings);
        return res.data;
    },
    // Customers
    async getCustomers () {
        const res = await adminClient.get("/admin/customers");
        return res.data;
    },
    async getCustomer (id) {
        const res = await adminClient.get(`/admin/customers/${id}`);
        return res.data;
    },
    async getCustomerOrders (id) {
        const res = await adminClient.get(`/admin/customers/${id}/orders`);
        return res.data;
    },
    async getCustomerCart (id) {
        const res = await adminClient.get(`/admin/customers/${id}/cart`);
        return res.data;
    },
    // Promo Codes
    async getPromoCodes () {
        const res = await adminClient.get("/admin/promo-codes");
        return res.data;
    },
    async getPromoCode (id) {
        const res = await adminClient.get(`/admin/promo-codes/${id}`);
        return res.data;
    },
    async createPromoCode (data) {
        const res = await adminClient.post("/admin/promo-codes", data);
        return res.data;
    },
    async updatePromoCode (id, data) {
        const res = await adminClient.put(`/admin/promo-codes/${id}`, data);
        return res.data;
    },
    async togglePromoCode (id) {
        const res = await adminClient.patch(`/admin/promo-codes/${id}/toggle`);
        return res.data;
    },
    async deletePromoCode (id) {
        const res = await adminClient.delete(`/admin/promo-codes/${id}`);
        return res.data;
    },
    // Analytics
    async getAnalyticsOverview (startDate, endDate) {
        const params = new URLSearchParams();
        if (startDate) params.set("start_date", startDate);
        if (endDate) params.set("end_date", endDate);
        const res = await adminClient.get(`/admin/analytics/overview?${params}`);
        return res.data;
    },
    async getAnalyticsLocations (limit) {
        const res = await adminClient.get(`/admin/analytics/locations${limit ? `?limit=${limit}` : ""}`);
        return res.data;
    },
    async getAnalyticsTrends (startDate, endDate) {
        const params = new URLSearchParams();
        if (startDate) params.set("start_date", startDate);
        if (endDate) params.set("end_date", endDate);
        const res = await adminClient.get(`/admin/analytics/trends?${params}`);
        return res.data;
    },
    // Orders
    async getOrders () {
        const res = await adminClient.get("/admin/orders");
        return res.data;
    },
    async updateOrderStatus (id, status, note) {
        const res = await adminClient.patch(`/admin/orders/${id}/status`, {
            status,
            note
        });
        return res.data;
    },
    // Admin users
    async createAdminUser (name, email, password, role) {
        const res = await adminClient.post("/admin/users", {
            name,
            email,
            password,
            role
        });
        return res.data;
    }
};
const __TURBOPACK__default__export__ = adminClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/(dashboard)/settings/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SettingsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/admin.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/ui/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ButtonLegacy$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/ButtonLegacy.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Input.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const SETTING_FIELDS = [
    {
        key: "company_name",
        label: "Company Name",
        placeholder: "Meenarh Logistics"
    },
    {
        key: "tagline",
        label: "Tagline",
        placeholder: "Fast, trackable deliveries across Lagos."
    },
    {
        key: "phone",
        label: "Phone Number",
        placeholder: "08012345678"
    },
    {
        key: "email",
        label: "Email Address",
        placeholder: "info@meenarh.com"
    },
    {
        key: "address",
        label: "Office Address",
        placeholder: "Lagos, Nigeria"
    },
    {
        key: "whatsapp",
        label: "WhatsApp Number",
        placeholder: "2348012345678"
    }
];
function SettingsPage() {
    _s();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const fetchSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SettingsPage.useCallback[fetchSettings]": async ()=>{
            try {
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].getSettings();
                setSettings(res.data || {});
            } catch  {
                setError("Failed to load settings");
            } finally{
                setLoading(false);
            }
        }
    }["SettingsPage.useCallback[fetchSettings]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsPage.useEffect": ()=>{
            fetchSettings();
        }
    }["SettingsPage.useEffect"], [
        fetchSettings
    ]);
    const handleChange = (key, value)=>{
        setSettings((prev)=>({
                ...prev,
                [key]: value
            }));
        setSuccess("");
        setError("");
    };
    const handleSave = async ()=>{
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].updateSettings(settings);
            setSuccess("Settings saved successfully");
        } catch  {
            setError("Failed to save settings");
        } finally{
            setSaving(false);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center py-20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
            }, void 0, false, {
                fileName: "[project]/app/admin/(dashboard)/settings/page.tsx",
                lineNumber: 61,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/(dashboard)/settings/page.tsx",
            lineNumber: 60,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-2xl space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-semibold text-foreground",
                        children: "Company Settings"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/(dashboard)/settings/page.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground text-sm mt-1",
                        children: "Manage your company contact details and information"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/(dashboard)/settings/page.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/(dashboard)/settings/page.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/admin/(dashboard)/settings/page.tsx",
                lineNumber: 74,
                columnNumber: 9
            }, this),
            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm",
                children: success
            }, void 0, false, {
                fileName: "[project]/app/admin/(dashboard)/settings/page.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-card border border-border rounded-xl p-6 space-y-4",
                children: [
                    SETTING_FIELDS.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            label: field.label,
                            value: settings[field.key] || "",
                            onChange: (e)=>handleChange(field.key, e.target.value),
                            placeholder: field.placeholder,
                            id: `setting-${field.key}`
                        }, field.key, false, {
                            fileName: "[project]/app/admin/(dashboard)/settings/page.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ButtonLegacy$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "primary",
                            onClick: handleSave,
                            disabled: saving,
                            children: saving ? "Saving..." : "Save Settings"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/(dashboard)/settings/page.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/admin/(dashboard)/settings/page.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/(dashboard)/settings/page.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/(dashboard)/settings/page.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_s(SettingsPage, "mz0gNWEPdHumMaLmyhAGSZCuOoA=");
_c = SettingsPage;
var _c;
__turbopack_context__.k.register(_c, "SettingsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_bcfd260d._.js.map