"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Building2, ArrowRight } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ApiError, API_URL } from "@/lib/api-client";
import { Logo } from "@/components/ui/logo";
import { GoogleIcon } from "@/components/ui/google-icon";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || success) return; // guard against double-submit on rapid clicks
    setError(null);
    setLoading(true);
    try {
      await register({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
        workspaceName: company,
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 900);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create your workspace. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-[400px] animate-fade-in">
        <div className="mb-9 flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-[16px] font-semibold tracking-tight text-text-primary">Kinetic OS</span>
        </div>

        <h1 className="font-display text-[24px] font-medium tracking-tight text-text-primary">Create your workspace</h1>
        <p className="mt-1.5 text-[13.5px] text-text-secondary">
          Start automating leads and content in under 10 minutes.
        </p>

        {error && (
          <div className="mt-5 rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger animate-slide-up">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-control border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-[13px] text-emerald-500 animate-slide-up">
            Account created! Taking you to your dashboard…
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" placeholder="Ali" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" placeholder="Raza" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company">Company</Label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-text-muted" />
              <Input id="company" placeholder="Acme Growth Agency" required className="pl-9" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Work email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-text-muted" />
              <Input id="email" type="email" placeholder="you@company.com" required className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-text-muted" />
              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                required
                minLength={8}
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading} disabled={loading || success}>
            {!loading && !success && (
              <>
                Create workspace <ArrowRight className="h-4 w-4" />
              </>
            )}
            {loading && "Creating…"}
            {success && "Account created ✓"}
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

        <p className="mt-6 text-center text-[12px] leading-relaxed text-text-muted">
          By continuing you agree to our{" "}
          <Link href="#" className="text-text-secondary hover:text-text-primary">Terms</Link> and{" "}
          <Link href="#" className="text-text-secondary hover:text-text-primary">Privacy Policy</Link>.
        </p>

        <p className="mt-5 text-center text-[13px] text-text-secondary">
          Already have a workspace?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
