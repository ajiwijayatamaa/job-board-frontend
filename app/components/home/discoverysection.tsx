import { Link } from "react-router";
import { MapPin, Clock, ArrowRight, Loader2, Building2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

interface Job {
  id: number;
  title: string;
  type: string;
  city: string;
  salary: string;
  createdAt: string;
  company: {
    companyName: string;
    logo?: string;
  } | string;
}

interface Company {
  id: number;
  companyName: string;
  industry?: string;
  logo?: string;
  _count?: {
    jobs: number;
  }; // Tambahkan properti ini untuk mencocokkan respons backend
}

const DiscoverySection = () => {
  const { data: jobs, isLoading: isJobsLoading, isError: isJobsError } = useQuery({
    queryKey: ["featured-jobs"],
    queryFn: async () => {
      // Gunakan endpoint publik agar USER bisa akses dan hanya melihat yang PUBLISHED
      const response = await axiosInstance.get("/public/jobs");
      return response.data.data as Job[];
    },
  });

  const { data: companies, isLoading: isCompaniesLoading, isError: isCompaniesError } = useQuery({
    queryKey: ["top-companies"],
    queryFn: async () => {
      const response = await axiosInstance.get("/public/companies"); // Gunakan endpoint publik yang baru
      return response.data.data as Company[];
    },
  });

  const featuredJobs = jobs?.slice(0, 6) || [];
  const featuredCompanies = companies?.slice(0, 4) || [];

  return (
    <section className="py-16">
      <div className="container">
        {/* Featured Jobs */}
        <div className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">Lowongan Unggulan</h2>
              <p className="text-muted-foreground">Peluang terbaru dari perusahaan ternama</p>
            </div>
            <Link to="/jobs">
              <Button variant="outline" className="gap-2">
                Lihat Semua <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isJobsLoading ? (
              <div className="col-span-full flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : isJobsError ? (
              <p className="col-span-full text-center text-muted-foreground py-10">Gagal memuat lowongan unggulan.</p>
            ) : featuredJobs.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground py-10">Tidak ada lowongan unggulan ditemukan.</p>
            ) : featuredJobs.map((job) => (
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
                  {(job.company && typeof job.company === "object")
                    ? job.company.companyName
                    : (job.company || "Perusahaan tidak diketahui")}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {job.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(job.createdAt).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="mt-3 text-sm font-medium text-primary">{job.salary}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">Perusahaan Teratas</h2>
              <p className="text-muted-foreground">Perusahaan yang sedang aktif merekrut saat ini</p>
            </div>
            <Link to="/companies">
              <Button variant="outline" className="gap-2">
                Lihat Semua <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isCompaniesLoading ? (
              <div className="col-span-full flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : isCompaniesError ? (
              <p className="col-span-full text-center text-muted-foreground py-10">Gagal memuat daftar perusahaan.</p>
            ) : featuredCompanies.length === 0 ? (
              <p className="col-span-full text-center text-muted-foreground py-10">Tidak ada perusahaan ditemukan.</p>
            ) : featuredCompanies.map((company) => (
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
                <p className="text-sm text-muted-foreground">{company.industry || "-"}</p>
                <p className="mt-2 text-sm font-medium text-primary">
                  {company._count?.jobs || 0} lowongan aktif
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverySection;
