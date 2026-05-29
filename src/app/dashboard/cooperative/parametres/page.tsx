import { SettingsHub } from "@/components/account/SettingsHub";

export default function CoopParametresPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <SettingsHub
        mode="cooperative"
        backHref="/dashboard/cooperative/profil"
        backLabel="Ma coopérative"
      />
    </div>
  );
}
