import { Badge } from "@/components/ui/badge";
import type { Certification } from "@/types/product";

export function CertificationBadge({ cert }: { cert: Certification }) {
  return (
    <Badge variant="gold" title={cert.description}>
      {cert.nom}
    </Badge>
  );
}
