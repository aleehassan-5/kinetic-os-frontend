"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/ui/logo";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { loginWithTokens } = useAuth();
  const [error, setError] = useState(false);

  useEffect(() => {
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) {
      setError(true);
      return;
    }

    loginWithTokens(accessToken, refreshToken)
      .then(() => router.replace("/dashboard"))
      .catch(() => setError(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <Logo />
        <div>
          <p className="text-[15px] font-medium text-text-primary">Google sign-in didn&apos;t go through</p>
          <p className="mt-1 text-[13px] text-text-secondary">Please try again.</p>
        </div>
        <button
          onClick={() => router.replace("/login")}
          className="mt-1 text-[13px] font-medium text-primary hover:text-primary-hover"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <Logo />
      <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
      <p className="text-[13px] text-text-secondary">Signing you in…</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}
