import { Badge } from "@/components/ui/badge";

type Status = "approved" | "pending" | "rejected" | "reported";

const labels: Record<Status, string> = {
  approved: "Validé",
  pending: "En attente",
  rejected: "Refusé",
  reported: "Signalé",
};

const variants: Record<Status, "olive" | "gold" | "default" | "outline"> = {
  approved: "olive",
  pending: "gold",
  rejected: "default",
  reported: "outline",
};

export function StatusBadge({ status }: { status: Status }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
