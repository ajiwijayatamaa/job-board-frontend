import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import Pagination from "~/components/shared/pagination-section";
import { useDebounce } from "~/hooks/use-debounce";
import { usePagination } from "~/hooks/use-pagination";
import { companies } from "~/data/mock-data";

const industries = [...new Set(companies.map((c) => c.industry))];
const sizes = ["20-50", "50-100", "50-200", "100-300", "100-500", "200-500", "500-1000", "1000-3000", "1000-5000", "2000-5000", "5000+"];

const Companies = () => {
  const [keyword, setKeyword] = useState("");
  const [industry, setIndustry] = useState("all");
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const debouncedKeyword = useDebounce(keyword);
  const debouncedLocation = useDebounce(location);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchName = !debouncedKeyword || c.name.toLowerCase().includes(debouncedKeyword.toLowerCase());
      const matchIndustry = industry === "all" || c.industry === industry;
      const matchLoc = !debouncedLocation || c.location.toLowerCase().includes(debouncedLocation.toLowerCase());
      return matchName && matchIndustry && matchLoc;
    });
  }, [debouncedKeyword, industry, debouncedLocation]);

  const { paginatedItems, currentPage, totalPages, goToPage, resetPage } = usePagination(filtered, 8);

  useEffect(() => { resetPage(); }, [debouncedKeyword, industry, debouncedLocation]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="hero-gradient py-10">
        <div className="container">
          <h1 className="mb-6 text-3xl font-bold text-primary-foreground">Explore Companies</h1>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Company name" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="bg-card pl-10" />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="bg-card pl-10" />
            </div>
            <Button variant="outline" className="gap-2 bg-card" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </div>
          {showFilters && (
            <div className="mt-3">
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="w-[180px] bg-card"><SelectValue placeholder="Industry" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="container py-8">
        <p className="mb-6 text-sm text-muted-foreground">{filtered.length} companies found</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paginatedItems.map((company) => (
            <Link key={company.id} to={`/companies/${company.id}`} className="group rounded-xl border border-border bg-card p-5 text-center transition-all hover:border-primary/30 card-shadow hover:card-shadow-hover">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-secondary text-3xl">{company.logo}</div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{company.name}</h3>
              <p className="text-sm text-muted-foreground">{company.industry}</p>
              <p className="mt-1 text-xs text-muted-foreground">{company.location} · {company.size} employees</p>
              <p className="mt-2 text-sm font-medium text-primary">{company.openPositions} open positions</p>
            </Link>
          ))}
        </div>
        {paginatedItems.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">No companies found.</div>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
      </div>
      <Footer />
    </div>
  );
};

export default Companies;
