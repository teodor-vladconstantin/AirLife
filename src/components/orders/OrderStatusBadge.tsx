import { Badge } from "@/components/ui/badge";
import { orderStatusLabel } from "@/lib/orderStatus";

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

  const getLabel = () => orderStatusLabel(status);

  return <Badge variant={getVariant()}>{getLabel()}</Badge>;
};
