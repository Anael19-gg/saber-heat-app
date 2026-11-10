"use client";

import { useEffect } from "react";

export function ChunkReloader() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      const message = String(event.error?.message ?? event.message ?? "");
      if (
        !/ChunkLoadError|Loading chunk|Loading CSS chunk|Failed to load chunk|Failed to fetch dynamically imported module|_next\/static\/chunks/i.test(
          message,
        )
      ) {
        return;
      }

      const key = "saber-heat-chunk-reload";
      if (window.sessionStorage.getItem(key)) return;

      window.sessionStorage.setItem(key, "1");
      window.location.reload();
    };

    window.addEventListener("error", onError);
    return () => window.removeEventListener("error", onError);
  }, []);

  return null;
}
