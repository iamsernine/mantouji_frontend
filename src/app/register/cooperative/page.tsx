import Image from "next/image";
import Link from "next/link";
import { CoopRegistrationForm } from "@/components/auth/CoopRegistrationForm";
import { logos } from "@/lib/brand";

export default function CoopRegisterPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8 pb-24">
      <Link href="/">
        <Image
          src={logos.fullcolor}
          alt="Mantouji"
          width={160}
          height={56}
          className="mb-8 h-12 w-auto"
        />
      </Link>
      <h1 className="font-serif text-3xl text-burgundy">Inscription coopérative</h1>
      <p className="mt-2 font-light text-charcoal/70">
        Remplissez le formulaire ci-dessous. Notre équipe examinera votre dossier et vous
        répondra par email.
      </p>
      <div className="mt-8">
        <CoopRegistrationForm />
      </div>
      <p className="mt-8 text-center text-sm text-charcoal/60">
        Compte client ?{" "}
        <Link href="/register" className="font-medium text-burgundy">
          Inscription particulier
        </Link>
      </p>
    </div>
  );
}
