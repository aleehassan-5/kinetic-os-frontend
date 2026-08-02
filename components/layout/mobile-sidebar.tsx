"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronsUpDown, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { nav } from "./nav-data";
import { useMobileNav } from "./mobile-nav-context";
import { useAuth } from "@/lib/auth-context";
import { useNewLeadsCount } from "@/lib/use-new-leads-count";
import { useRouteProgress } from "./route-progress";
import { Logo } from "@/components/ui/logo";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "U";
}

export function MobileSidebar() {
  const { isOpen, close } = useMobileNav();
  const pathname = usePathname();
  const { user, workspace, logout } = useAuth();
  const newLeadsCount = useNewLeadsCount();
  const { start } = useRouteProgress();
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    close();
    setMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60"
            onClick={close}
          />

          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-border bg-surface"
          >
            <div className="flex h-14 items-center justify-between gap-2.5 border-b border-border px-5">
              <div className="flex items-center gap-2.5">
                <Logo size="sm" />
                <span className="font-display text-[15.5px] font-semibold tracking-tight text-text-primary">Kinetic OS</span>
              </div>
              <button
                onClick={close}
                aria-label="Close menu"
                className="flex h-8 w-8 items-center justify-center rounded-control text-text-muted transition-colors duration-200 hover:bg-white/[0.06] hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {nav.map((section) => (
                <div key={section.group} className="mb-5">
                  <div className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    {section.group}
                  </div>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const active = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          prefetch
                          onClick={() => !active && start()}
                          className={cn(
                            "group flex items-center justify-between rounded-control px-2.5 py-[9px] text-[13.5px] font-medium transition-colors duration-200",
                            active
                              ? "bg-primary-muted text-primary"
                              : "text-text-secondary hover:bg-white/[0.04] hover:text-text-primary"
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon
                              className={cn("h-[17px] w-[17px]", active ? "text-primary" : "text-text-muted group-hover:text-text-secondary")}
                              strokeWidth={2}
                            />
                            {item.label}
                          </span>
                          {item.href === "/leads" && !!newLeadsCount && (
                            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10.5px] font-semibold text-primary">
                              {newLeadsCount}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="relative border-t border-border p-3">
              {menuOpen && (
                <div className="absolute bottom-[calc(100%+4px)] left-3 right-3 overflow-hidden rounded-control border border-border bg-card shadow-lg">
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] text-danger transition-colors duration-200 hover:bg-danger-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              )}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex w-full items-center gap-2.5 rounded-control px-2 py-2 text-left transition-colors duration-200 hover:bg-white/[0.04]"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-[12px] font-semibold text-white">
                  {initials(user?.name ?? "U")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-text-primary">{user?.name ?? "…"}</div>
                  <div className="truncate text-[11.5px] text-text-muted">{workspace?.name ?? ""}</div>
                </div>
                <ChevronsUpDown className="h-3.5 w-3.5 text-text-muted" />
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
