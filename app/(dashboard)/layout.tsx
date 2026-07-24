"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { MobileNavProvider } from "@/components/layout/mobile-nav-context";
import { useAuth } from "@/lib/auth-context";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  return (
    <MobileNavProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <MobileSidebar />
        <div className="lg:pl-64">{children}</div>
      </div>
    </MobileNavProvider>
  );
}
