import type { SeasonalVariant } from "@/emails/Seasonal";

// One entry per campaign you can send. `category` picks which in-stock products appear in the email.
export const CAMPAIGNS: Record<string, { variant: SeasonalVariant; category: string }> = {
  "sezon-iarna": { variant: "iarna", category: "Ventilatoare Baie" },
  "sezon-primavara": { variant: "primavara", category: "Aer Condiționat" },
  "sezon-pompe-caldura": { variant: "pompe-caldura", category: "Aer Condiționat" },
};
