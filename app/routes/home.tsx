import DiscoverySection from "~/components/home/discoverysection";
import FilterSection from "~/components/home/filtersection";
import HeroSection from "~/components/home/herosection";
import Footer from "~/components/layout/footer";
import Navbar from "~/components/layout/navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pencari Kerja" },
    { name: "description", content: "Selamat Datang di Pencari Kerja!" },
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
