import { OnssaBureauMobileChrome } from "@/components/dashboard/onssa/OnssaBureauMobileChrome";

export default function OnssaBureauLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-cream">
      <OnssaBureauMobileChrome />
      <div className="hidden border-b border-olive/20 bg-olive/10 px-4 py-4 sm:block sm:px-8">
        <p className="text-xs font-medium uppercase tracking-widest text-olive">
          Office National de Sécurité Sanitaire des produits Alimentaires
        </p>
        <p className="font-serif text-lg text-charcoal">Bureau agrément filières</p>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">{children}</div>
    </div>
  );
}
