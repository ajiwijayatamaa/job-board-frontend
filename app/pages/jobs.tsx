import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { 
  Search, 
  MapPin, 
  Clock, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Calendar,
  Navigation, 
  Loader2,
  Building2
} from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { useDebounce } from "~/hooks/use-debounce";
import { usePagination } from "~/hooks/use-pagination";
import { cn } from "~/lib/utils";
import { toast } from "sonner";

export const clientLoader = () => {
  return null;
};

// Interfaces for API data
interface Job {
  id: number;
  title: string;
  type: string; // e.g., "Full-time", "Part-time"
  location: string;
  salary: string;
  createdAt: string;
  category: string; // Assuming category name is directly on job object
  distance?: number;
  experience: string; // Assuming experience level name is directly on job object
  company: {
    companyName: string;
    logo?: string;
  } | string;
}

interface Category {
  id: number;
  name: string;
}

interface JobType {
  id: number;
  name: string;
}

interface ExperienceLevel {
  id: number;
  name: string;
}

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [jobType, setJobType] = useState("all");
  const [experience, setExperience] = useState("all");
  const [postedWithin, setPostedWithin] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Nearest location states
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [radius, setRadius] = useState(50);
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation tidak didukung oleh browser Anda");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsLocating(false);
        setSortOrder("nearest");
        toast.success("Lokasi berhasil diperbarui!");
      },
      (error) => {
        setIsLocating(false);
        toast.error("Gagal mendapatkan lokasi: " + error.message);
      }
    );
  };

  // Fetch all jobs
  const { data: allJobs, isLoading: isJobsLoading } = useQuery({
    queryKey: ["all-jobs", latitude, longitude, radius],
    queryFn: async () => {
      const response = await axiosInstance.get("/public/jobs", {
        params: { latitude, longitude, radius, take: 100 }
      });
      return response.data.data as Job[];
    },
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axiosInstance.get("/categories");
      return response.data.data as Category[];
    },
  });

  // Fetch job types
  const { data: jobTypesData } = useQuery({
    queryKey: ["job-types"],
    queryFn: async () => {
      const response = await axiosInstance.get("/job-types");
      return response.data.data as JobType[];
    },
  });

  // Fetch experience levels
  const { data: experienceLevelsData } = useQuery({
    queryKey: ["experience-levels"],
    queryFn: async () => {
      const response = await axiosInstance.get("/experience-levels");
      return response.data.data as ExperienceLevel[];
    },
  });

  const debouncedKeyword = useDebounce(keyword);
  const debouncedLocation = useDebounce(location);

  const filteredJobs = useMemo(() => {
    let result = allJobs || [];

    result = result.filter((job) => {
      const matchKeyword =
        !debouncedKeyword ||
        job.title?.toLowerCase().includes(debouncedKeyword.toLowerCase()) || 
        (job.company && typeof job.company === "object" 
          ? job.company?.companyName?.toLowerCase().includes(debouncedKeyword.toLowerCase())
          : job.company?.toLowerCase().includes(debouncedKeyword.toLowerCase()));

      const matchLocation =
        !debouncedLocation ||
        job.location?.toLowerCase().includes(debouncedLocation.toLowerCase());
      const matchCategory = category === "all" || job.category?.toLowerCase() === category.toLowerCase();
      const matchType = jobType === "all" || job.type?.toLowerCase() === jobType.toLowerCase();
      const matchExp = experience === "all" || job.experience?.toLowerCase() === experience.toLowerCase();

      let matchTime = true;
      if (postedWithin !== "all") {
        const jobDate = new Date(job.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - jobDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days

        if (postedWithin === "7d") {
          matchTime = diffDays <= 7;
        } else if (postedWithin === "30d") {
          matchTime = diffDays <= 30;
        }
      }

      return matchKeyword && matchLocation && matchCategory && matchType && matchExp && matchTime;
    });

    // Sorting Logic
    if (sortOrder === "nearest" && latitude && longitude) {
      // Backend sudah mengurutkan berdasarkan distance jika koordinat dikirim
      result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    } else if (sortOrder === "oldest") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else { // "newest" is default
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [allJobs, debouncedKeyword, debouncedLocation, category, jobType, experience, postedWithin, sortOrder, latitude, longitude]);

  const { paginatedItems, currentPage, totalPages, goToPage, resetPage } =
    usePagination(filteredJobs, 6);

  useEffect(() => {
    resetPage();
  }, [debouncedKeyword, debouncedLocation, category, jobType, experience, postedWithin, sortOrder]);

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
              className={cn("gap-2 bg-card", (latitude && longitude) && "border-primary text-primary")}
              onClick={handleGetLocation}
              disabled={isLocating}
            >
              {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              {latitude && longitude ? "Near Me Active" : "Near Me"}
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-card"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-40 bg-card">
                <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="oldest">Terlama</SelectItem>
                <SelectItem value="nearest" disabled={!latitude || !longitude}>
                  Terdekat
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-3 animate-in fade-in slide-in-from-top-2">
              <Select value={postedWithin} onValueChange={setPostedWithin}>
                <SelectTrigger className="w-45 bg-card">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Waktu Posting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Waktu</SelectItem>
                  <SelectItem value="7d">7 Hari Terakhir</SelectItem>
                  <SelectItem value="30d">1 Bulan Terakhir</SelectItem>
                </SelectContent>
              </Select>
              {(latitude && longitude) && (
                <div className="flex items-center gap-2 bg-card rounded-lg border border-input px-3 h-8 shadow-sm">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">Radius: {radius}km</span>
                  <input 
                    type="range" 
                    min="10" max="200" step="10" 
                    value={radius} 
                    onChange={(e) => setRadius(parseInt(e.target.value))} 
                    className="w-24 accent-primary cursor-pointer"
                  />
                </div>
              )}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-40 bg-card">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoriesData?.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={jobType} onValueChange={setJobType}>
                <SelectTrigger className="w-40 bg-card">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {jobTypesData?.map((t) => (
                    <SelectItem key={t.id} value={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger className="w-40 bg-card">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {experienceLevelsData?.map((e) => (
                    <SelectItem key={e.id} value={e.name}>
                      {e.name}
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
        {isJobsLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedItems.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 card-shadow hover:card-shadow-hover"
              >
                <div className="mb-3 flex items-start justify-between">
                  {typeof job.company === "object" && job.company?.logo ? (
                    <img src={job.company.logo} alt={job.company.companyName || "Company Logo"} className="h-10 w-10 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-6 w-6" />
                    </div>
                  )}
                  <Badge variant="secondary">{job.type}</Badge>
                </div>
                <h3 className="mb-1 font-semibold text-foreground group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  {job.company && typeof job.company === "object"
                    ? job.company?.companyName
                    : (job.company || "Unknown Company")}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {job.distance !== undefined && (
                  <div className="mt-2 text-[10px] font-bold text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Navigation className="h-2.5 w-2.5 fill-blue-600" /> {job.distance.toFixed(1)} km dari lokasi Anda
                  </div>
                )}
                <div className="mt-3 text-sm font-medium text-primary">
                  {job.salary}
                </div>
              </Link>
            ))}
          </div>
        )}
        {isJobsLoading === false && paginatedItems.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No jobs found matching your criteria.
          </div>
        )}
        {isJobsLoading === false && paginatedItems.length > 0 && (
          <Pagination
            meta={{
              page: currentPage,
              take: 6,
              total: filteredJobs.length,
            }}
            onChangePage={goToPage}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;
