"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ApiError, API_URL } from "@/lib/api-client";
import { Logo } from "@/components/ui/logo";
import { GoogleIcon } from "@/components/ui/google-icon";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Right — form (order-2 puts it second on the right on large screens) */}
      <div className="flex items-center justify-center px-6 py-12 lg:order-2">
        <div className="w-full max-w-[380px] animate-fade-in">
          <div className="mb-9 flex items-center gap-2.5">
            <Logo />
            <span className="font-display text-[16px] font-semibold tracking-tight text-text-primary">Orbit AI</span>
          </div>

          <h1 className="font-display text-[24px] font-medium tracking-tight text-text-primary">Welcome back</h1>
          <p className="mt-1.5 text-[13.5px] text-text-secondary">
            Sign in to your workspace to manage leads, chat and campaigns.
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

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-[12.5px] font-medium text-primary hover:text-primary-hover">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-text-muted" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••"
                  required
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {!loading && (
                <>
                  Sign in <ArrowRight className="h-4 w-4" />
                </>
              )}
              {loading && "Signing in…"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11.5px] uppercase tracking-wider text-text-muted">or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="lg" asChild>
              <a href={`${API_URL}/auth/google`}>
                <GoogleIcon className="h-4 w-4" />
                Google
              </a>
            </Button>
            <Button variant="secondary" size="lg">Microsoft</Button>
          </div>

          <p className="mt-8 text-center text-[13px] text-text-secondary">
            Don&apos;t have a workspace?{" "}
            <Link href="/signup" className="font-medium text-primary hover:text-primary-hover">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Left — brand panel */}
      <div className="relative hidden overflow-hidden border-r border-border bg-surface lg:order-1 lg:block">
        <svg
          viewBox="0 0 32 32"
          className="pointer-events-none absolute -left-28 -top-24 h-[420px] w-[420px] text-primary/[0.07]"
          aria-hidden="true"
        >
          <ellipse cx="16" cy="16" rx="13.25" ry="5.6" transform="rotate(-21 16 16)" stroke="currentColor" strokeWidth="0.35" fill="none" />
          <circle cx="16" cy="16" r="3.1" fill="currentColor" />
          <circle cx="27.1" cy="8.6" r="1.7" fill="currentColor" />
        </svg>
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div />
          <div className="max-w-md">
            <div className="mb-5 flex -space-x-2">
              {["WA", "TG", "IG", "FB", "EM"].map((c) => (
                <div
                  key={c}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface bg-card text-[10.5px] font-semibold text-text-secondary"
                >
                  {c}
                </div>
              ))}
            </div>
            <p className="text-[19px] font-medium leading-relaxed text-text-primary">
              &ldquo;Every WhatsApp, Instagram and email lead now gets scored and replied to in under 30 seconds — before we even see it.&rdquo;
            </p>
            <p className="mt-4 text-[13px] text-text-secondary">Head of Growth, mid-market agency</p>
          </div>
          <div className="flex items-center gap-6 text-[12.5px] text-text-muted">
            <span>SOC 2 Type II</span>
            <span>99.98% uptime</span>
            <span>GDPR ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
