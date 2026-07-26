"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface RouteProgressContextValue {
  /** Call this the instant a nav link is clicked, so feedback is immediate — before the new route has even mounted. */
  start: () => void;
}

const RouteProgressContext = createContext<RouteProgressContextValue>({ start: () => {} });

export function useRouteProgress() {
  return useContext(RouteProgressContext);
}

function RouteProgressBarInner({ onIdle }: { onIdle: () => void }) {
  // Re-mounting this on every pathname change lets us detect "navigation finished".
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const key = `${pathname}?${searchParams?.toString() ?? ""}`;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onIdle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}

export function RouteProgressProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const safetyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(() => {
    setVisible(true);
    if (safetyTimeout.current) clearTimeout(safetyTimeout.current);
    // Safety net in case the route change never fires (e.g. external link, same page).
    safetyTimeout.current = setTimeout(() => setVisible(false), 2500);
  }, []);

  const stop = useCallback(() => {
    setVisible(false);
    if (safetyTimeout.current) clearTimeout(safetyTimeout.current);
  }, []);

  return (
    <RouteProgressContext.Provider value={{ start }}>
      <div
        aria-hidden
        className={`fixed left-0 top-0 z-[100] h-[2.5px] w-full origin-left bg-primary transition-transform ${
          visible ? "scale-x-100 duration-[900ms] ease-out" : "scale-x-0 duration-150 ease-in"
        }`}
        style={{ transitionProperty: "transform, opacity", opacity: visible ? 1 : 0 }}
      />
      <Suspense fallback={null}>
        <RouteProgressBarInner onIdle={stop} />
      </Suspense>
      {children}
    </RouteProgressContext.Provider>
  );
}
