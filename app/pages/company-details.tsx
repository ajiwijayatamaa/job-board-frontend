import { useParams, Link } from "react-router";
import { MapPin, Users, Calendar, Globe, ArrowLeft, Clock, Loader2, Building2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

// Interface for API data for a single company detail
interface CompanyDetailData {
  id: number;
  companyName: string;
  industry?: string;
  address?: string; // Changed from location to address to match backend
  size?: string; // e.g., "100-300", "5000+"
  logo?: string;
  description?: string;
  benefits?: string[]; // Make optional, and handle if it's not an array
  founded?: string; // Assuming year or date string
  website?: string;
  _count?: {
    jobs: number;
  };
}

// Interface for jobs associated with a company
interface JobData {
  id: number;
  title: string;
  type: string;
  location?: string;
  city?: string;
  salary?: string;
  createdAt: string; // For job posting date
}

const CompanyDetail = () => {
  const { id } = useParams();
  const companyId = Number(id);

  const { data: company, isLoading: isCompanyLoading, error: companyError } = useQuery({
    queryKey: ["company-detail", companyId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/public/companies/${companyId}`); // Use public endpoint
      return response.data.data as CompanyDetailData;
    },
    enabled: !!id, // Only fetch if id is available
  });

  const { data: companyJobs, isLoading: isJobsLoading, error: jobsError } = useQuery({
    queryKey: ["company-jobs", companyId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/public/companies/${companyId}/jobs`); // Use public endpoint
      return response.data.data as JobData[];
    },
    enabled: !!id, // Only fetch if id is available
  });

  if (isCompanyLoading || isJobsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[calc(100vh-150px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (companyError || !company) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Company not found</h1>
          <p className="text-muted-foreground mt-2">The company you are looking for does not exist or an error occurred.</p>
          <Link to="/companies"><Button className="mt-4">Back to Companies</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="hero-gradient py-8">
        <div className="container">
          <Link to="/companies" className="mb-4 inline-flex items-center gap-1 text-sm text-primary-foreground/80 hover:text-primary-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Companies
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-card text-4xl">
              {company.logo ? (
                <img src={company.logo} alt={company.companyName} className="h-full w-full rounded-xl object-cover" />
              ) : (
                <Building2 className="h-12 w-12 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground md:text-3xl">{company.companyName}</h1>
              <p className="text-primary-foreground/80">{company.industry || "-"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-xl border border-border bg-card p-6 card-shadow">
              <h2 className="mb-4 text-xl font-semibold text-foreground">About</h2>
              <p className="text-muted-foreground leading-relaxed">{company.description || "-"}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 card-shadow">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Benefits</h2>
              {company.benefits && company.benefits.length > 0 ? (
                <div className="flex flex-wrap gap-2">{company.benefits.map((b: string) => <Badge key={b} variant="secondary">{b}</Badge>)}</div>
              ) : (<p className="text-muted-foreground text-sm">No benefits listed.</p>)}
            </div>
            <div className="rounded-xl border border-border bg-card p-6 card-shadow">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Open Positions ({companyJobs?.length || 0})</h2>
              {isJobsLoading ? (
                <div className="flex justify-center py-5"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
              ) : !companyJobs || companyJobs.length === 0 ? (
                <p className="text-muted-foreground">No open positions at this time.</p>
              ) : (
                <div className="space-y-3">
                  {companyJobs?.map((job) => (
                    <Link key={job.id} to={`/jobs/${job.id}`} className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-primary/30">
                      <div>
                        <h3 className="font-medium text-foreground hover:text-primary">{job.title}</h3>
                        <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location || job.city || "-"}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.type}</span>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-primary">{job.salary || "-"}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 card-shadow space-y-3 text-sm">
              <h3 className="font-semibold text-foreground mb-2">Company Info</h3>
              <div className="flex items-center gap-3 text-muted-foreground"><MapPin className="h-4 w-4 text-primary" /> {company.address || "-"}</div>
              <div className="flex items-center gap-3 text-muted-foreground"><Users className="h-4 w-4 text-primary" /> {(company.size || "-")} employees</div>
              <div className="flex items-center gap-3 text-muted-foreground"><Calendar className="h-4 w-4 text-primary" /> Founded {company.founded || "-"}</div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Globe className="h-4 w-4 text-primary" />
                {company.website ? (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{company.website}</a>
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyDetail;
