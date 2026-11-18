import Stripe from "stripe";

// Server only. STRIPE_SECRET_KEY is the AirLife Stripe account's key (test key sk_test_... until payments go live).
let client: Stripe | null = null;
export const stripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return (client ??= new Stripe(key));
};
export const paymentsEnabled = () => !!process.env.STRIPE_SECRET_KEY;
