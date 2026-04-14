import { useState } from "react";
import { Link } from "react-router";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Briefcase, FileText, CheckCircle2, XCircle, Clock, CalendarDays,
  MapPin, Video, Building2, ChevronDown, ChevronUp, MessageSquare, ArrowLeft, BellRing, X,
} from "lucide-react";
import { applications, type Application, type ApplicationStatus } from "@/data/dashboard-data";

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: React.ReactNode }> = {
  submitted: { label: "Submitted", color: "bg-muted text-muted-foreground", icon: <FileText className="h-3.5 w-3.5" /> },
  reviewed: { label: "Reviewed", color: "bg-secondary text-secondary-foreground", icon: <Clock className="h-3.5 w-3.5" /> },
  shortlisted: { label: "Shortlisted", color: "bg-primary/15 text-primary", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  interview: { label: "Interview", color: "bg-accent/15 text-accent-foreground", icon: <CalendarDays className="h-3.5 w-3.5" /> },
  accepted: { label: "Accepted", color: "bg-accent text-accent-foreground", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  rejected: { label: "Rejected", color: "bg-destructive/15 text-destructive", icon: <XCircle className="h-3.5 w-3.5" /> },
};

const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const TrackingTimeline = ({ tracking }: { tracking: Application["tracking"] }) => (
  <div className="flex flex-col gap-0">
    {tracking.map((step, i) => (
      <div key={i} className="flex items-start gap-3">
        <div className="flex flex-col items-center">
          <div className={`mt-0.5 h-3 w-3 rounded-full border-2 ${step.completed ? "border-primary bg-primary" : "border-border bg-card"}`} />
          {i < tracking.length - 1 && (
            <div className={`w-0.5 flex-1 min-h-[28px] ${step.completed ? "bg-primary" : "bg-border"}`} />
          )}
        </div>
        <div className="pb-4">
          <p className={`text-sm font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
          {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
        </div>
      </div>
    ))}
  </div>
);

const ApplicationCard = ({ app }: { app: Application }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-2xl">
              {app.companyLogo}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{app.jobTitle}</h3>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" /> {app.company}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {app.location} · Applied {app.appliedDate}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={app.status} />
            <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)} className="h-8 w-8">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-5 grid gap-6 border-t border-border pt-5 md:grid-cols-2">
            <div>
              <h4 className="mb-3 text-sm font-semibold text-foreground">Tracking Progress</h4>
              <TrackingTimeline tracking={app.tracking} />
            </div>

            {app.interview && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-foreground">Interview Schedule</h4>
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      {app.interview.date} at {app.interview.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Video className="h-4 w-4" />
                      {app.interview.type}
                    </div>
                    <p className="text-xs text-muted-foreground">{app.interview.location}</p>
                    <p className="text-xs text-muted-foreground">Interviewer: {app.interview.interviewer}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {app.status === "rejected" && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-destructive">Rejection Details</h4>
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardContent className="p-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">Reason: {app.rejectionReason}</p>
                    <div className="flex items-start gap-2">
                      <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{app.rejectionFeedback}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [dismissedReminders, setDismissedReminders] = useState<number[]>([]);

  const upcomingInterviews = applications.filter(
    (a) => a.interview?.reminderSent && (a.status === "interview" || a.status === "accepted") && !dismissedReminders.includes(a.id)
  );

  const stats = {
    total: applications.length,
    interview: applications.filter((a) => a.status === "interview").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const filterByTab = (tab: string) => {
    if (tab === "all") return applications;
    if (tab === "interviews") return applications.filter((a) => a.status === "interview" || a.status === "accepted");
    if (tab === "rejected") return applications.filter((a) => a.status === "rejected");
    return applications;
  };

  const [tab, setTab] = useState("all");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="container flex-1 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/profile">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
            <p className="text-sm text-muted-foreground">Track your job applications and interview schedules</p>
          </div>
        </div>

        {/* Interview Reminders */}
        {upcomingInterviews.length > 0 && (
          <div className="mb-6 space-y-3">
            {upcomingInterviews.map((app) => (
              <Card key={app.id} className="border-primary/30 bg-primary/5">
                <CardContent className="flex items-start gap-3 p-4">
                  <BellRing className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      Interview Reminder: {app.jobTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {app.interview!.date} at {app.interview!.time} · {app.interview!.type} · {app.interview!.location}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => setDismissedReminders((prev) => [...prev, app.id])}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total Applied", value: stats.total, icon: <Briefcase className="h-5 w-5 text-primary" />, bg: "bg-primary/10" },
            { label: "Interviews", value: stats.interview, icon: <CalendarDays className="h-5 w-5 text-accent-foreground" />, bg: "bg-accent/10" },
            { label: "Accepted", value: stats.accepted, icon: <CheckCircle2 className="h-5 w-5 text-accent-foreground" />, bg: "bg-accent/10" },
            { label: "Rejected", value: stats.rejected, icon: <XCircle className="h-5 w-5 text-destructive" />, bg: "bg-destructive/10" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>{s.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          {["all", "interviews", "rejected"].map((t) => (
            <TabsContent key={t} value={t} className="space-y-4">
              {filterByTab(t).length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Briefcase className="mb-2 h-10 w-10" />
                    <p>No applications found in this category.</p>
                  </CardContent>
                </Card>
              ) : (
                filterByTab(t).map((app) => <ApplicationCard key={app.id} app={app} />)
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
