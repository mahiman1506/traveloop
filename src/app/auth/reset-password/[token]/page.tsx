"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/reset-password/${params.token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Could not reset password.");
        return;
      }

      toast.success(result.message || "Password reset successfully.");
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Reset password failed:", error);
      toast.error("Could not reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Choose a new password for your TravelLoop account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <Input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={form.confirmPassword}
              onChange={(event) =>
                setForm({ ...form, confirmPassword: event.target.value })
              }
              minLength={6}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        <Link
          href="/auth/login"
          className="mt-5 block text-center text-sm font-semibold text-blue-600 hover:underline"
        >
          Back to login
        </Link>
      </Card>
    </main>
  );
}
