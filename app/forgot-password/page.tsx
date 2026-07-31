"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";
import { Logo } from "@/components/ui/logo";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || sent) return;
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email }, { skipAuth: true });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-[380px] animate-fade-in">
        <div className="mb-9 flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-[16px] font-semibold tracking-tight text-text-primary">Kinetic OS</span>
        </div>

        {!sent ? (
          <>
            <h1 className="font-display text-[24px] font-medium tracking-tight text-text-primary">Forgot password?</h1>
            <p className="mt-1.5 text-[13.5px] text-text-secondary">
              Enter your work email and we&apos;ll send you a link to reset your password.
            </p>

            {error && (
              <div className="mt-5 rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger animate-slide-up">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Work email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-text-muted" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading} disabled={loading}>
                {!loading && (
                  <>
                    Send reset link <ArrowRight className="h-4 w-4" />
                  </>
                )}
                {loading && "Sending…"}
              </Button>
            </form>
          </>
        ) : (
          <div className="animate-slide-up">
            <h1 className="font-display text-[24px] font-medium tracking-tight text-text-primary">Check your email</h1>
            <p className="mt-1.5 text-[13.5px] text-text-secondary">
              If an account exists for <span className="text-text-primary">{email}</span>, we&apos;ve sent a link to reset your
              password. It expires in 1 hour.
            </p>
          </div>
        )}

        <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-[13px] text-text-secondary">
          <ArrowLeft className="h-3.5 w-3.5" />
          <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
