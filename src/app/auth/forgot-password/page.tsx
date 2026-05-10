"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResetUrl("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Could not start password reset.");
        return;
      }

      if (result.resetUrl) {
        setResetUrl(result.resetUrl);
      }

      toast.success(result.message || "Password reset instructions sent.");
    } catch (error) {
      console.error("Forgot password failed:", error);
      toast.error("Could not start password reset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email and TravelLoop will send reset instructions.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        {resetUrl && (
          <div className="mt-5 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm">
            <p className="font-semibold text-blue-900">Reset link ready</p>
            <Link
              href={resetUrl}
              className="mt-2 block break-all text-blue-700 hover:underline"
            >
              {resetUrl}
            </Link>
          </div>
        )}

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
