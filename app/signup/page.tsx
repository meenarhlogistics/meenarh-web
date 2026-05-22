"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Input, FormErrorAlert } from "@/components/ui";
import { authApi } from "@/lib/api/auth";
import { getApiErrorDetails, type ParsedApiError } from "@/lib/errors/apiError";
import { useAuthStore } from "@/lib/store/authStore";

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    default_address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<ParsedApiError | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorDetails(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails(null);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setErrorDetails({ message: "Passwords do not match" });
      return;
    }

    if (formData.password.length < 6) {
      setErrorDetails({ message: "Password must be at least 6 characters" });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare signup data (exclude confirmPassword and blank optional address)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, default_address, ...signupData } = formData;
      const payload = {
        ...signupData,
        ...(default_address.trim() ? { default_address: default_address.trim() } : {}),
      };

      const response = await authApi.signup(payload);
      
      if (response.success) {
        setAuth(response.data.user);

        router.push("/dashboard/verify-email");
      } else {
        setErrorDetails({
          message: response.message || "Signup failed",
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrorDetails(
        getApiErrorDetails(err, "Failed to create account. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl opacity-40 animate-float"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-40 animate-float-delayed"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Image
            src="/meenarh logo.svg"
            alt="Meenarh Logistics"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <span className="text-xl font-semibold text-foreground">
            Meenarh Logistics
          </span>
        </Link>

        {/* Signup Card */}
        <div className="bg-card rounded-xl shadow-lg border border-border p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Create an account
            </h1>
            <p className="text-muted-foreground">
              Sign up to start sending packages
            </p>
          </div>

          <FormErrorAlert
            message={errorDetails?.message}
            items={errorDetails?.items}
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              id="name"
            />

            <Input
              type="email"
              label="Email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              id="email"
            />

            <Input
              type="tel"
              label="Phone (WhatsApp)"
              name="phone"
              placeholder="+2348012345678"
              value={formData.phone}
              onChange={handleChange}
              required
              id="phone"
            />

            <Input
              type="text"
              label="Default Address (optional)"
              name="default_address"
              placeholder="123 Allen Avenue, Ikeja"
              value={formData.default_address}
              onChange={handleChange}
              id="default_address"
            />

            <Input
              type="password"
              label="Password"
              name="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              id="password"
            />

            <Input
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              id="confirmPassword"
            />

            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-primary"
                id="terms"
              />
              <label htmlFor="terms" className="text-muted-foreground">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
