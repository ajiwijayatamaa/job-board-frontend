import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import HeroSection from "~/components/home/herosection";
import FilterSection from "~/components/home/filtersection";
import DiscoverySection from "~/components/home/discoverysection";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <FilterSection />
    <DiscoverySection />
    <Footer />
  </div>
);

export default Index;
