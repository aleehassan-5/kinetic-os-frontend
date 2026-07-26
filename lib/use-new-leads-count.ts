"use client";

import { useEffect, useState } from "react";
import { api } from "./api-client";

/** Live count of NEW (unread) leads, used for the "Lead Inbox" sidebar badge. */
export function useNewLeadsCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCount() {
      try {
        const data = await api.get<{ total: number }>("/leads?status=NEW&pageSize=1");
        if (!cancelled) setCount(data.total);
      } catch {
        if (!cancelled) setCount(null);
      }
    }

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return count;
}
