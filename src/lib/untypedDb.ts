import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// The generated Database types do not list the tables added by supabase/migrations/20251219000000_shop_features.sql
// (wishlist_items, product_reviews, discount_codes, …). This is the same client without table typings, for those tables.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const untypedDb = supabase as unknown as SupabaseClient<any, "public", any>;
