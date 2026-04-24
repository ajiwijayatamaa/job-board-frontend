import AdminLayout from "~/components/admin/admin-layout";
import { FileText, Users, CheckCircle, Clock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Link } from "react-router";
import { AnalyticsOverview } from "~/components/admin/analytics-overview";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

// Define interfaces for the data fetched from API
interface AdminJob {
  id: number;
  title: string;
  status: "PUBLISHED" | "DRAFT" | "CLOSED";
  city: string;
  category: string;
  _count: {
    applications: number;
  };
}

interface AdminApplication {
  id: number;
  status: "PENDING" | "PROCESSED" | "INTERVIEW" | "ACCEPTED" | "REJECTED";
  user: {
    gender: string;
    education: string;
    address: string;
    dateOfBirth: string; // Assuming ISO string
  };
  jobId: number;
  expectedSalary: string; // Assuming string like "Rp 5.000.000"
}

const AdminOverview = () => {
  // Fetch job postings
  const { data: adminJobPostings, isLoading: isLoadingJobs } = useQuery({
    queryKey: ["adminJobs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/admin/jobs?take=1000"); // Fetch all or a large number for overview
      return response.data.data as AdminJob[];
    },
  });

  // Fetch applicants
  const { data: adminApplicants, isLoading: isLoadingApplicants } = useQuery({
    queryKey: ["adminApplications"],
    queryFn: async () => {
      const response = await axiosInstance.get("/admin/applications?take=1000"); // Fetch all or a large number for overview
      return response.data.data as AdminApplication[];
    },
  });

  const stats = useMemo(() => {
    const jobs = adminJobPostings || [];
    const applicants = adminApplicants || [];

    const totalJobs = jobs.length;
    const published = jobs.filter((j) => j.status === "PUBLISHED").length;
    const drafts = totalJobs - published;
    const totalApplicants = applicants.length;
    const interviewed = applicants.filter((a) => a.status === "INTERVIEW").length;
    const accepted = applicants.filter((a) => a.status === "ACCEPTED").length;

    return [
      { label: "Total Job Postings", value: totalJobs, icon: FileText, color: "text-primary" },
      { label: "Published", value: published, icon: Eye, color: "text-accent" },
      { label: "Drafts", value: drafts, icon: EyeOff, color: "text-muted-foreground" },
      { label: "Total Applicants", value: totalApplicants, icon: Users, color: "text-primary" },
      { label: "In Interview", value: interviewed, icon: Clock, color: "text-yellow-500" },
      { label: "Accepted", value: accepted, icon: CheckCircle, color: "text-accent" },
    ];
  }, [adminJobPostings, adminApplicants]);

  if (isLoadingJobs || isLoadingApplicants) {
    return <AdminLayout><div className="flex justify-center items-center h-full min-h-[calc(100vh-100px)]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Manage your job postings and applicants</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="card-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <s.icon className={`h-8 w-8 ${s.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {adminJobPostings && adminJobPostings.length > 0 && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Recent Job Postings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adminJobPostings.slice(0, 5).map((job) => (
                  <Link
                    key={job.id}
                    to={`/admin/jobs/${job.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{job.title}</p>
                      <p className="text-sm text-muted-foreground">{job.city} · {job.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{job._count.applications} applicants</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${job.status === "PUBLISHED" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                        {job.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        <AnalyticsOverview jobs={adminJobPostings || []} applicants={adminApplicants || []} />
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
