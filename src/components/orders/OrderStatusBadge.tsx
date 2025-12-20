import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const getVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
      case "processing":
        return "default";
      case "shipped":
      case "delivered":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getLabel = () => {
    switch (status) {
      case "pending":
        return "În așteptare";
      case "confirmed":
        return "Confirmată";
      case "processing":
        return "În procesare";
      case "shipped":
        return "Expediată";
      case "delivered":
        return "Livrată";
      case "cancelled":
        return "Anulată";
      default:
        return status;
    }
  };

  return <Badge variant={getVariant()}>{getLabel()}</Badge>;
};
