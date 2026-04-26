import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import Pagination from "@/components/pagination-section";
import { useDebounce } from "~/hooks/use-debounce";
import { usePagination } from "~/hooks/use-pagination";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { Loader2, Building2 } from "lucide-react";

// Interface for API data
interface Company {
  id: number;
  companyName: string;
  industry?: string;
  location?: string;
  address?: string;
  size?: string; // e.g., "100-300", "5000+"
  logo?: string;
  _count?: {
    jobs: number;
  };
}

const Companies = () => {
  const [keyword, setKeyword] = useState("");
  const [industry, setIndustry] = useState("all");
  const [location, setLocation] = useState("");
  const [companySize, setCompanySize] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: allCompanies, isLoading: isCompaniesLoading, isError: isCompaniesError } = useQuery({
    queryKey: ["all-companies"],
    queryFn: async () => {
      const response = await axiosInstance.get("/public/companies");
      return response.data.data as Company[];
    },
  });

  const industries = useMemo(() => {
    if (!allCompanies) return [];
    return [
      ...new Set(
        allCompanies
          .map((c) => c.industry)
          .filter(
            (v): v is string => typeof v === "string" && v.trim().length > 0,
          ),
      ),
    ];
  }, [allCompanies]);

  const sizes = useMemo(() => {
    if (!allCompanies) return [];
    return [
      ...new Set(
        allCompanies
          .map((c) => c.size)
          .filter(
            (v): v is string => typeof v === "string" && v.trim().length > 0,
          ),
      ),
    ].sort();
  }, [allCompanies]);

  const debouncedKeyword = useDebounce(keyword);
  const debouncedLocation = useDebounce(location);

  const filtered = useMemo(() => {
    let result = allCompanies || [];

    result = result.filter((c) => {
      const loc = (c.location || c.address || "").toLowerCase();
      const matchName =
        !debouncedKeyword ||
        c.companyName.toLowerCase().includes(debouncedKeyword.toLowerCase());
      const matchIndustry = industry === "all" || c.industry === industry;
      const matchLoc =
        !debouncedLocation ||
        loc.includes(debouncedLocation.toLowerCase());
      const matchSize = companySize === "all" || c.size === companySize;
      return matchName && matchIndustry && matchLoc && matchSize;
    });
    return result;
  }, [allCompanies, debouncedKeyword, industry, debouncedLocation, companySize]);

  const { paginatedItems, currentPage, totalPages, goToPage, resetPage } =
    usePagination(filtered, 8);

  useEffect(() => {
    resetPage(); // Reset page when filters change
  }, [debouncedKeyword, industry, debouncedLocation, companySize, resetPage]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="hero-gradient py-10">
        <div className="container">
          <h1 className="mb-6 text-3xl font-bold text-primary-foreground">
            Explore Companies
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Company name"
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
            <Button
              variant="outline"
              className="gap-2 bg-card"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </div>
          {showFilters && (
            <div className="mt-3">
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="w-[180px] bg-card">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger className="w-[180px] bg-card">
                  <SelectValue placeholder="Company Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  {sizes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="container py-8">
        <p className="mb-6 text-sm text-muted-foreground">
          {filtered.length} companies found
        </p>
        {isCompaniesLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isCompaniesError ? (
          <div className="py-20 text-center text-muted-foreground">
            Failed to load companies.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedItems.map((company) => (
              <Link
                key={company.id}
                to={`/companies/${company.id}`}
                className="group rounded-xl border border-border bg-card p-5 text-center transition-all hover:border-primary/30 card-shadow hover:card-shadow-hover"
              >
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-secondary text-3xl">
                  {company.logo ? (
                    <img src={company.logo} alt={company.companyName} className="h-12 w-12 rounded-lg object-cover" />
                  ) : (
                    <Building2 className="h-8 w-8 text-primary" />
                  )}
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {company.companyName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {company.industry || "-"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {(company.location || company.address || '-')} · {(company.size || '-')} employees
                </p>
                <p className="mt-2 text-sm font-medium text-primary">
                  {company._count?.jobs || 0} open positions
                </p>
              </Link>
            ))}
          </div>
        )}
        {isCompaniesLoading === false && paginatedItems.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No companies found.
          </div>
        )}
        {isCompaniesLoading === false && paginatedItems.length > 0 && (
          <Pagination
            meta={{
              page: currentPage,
              take: 8, // 8 items per page for companies
              total: filtered.length,
            }}
            onChangePage={goToPage}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Companies;

