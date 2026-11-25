"use client";

import { useEffect } from "react";

import { capturePostHogException, initAnalytics } from "@/lib/analytics";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    initAnalytics();
    capturePostHogException(error);
  }, [error]);

  return (
    <html lang="ro">
      <body>
        <h2>A apărut o eroare.</h2>
        <button type="button" onClick={reset}>
          Încearcă din nou
        </button>
      </body>
    </html>
  );
}
