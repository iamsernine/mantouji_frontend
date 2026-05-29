import { FeaturedCooperatives } from "@/components/home/FeaturedCooperatives";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { StorySection } from "@/components/home/StorySection";
import { TrustSection } from "@/components/home/TrustSection";
import { HomeFooter } from "@/components/home/HomeFooter";

export default function HomePage() {
  return (
    <div className="w-full max-w-full overflow-x-clip bg-cream text-charcoal">
      <Hero />
      <TrustSection />
      <StorySection />
      <FeaturedProducts />
      <FeaturedCooperatives />
      <HomeFooter />
    </div>
  );
}
