import { Link } from "react-router";
import { Briefcase } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">JobBoard</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Find your dream job or the perfect candidate. Connecting talent with opportunity across Indonesia.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-foreground">For Job Seekers</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/jobs" className="hover:text-primary">Browse Jobs</Link>
            <Link to="/companies" className="hover:text-primary">Companies</Link>
            <Link to="/register" className="hover:text-primary">Create Account</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-foreground">For Employers</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/register" className="hover:text-primary">Post a Job</Link>
            <Link to="/register" className="hover:text-primary">Company Registration</Link>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-foreground">Support</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span className="cursor-pointer hover:text-primary">Help Center</span>
            <span className="cursor-pointer hover:text-primary">Privacy Policy</span>
            <span className="cursor-pointer hover:text-primary">Terms of Service</span>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © 2026 JobBoard. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
