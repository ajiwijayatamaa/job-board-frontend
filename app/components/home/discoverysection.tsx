import { Link } from "react-router";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { jobs, companies } from "@/data/mock-data";

const DiscoverySection = () => {
  const featuredJobs = jobs.slice(0, 6);
  const featuredCompanies = companies.slice(0, 4);

  return (
    <section className="py-16">
      <div className="container">
        {/* Featured Jobs */}
        <div className="mb-16">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">Featured Jobs</h2>
              <p className="text-muted-foreground">Latest opportunities from top companies</p>
            </div>
            <Link to="/jobs">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
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
                <p className="mb-3 text-sm text-muted-foreground">{job.company}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {job.posted}
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
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">Top Companies</h2>
              <p className="text-muted-foreground">Companies actively hiring right now</p>
            </div>
            <Link to="/companies">
              <Button variant="outline" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCompanies.map((company) => (
              <Link
                key={company.id}
                to={`/companies/${company.id}`}
                className="group rounded-xl border border-border bg-card p-5 text-center transition-all hover:border-primary/30 card-shadow hover:card-shadow-hover"
              >
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-secondary text-3xl">
                  {company.logo}
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {company.name}
                </h3>
                <p className="text-sm text-muted-foreground">{company.industry}</p>
                <p className="mt-2 text-sm font-medium text-primary">
                  {company.openPositions} open positions
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
