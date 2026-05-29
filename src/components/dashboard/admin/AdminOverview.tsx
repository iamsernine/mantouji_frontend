"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Building2,
  ClipboardList,
  Users,
  BarChart3,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { approveCooperative, listAdminUsers, listPendingCooperatives } from "@/lib/api";
import type { Cooperative } from "@/types/cooperative";

export function AdminOverview() {
  const [pendingCoops, setPendingCoops] = useState<Cooperative[]>([]);
  const [userTotal, setUserTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [pendingRes, usersRes] = await Promise.all([
        listPendingCooperatives(),
        listAdminUsers(1, 1),
      ]);
      setPendingCoops(pendingRes.data);
      setUserTotal(usersRes.data.total);
    } catch {
      setPendingCoops([]);
      setUserTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleApprove = async (id: string) => {
    await approveCooperative(id);
    await refresh();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-burgundy">
          Administration
        </p>
        <h1 className="font-serif text-2xl font-bold text-charcoal sm:text-3xl">
          Tableau de bord Mantouji
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          title="Demandes coop."
          value={loading ? "…" : pendingCoops.length}
          icon={ClipboardList}
        />
        <StatCard title="Utilisateurs" value={loading ? "…" : userTotal} icon={Users} />
        <StatCard title="Coopératives" value="—" icon={Building2} />
        <StatCard title="Analytique" value="—" icon={BarChart3} />
      </div>

      <DashboardSection
        title="Coopératives en attente"
        description="Validez les nouvelles inscriptions coopératives."
      >
        {pendingCoops.length === 0 ? (
          <p className="text-sm text-charcoal/60">Aucune demande en attente.</p>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coopérative</TableHead>
                    <TableHead>Région</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCoops.slice(0, 5).map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.nomCooperative}</TableCell>
                      <TableCell>{c.region.nom}</TableCell>
                      <TableCell>
                        <StatusBadge status="pending" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => handleApprove(c.id)}>
                          Approuver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        <div className="mt-4 flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin/inscriptions">Voir toutes les inscriptions</Link>
          </Button>
        </div>
      </DashboardSection>
    </div>
  );
}
