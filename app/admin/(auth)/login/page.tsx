"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { adminApi } from "@/lib/api/admin";
import { useAdminAuthStore } from "@/lib/store/adminAuthStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated, loadAuth } = useAdminAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await adminApi.login(formData.email, formData.password);
      if (response.success) {
        setAuth(response.data.token, response.data.user);
        router.push("/admin");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl opacity-40 animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-40 animate-float-delayed" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Image src="/meenarh logo.svg" alt="Meenarh Logistics" width={40} height={40} className="w-10 h-10" />
          <span className="text-xl font-semibold text-foreground">Meenarh Admin</span>
        </Link>

        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Admin Login</h1>
            <p className="text-muted-foreground">Sign in to the admin panel</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              name="email"
              placeholder="admin@meenarh.com"
              value={formData.email}
              onChange={handleChange}
              required
              id="admin-email"
            />
            <Input
              type="password"
              label="Password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              id="admin-password"
            />
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            &larr; Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
