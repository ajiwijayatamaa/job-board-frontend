import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import heroBanner from "@/assets/jobboardhero.jpg";

const FULL_TEXT = "Temukan Pekerjaan Impian Anda";

const HeroSection = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed((prev) => {
          const next = FULL_TEXT.slice(0, prev.length + 1);
          if (next === FULL_TEXT) {
            clearInterval(interval);
            setDone(true);
          }
          return next;
        });
      }, 70);
      return () => clearInterval(interval);
    }, 300);

    return () => clearTimeout(startDelay);
  }, []);

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
        <img
          src={heroBanner}
          alt="Professional team"
          className="h-full w-full object-cover"
          width={1920}
          height={800}
        />
        <div className="absolute inset-0 hero-gradient opacity-85" />
      </div>

      <div className="container relative z-10 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">

          {/* HEADING dengan typing animation */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            <span className="inline-block">
              {displayed}
              <span
                className={`
                  inline-block w-[3px] h-[0.85em] bg-white ml-1 align-middle rounded-sm
                  ${done
                    ? "opacity-0 transition-opacity duration-500"
                    : "animate-[blink_0.75s_step-end_infinite]"
                  }
                `}
              />
            </span>
          </h1>

          {/* SUBTITLE */}
          <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
            Temukan ribuan peluang kerja dari perusahaan ternama di seluruh Indonesia
          </p>

          {/* SEARCH FORM */}
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Judul pekerjaan atau kata kunci"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="bg-card pl-10"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Lokasi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-card pl-10"
              />
            </div>
            <Button type="submit" size="default" className="px-8">
              Cari
            </Button>
          </form>

          {/* CATEGORY PILLS */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Teknologi", "Pemasaran", "Keuangan", "Desain"].map((cat) => (
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