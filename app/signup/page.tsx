"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Building2, Briefcase, Phone, ArrowRight } from "lucide-react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ApiError, API_URL } from "@/lib/api-client";
import { Logo } from "@/components/ui/logo";
import { GoogleIcon } from "@/components/ui/google-icon";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [niche, setNiche] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return; // guard against double-submit on rapid clicks
    setError(null);
    setLoading(true);
    try {
      await register({
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
        businessName,
        niche: niche || undefined,
        phone: phone || undefined,
      });
      router.push("/signup/pending");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create your account. Please try again.");
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

        <h1 className="font-display text-[24px] font-medium tracking-tight text-text-primary">Apply for access</h1>
        <p className="mt-1.5 text-[13.5px] text-text-secondary">
          Every new account is reviewed before it goes live — tell us a bit about your business.
        </p>

        {error && (
          <div className="mt-5 rounded-control border border-danger/20 bg-danger-muted px-3.5 py-2.5 text-[13px] text-danger animate-slide-up">
            {error}
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
            <Label htmlFor="businessName">Business name</Label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-text-muted" />
              <Input
                id="businessName"
                placeholder="Acme Real Estate"
                required
                className="pl-9"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="niche">Industry</Label>
              <div className="relative">
                <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-text-muted" />
                <Input
                  id="niche"
                  placeholder="Real estate"
                  className="pl-9"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-text-muted" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0300 1234567"
                  className="pl-9"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
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

          <Button type="submit" className="w-full" size="lg" loading={loading} disabled={loading}>
            {!loading && (
              <>
                Submit application <ArrowRight className="h-4 w-4" />
              </>
            )}
            {loading && "Submitting…"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[11.5px] uppercase tracking-wider text-text-muted">or continue with</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button variant="secondary" size="lg" className="w-full" asChild>
          <a href={`${API_URL}/auth/google`}>
            <GoogleIcon className="h-4 w-4" />
            Continue with Google
          </a>
        </Button>

        <p className="mt-6 text-center text-[12px] leading-relaxed text-text-muted">
          By continuing you agree to our{" "}
          <Link href="#" className="text-text-secondary hover:text-text-primary">Terms</Link> and{" "}
          <Link href="#" className="text-text-secondary hover:text-text-primary">Privacy Policy</Link>.
        </p>

        <p className="mt-5 text-center text-[13px] text-text-secondary">
          Already approved?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
