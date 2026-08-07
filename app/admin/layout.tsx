"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/lib/auth-context";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isSuperAdmin, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (!isSuperAdmin) router.replace("/dashboard");
  }, [loading, user, isSuperAdmin, router]);

  if (loading || !user || !isSuperAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Logo size="sm" />
          <span className="font-display text-[15px] font-semibold tracking-tight text-text-primary">
            Kinetic OS <span className="hidden font-sans text-[12.5px] font-normal text-text-muted sm:inline">— Platform Admin</span>
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-5">
          <Link href="/admin/account" className="text-[13px] font-medium text-text-secondary hover:text-text-primary">
            Account
          </Link>
          <button onClick={logout} className="text-[13px] font-medium text-text-secondary hover:text-text-primary">
            Log out
          </button>
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
