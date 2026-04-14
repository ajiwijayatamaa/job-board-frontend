import { useParams, Link } from "react-router";
import { MapPin, Clock, Briefcase, ArrowLeft, Building2, DollarSign } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import { jobs } from "@/data/dashboard-data";

const JobDetail = () => {
  const { id } = useParams();
  const job = jobs.find((j) => j.id === Number(id));

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Job not found</h1>
          <Link to="/jobs"><Button className="mt-4">Back to Jobs</Button></Link>
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
          <Link to="/jobs" className="mb-4 inline-flex items-center gap-1 text-sm text-primary-foreground/80 hover:text-primary-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Jobs
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-card text-3xl">{job.companyLogo}</div>
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground md:text-3xl">{job.title}</h1>
                <Link to={`/companies/${job.companyId}`} className="text-primary-foreground/80 hover:underline">{job.company}</Link>
              </div>
            </div>
            <Button size="lg" className="bg-card text-primary hover:bg-card/90">Apply Now</Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-xl border border-border bg-card p-6 card-shadow">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Job Description</h2>
              <p className="text-muted-foreground leading-relaxed">{job.description}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 card-shadow">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 card-shadow space-y-4">
              <h3 className="font-semibold text-foreground">Job Overview</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" /> {job.location}
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Briefcase className="h-4 w-4 text-primary" /> {job.type}
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <DollarSign className="h-4 w-4 text-primary" /> {job.salary}
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" /> Posted {job.posted}
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Building2 className="h-4 w-4 text-primary" /> {job.experience}
                </div>
              </div>
              <Badge>{job.category}</Badge>
            </div>
            <Button className="w-full" size="lg">Apply Now</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDetail;
