import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100dvh-12rem)] flex-col items-center justify-center px-4 py-12 text-center sm:min-h-[calc(100dvh-10rem)] sm:py-16 md:py-20">
      <div className="flex w-full max-w-md flex-col items-center sm:max-w-lg md:max-w-xl">
        <Image
          src="/images/404.png"
          alt=""
          width={400}
          height={400}
          className="h-auto w-full max-w-[min(100%,280px)] object-contain sm:max-w-[320px] md:max-w-[360px]"
          priority
        />
        <h1 className="mt-6 font-serif text-2xl text-burgundy text-balance sm:mt-8 sm:text-3xl md:text-4xl">
          Page introuvable
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-charcoal/70 sm:max-w-md sm:text-base">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Button asChild className="mt-8 sm:mt-10">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </div>
  );
}
