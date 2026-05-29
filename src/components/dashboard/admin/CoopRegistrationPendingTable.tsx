"use client";

import { useEffect, useState } from "react";
import { RegistrationReviewSheet } from "@/components/dashboard/admin/RegistrationReviewSheet";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminListPendingCoopRequests } from "@/lib/api";

type PendingReq = {
  id: string;
  nomCooperative: string;
  contactEmail: string;
};

export function CoopRegistrationPendingTable() {
  const [items, setItems] = useState<PendingReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<{ id: string } | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await adminListPendingCoopRequests();
      setItems(
        (res.data ?? []).map((r: any) => ({
          id: String(r.id),
          nomCooperative: r.nomCooperative ?? r.nom_cooperative ?? "",
          contactEmail: r.contactEmail ?? r.contact_email ?? "",
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  if (loading) {
    return <p className="text-sm text-charcoal/60">Chargement…</p>;
  }

  if (!items.length) {
    return <p className="text-sm text-charcoal/60">Aucune demande en attente.</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coopérative</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.nomCooperative}</TableCell>
              <TableCell className="text-sm text-charcoal/70">{r.contactEmail}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelected({ id: r.id });
                    setSheetOpen(true);
                  }}
                >
                  Examiner
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <RegistrationReviewSheet
        requestId={selected?.id ?? null}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onReviewed={refresh}
      />
    </>
  );
}
