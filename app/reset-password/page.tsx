"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";
import { Logo } from "@/components/ui/logo";

function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || success) return;
    setError(null);

    if (!token) {
      setError("This reset link is missing its token. Please request a new one.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password }, { skipAuth: true });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong resetting your password. Please try again."
      );
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

        <h1 className="font-display text-[24px] font-medium tracking-tight text-text-primary">Set a new password</h1>
        <p className="mt-1.5 text-[13.5px] text-text-secondary">Choose a strong password for your account.</p>

        {!token && (
          <div className="mt-5 rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger animate-slide-up">
            This link is missing a reset token.{" "}
            <Link href="/forgot-password" className="font-medium underline">
              Request a new one
            </Link>
            .
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger animate-slide-up">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-control border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-[13px] text-emerald-500 animate-slide-up">
            Password updated! Taking you to sign in…
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-text-muted" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••••"
                required
                minLength={8}
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-text-muted" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••••"
                required
                minLength={8}
                className="pl-9"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading} disabled={loading || success || !token}>
            {!loading && !success && (
              <>
                Reset password <ArrowRight className="h-4 w-4" />
              </>
            )}
            {loading && "Resetting…"}
            {success && "Done ✓"}
          </Button>
        </form>

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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
