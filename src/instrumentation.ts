import type { Instrumentation } from "next";

import { posthog } from "@/lib/posthog-server";

export const onRequestError: Instrumentation.onRequestError = async (error) => {
  if (!posthog) return;

  posthog.captureException(error);
  await posthog.flush().catch(() => {});
};
