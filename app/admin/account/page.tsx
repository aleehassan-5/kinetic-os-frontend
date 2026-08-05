"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChangePasswordCard } from "@/components/account/change-password-card";
import { useAuth } from "@/lib/auth-context";

export default function AdminAccountPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link href="/admin" className="mb-3 flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to accounts
        </Link>
        <h1 className="font-display text-[22px] font-semibold tracking-tight text-text-primary">Your account</h1>
        <p className="mt-1 text-[13px] text-text-secondary">Signed in as {user?.email} — platform super admin</p>
      </div>

      <ChangePasswordCard />
    </div>
  );
}
