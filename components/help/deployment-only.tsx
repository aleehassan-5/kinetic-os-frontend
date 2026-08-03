"use client";

import * as React from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

/**
 * Wraps deployment-level setup content (OAuth redirect URIs, webhook URLs,
 * third-party console steps meant for whoever runs the server) so it only
 * renders for the workspace Owner. Every other role sees a short pointer
 * instead — this content isn't actionable for them anyway, and there's no
 * reason a regular team member needs visibility into how the backend is
 * wired up.
 */
export function DeploymentOnly({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();

  if (role !== "OWNER") {
    return (
      <div className="flex items-center gap-3 rounded-control border border-border bg-white/[0.02] p-4">
        <Lock className="h-4 w-4 shrink-0 text-text-muted" />
        <p className="text-[12.5px] leading-relaxed text-text-secondary">
          This is deployment-level setup, visible only to your workspace Owner. Ask them if you need
          something here changed.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
