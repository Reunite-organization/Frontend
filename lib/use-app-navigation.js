"use client";

import { startTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { routeFor } from "./routes";

export function useAppNavigation() {
  const router = useRouter();

  return useCallback(
    (page, id) => {
      const href = routeFor(page, id);
      startTransition(() => {
        router.push(href, { scroll: true });
      });
    },
    [router],
  );
}
