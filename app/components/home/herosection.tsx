import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import heroBanner from "@/assets/jobboardhero.jpg";

const HeroSection = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBanner} alt="Professional team" className="h-full w-full object-cover" width={1920} height={800} />
        <div className="absolute inset-0 hero-gradient opacity-85" />
      </div>
      <div className="container relative z-10 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Find Your Dream Job
          </h1>
          <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
            Discover thousands of job opportunities from top companies across Indonesia
          </p>
          <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Job title or keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="bg-card pl-10"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-card pl-10"
              />
            </div>
            <Button type="submit" size="default" className="px-8">
              Search
            </Button>
          </form>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Technology", "Marketing", "Finance", "Design"].map((cat) => (
              <button
                key={cat}
                onClick={() => navigate(`/jobs?category=${cat}`)}
                className="rounded-full border border-primary-foreground/30 px-4 py-1.5 text-sm text-primary-foreground/90 transition-colors hover:bg-primary-foreground/10"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
