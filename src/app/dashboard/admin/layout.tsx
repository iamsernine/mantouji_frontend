import { DashboardRoleGuard } from "@/components/auth/DashboardRoleGuard";
import { AdminDashboardShell } from "@/components/dashboard/admin/AdminDashboardShell";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardRoleGuard allowedRole="ADMIN">
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </DashboardRoleGuard>
  );
}
