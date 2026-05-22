"use client";

import { useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Button, Input, FormErrorAlert } from "@/components/ui";
import { getApiErrorDetails, type ParsedApiError } from "@/lib/errors/apiError";
import { useAdminAuthStore } from "@/lib/store/adminAuthStore";

interface FormData {
  name: string;
  email: string;
  password: string;
  role: "admin" | "staff";
}

interface CreatedUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function CreateAdminUserPage() {
  const { user: currentUser } = useAdminAuthStore();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });
  const [saving, setSaving] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ParsedApiError | null>(null);
  const [created, setCreated] = useState<CreatedUser | null>(null);

  const isAdmin = currentUser?.role === "admin";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorDetails(null);
    setCreated(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails(null);
    setCreated(null);

    if (!form.name.trim() || form.name.trim().length < 2) {
      setErrorDetails({ message: "Name must be at least 2 characters" });
      return;
    }
    if (!form.email.includes("@")) {
      setErrorDetails({ message: "Enter a valid email address" });
      return;
    }
    if (form.password.length < 6) {
      setErrorDetails({ message: "Password must be at least 6 characters" });
      return;
    }

    setSaving(true);
    try {
      const res = await adminApi.createAdminUser(form.name, form.email, form.password, form.role);
      setCreated(res.data);
      setForm({ name: "", email: "", password: "", role: "staff" });
    } catch (err) {
      setErrorDetails(getApiErrorDetails(err, "Failed to create user"));
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-lg space-y-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Create Admin User</h1>
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 text-center">
          <p className="text-muted-foreground">
            Only users with the <span className="font-medium text-foreground">admin</span> role can create new admin or staff accounts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Create Admin User</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Add a new admin or staff member to the panel
        </p>
      </div>

      <FormErrorAlert
        message={errorDetails?.message}
        items={errorDetails?.items}
      />

      {created && (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl space-y-1">
          <p className="text-sm font-medium text-primary">User created successfully</p>
          <p className="text-sm text-foreground">
            <span className="text-muted-foreground">Name:</span> {created.name}
          </p>
          <p className="text-sm text-foreground">
            <span className="text-muted-foreground">Email:</span> {created.email}
          </p>
          <p className="text-sm text-foreground">
            <span className="text-muted-foreground">Role:</span>{" "}
            <span className="capitalize">{created.role}</span>
          </p>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. John Adeyemi"
            id="user-name"
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="e.g. john@meenarh.com"
            id="user-email"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            id="user-password"
            required
          />

          <div>
            <label htmlFor="user-role" className="block text-sm font-medium text-foreground mb-2">
              Role
            </label>
            <select
              id="user-role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-muted border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            >
              <option value="staff">Staff — can manage orders and view customers</option>
              <option value="admin">Admin — full access including user management</option>
            </select>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" disabled={saving} className="w-full">
              {saving ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </div>

      {/* Role info */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        <p className="text-sm font-medium text-foreground">Role permissions</p>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p><span className="font-medium text-foreground">Staff</span> — view & manage orders, view customers, manage blog, view analytics</p>
          <p><span className="font-medium text-foreground">Admin</span> — all staff permissions + update settings, manage promo codes, create users</p>
        </div>
      </div>
    </div>
  );
}
