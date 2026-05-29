import { DashboardRoleGuard } from "@/components/auth/DashboardRoleGuard";
import { CoopDashboardShell } from "@/components/dashboard/cooperative/CoopDashboardShell";
import { CoopDashboardProvider } from "@/contexts/coop-dashboard-context";

export default function CooperativeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardRoleGuard allowedRole="COOPERATIVE">
      <CoopDashboardProvider>
        <CoopDashboardShell>{children}</CoopDashboardShell>
      </CoopDashboardProvider>
    </DashboardRoleGuard>
  );
}
