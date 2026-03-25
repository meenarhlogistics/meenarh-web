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
"[project]/app/admin/(dashboard)/users/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CreateAdminUserPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api/admin.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/ui/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ButtonLegacy$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/ButtonLegacy.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2f$adminAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store/adminAuthStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function CreateAdminUserPage() {
    _s();
    const { user: currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2f$adminAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAdminAuthStore"])();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        email: "",
        password: "",
        role: "staff"
    });
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [created, setCreated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const isAdmin = currentUser?.role === "admin";
    const handleChange = (e)=>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        setError("");
        setCreated(null);
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setCreated(null);
        if (!form.name.trim() || form.name.trim().length < 2) {
            setError("Name must be at least 2 characters");
            return;
        }
        if (!form.email.includes("@")) {
            setError("Enter a valid email address");
            return;
        }
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        setSaving(true);
        try {
            const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2f$admin$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["adminApi"].createAdminUser(form.name, form.email, form.password, form.role);
            setCreated(res.data);
            setForm({
                name: "",
                email: "",
                password: "",
                role: "staff"
            });
        } catch (err) {
            const e = err;
            setError(e.response?.data?.message || "Failed to create user");
        } finally{
            setSaving(false);
        }
    };
    if (!isAdmin) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-lg space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-semibold text-foreground",
                    children: "Create Admin User"
                }, void 0, false, {
                    fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-card border border-border rounded-xl p-8 text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground",
                        children: [
                            "Only users with the ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium text-foreground",
                                children: "admin"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                                lineNumber: 81,
                                columnNumber: 33
                            }, this),
                            " role can create new admin or staff accounts."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
            lineNumber: 77,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-lg space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-semibold text-foreground",
                        children: "Create Admin User"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground text-sm mt-1",
                        children: "Add a new admin or staff member to the panel"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                lineNumber: 98,
                columnNumber: 9
            }, this),
            created && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 bg-primary/10 border border-primary/20 rounded-xl space-y-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-primary",
                        children: "User created successfully"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-muted-foreground",
                                children: "Name:"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                                lineNumber: 107,
                                columnNumber: 13
                            }, this),
                            " ",
                            created.name
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                        lineNumber: 106,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-muted-foreground",
                                children: "Email:"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this),
                            " ",
                            created.email
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-muted-foreground",
                                children: "Role:"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                                lineNumber: 113,
                                columnNumber: 13
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "capitalize",
                                children: created.role
                            }, void 0, false, {
                                fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                lineNumber: 104,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-card border border-border rounded-xl p-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            label: "Full Name",
                            name: "name",
                            value: form.name,
                            onChange: handleChange,
                            placeholder: "e.g. John Adeyemi",
                            id: "user-name",
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            label: "Email Address",
                            type: "email",
                            name: "email",
                            value: form.email,
                            onChange: handleChange,
                            placeholder: "e.g. john@meenarh.com",
                            id: "user-email",
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            label: "Password",
                            type: "password",
                            name: "password",
                            value: form.password,
                            onChange: handleChange,
                            placeholder: "Minimum 6 characters",
                            id: "user-password",
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: "user-role",
                                    className: "block text-sm font-medium text-foreground mb-2",
                                    children: "Role"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    id: "user-role",
                                    name: "role",
                                    value: form.role,
                                    onChange: handleChange,
                                    className: "w-full px-4 py-3 bg-muted border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "staff",
                                            children: "Staff — can manage orders and view customers"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                                            lineNumber: 164,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "admin",
                                            children: "Admin — full access including user management"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                                            lineNumber: 165,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                                    lineNumber: 157,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ButtonLegacy$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "submit",
                                variant: "primary",
                                disabled: saving,
                                className: "w-full",
                                children: saving ? "Creating..." : "Create User"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                                lineNumber: 170,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                    lineNumber: 120,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-card border border-border rounded-xl p-4 space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-foreground",
                        children: "Role permissions"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1 text-sm text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-foreground",
                                        children: "Staff"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                                        lineNumber: 181,
                                        columnNumber: 14
                                    }, this),
                                    " — view & manage orders, view customers, manage blog, view analytics"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-foreground",
                                        children: "Admin"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                                        lineNumber: 182,
                                        columnNumber: 14
                                    }, this),
                                    " — all staff permissions + update settings, manage promo codes, create users"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                                lineNumber: 182,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/(dashboard)/users/page.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
_s(CreateAdminUserPage, "DKVyPlzA1OSKeQ477ROhArMse64=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2f$adminAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAdminAuthStore"]
    ];
});
_c = CreateAdminUserPage;
var _c;
__turbopack_context__.k.register(_c, "CreateAdminUserPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_23e00053._.js.map