import AdminLayout from "~/components/admin/admin-layout";
import { adminJobPostings, adminApplicants } from "~/data/admin-data";
import { FileText, Users, CheckCircle, Clock, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Link } from "react-router";
import AnalyticsOverview from "~/components/admin/analytics-overview";

const AdminOverview = () => {
  const totalJobs = adminJobPostings.length;
  const published = adminJobPostings.filter((j) => j.status === "published").length;
  const drafts = totalJobs - published;
  const totalApplicants = adminApplicants.length;
  const interviewed = adminApplicants.filter((a) => a.status === "interviewed").length;
  const accepted = adminApplicants.filter((a) => a.status === "accepted").length;

  const stats = [
    { label: "Total Job Postings", value: totalJobs, icon: FileText, color: "text-primary" },
    { label: "Published", value: published, icon: Eye, color: "text-accent" },
    { label: "Drafts", value: drafts, icon: EyeOff, color: "text-muted-foreground" },
    { label: "Total Applicants", value: totalApplicants, icon: Users, color: "text-primary" },
    { label: "In Interview", value: interviewed, icon: Clock, color: "text-yellow-500" },
    { label: "Accepted", value: accepted, icon: CheckCircle, color: "text-accent" },
  ];

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
                    <span className="text-sm text-muted-foreground">{job.applicantCount} applicants</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        job.status === "published"
                          ? "bg-accent/10 text-accent"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        <AnalyticsOverview />
      </div>
    </AdminLayout>
  );
};

export default AdminOverview;
