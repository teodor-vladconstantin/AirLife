// One list of order statuses for the whole admin: the filter tabs, the status dropdowns and the badges all read it,
// so they can never disagree (a status that exists in the dropdown always has its own filter).
export const ORDER_STATUSES = [
  { value: "pending", label: "În așteptare", plural: "În așteptare" },
  { value: "confirmed", label: "Confirmată", plural: "Confirmate" },
  { value: "processing", label: "În procesare", plural: "În procesare" },
  { value: "shipped", label: "Expediată", plural: "Expediate" },
  { value: "delivered", label: "Livrată", plural: "Livrate" },
  { value: "cancelled", label: "Anulată", plural: "Anulate" },
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]["value"];

export const orderStatusLabel = (status: string) => ORDER_STATUSES.find((s) => s.value === status)?.label ?? status;
