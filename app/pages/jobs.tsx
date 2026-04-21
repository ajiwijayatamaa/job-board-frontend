import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Search, MapPin, Clock, SlidersHorizontal } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
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
import {
  jobs,
  categories,
  locations,
  jobTypes,
  experienceLevels,
} from "~/data/mock-data";

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [jobType, setJobType] = useState("all");
  const [experience, setExperience] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const debouncedKeyword = useDebounce(keyword);
  const debouncedLocation = useDebounce(location);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchKeyword =
        !debouncedKeyword ||
        job.title.toLowerCase().includes(debouncedKeyword.toLowerCase()) ||
        job.company.toLowerCase().includes(debouncedKeyword.toLowerCase());
      const matchLocation =
        !debouncedLocation ||
        job.location.toLowerCase().includes(debouncedLocation.toLowerCase());
      const matchCategory = category === "all" || job.category === category;
      const matchType = jobType === "all" || job.type === jobType;
      const matchExp = experience === "all" || job.experience === experience;
      return (
        matchKeyword && matchLocation && matchCategory && matchType && matchExp
      );
    });
  }, [debouncedKeyword, debouncedLocation, category, jobType, experience]);

  const { paginatedItems, currentPage, totalPages, goToPage, resetPage } =
    usePagination(filteredJobs, 6);

  useEffect(() => {
    resetPage();
  }, [debouncedKeyword, debouncedLocation, category, jobType, experience]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="hero-gradient py-10">
        <div className="container">
          <h1 className="mb-6 text-3xl font-bold text-primary-foreground">
            Find Jobs
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row">
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
            <Button
              variant="outline"
              className="gap-2 bg-card"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </div>
          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[160px] bg-card">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger className="w-[160px] bg-card">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {jobTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger className="w-[160px] bg-card">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {experienceLevels.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
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
          {filteredJobs.length} jobs found
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedItems.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 card-shadow hover:card-shadow-hover"
            >
              <div className="mb-3 flex items-start justify-between">
                <span className="text-3xl">{job.companyLogo}</span>
                <Badge variant="secondary">{job.type}</Badge>
              </div>
              <h3 className="mb-1 font-semibold text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="mb-3 text-sm text-muted-foreground">
                {job.company}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {job.posted}
                </span>
              </div>
              <div className="mt-3 text-sm font-medium text-primary">
                {job.salary}
              </div>
            </Link>
          ))}
        </div>
        {paginatedItems.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No jobs found matching your criteria.
          </div>
        )}
        <Pagination
          meta={{
            page: currentPage,
            take: 6,
            total: filteredJobs.length,
          }}
          onChangePage={goToPage}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;
