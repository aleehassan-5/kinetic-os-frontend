"use client";

import { User, Building2, Bell, Plug, KeyRound, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsTab = "profile" | "workspace" | "notifications" | "integrations" | "api-keys" | "danger";

const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "api-keys", label: "API Keys", icon: KeyRound },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

export function SettingsNav({ active, onChange }: { active: SettingsTab; onChange: (t: SettingsTab) => void }) {
  return (
    <nav className="flex gap-1 overflow-x-auto pb-1 lg:w-56 lg:flex-col lg:overflow-visible lg:pb-0">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-control px-3 py-2 text-[13px] font-medium transition-colors duration-200",
              isActive
                ? t.id === "danger"
                  ? "bg-danger-muted text-danger"
                  : "bg-primary-muted text-primary"
                : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
            )}
          >
            <Icon className={cn("h-[16px] w-[16px]", isActive ? (t.id === "danger" ? "text-danger" : "text-primary") : "text-text-muted")} strokeWidth={2} />
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
