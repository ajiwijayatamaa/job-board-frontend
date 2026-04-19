import DiscoverySection from "~/components/home/discoverysection";
import FilterSection from "~/components/home/filtersection";
import HeroSection from "~/components/home/herosection";
import Footer from "~/components/layout/footer";
import Navbar from "~/components/layout/navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Job Board" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FilterSection />
      <DiscoverySection />
      <Footer />
    </div>
  );
}
