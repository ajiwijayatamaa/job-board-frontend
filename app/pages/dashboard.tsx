import { useState } from "react";
import { Link } from "react-router";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Briefcase, CheckCircle2, XCircle, CalendarDays, ArrowLeft, BellRing, X,
} from "lucide-react";
import { applications } from "~/data/dashboard-data";
import { ApplicationCard } from "./application-card";

const Dashboard = () => {
  const [dismissedReminders, setDismissedReminders] = useState<number[]>([]);
  const [tab, setTab] = useState("all");

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
    switch(tab) {
      case "interviews": return applications.filter((a) => a.status === "interview" || a.status === "accepted");
      case "rejected": return applications.filter((a) => a.status === "rejected");
      default: return applications;
    }
  };

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
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
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
          <TabsList className="mb-6 flex flex-col h-auto items-stretch w-full max-w-[200px] bg-muted/50 p-1">
            <TabsTrigger value="all" className="justify-start px-4 py-2">All Applications</TabsTrigger>
            <TabsTrigger value="interviews" className="justify-start px-4 py-2">Interviews</TabsTrigger>
            <TabsTrigger value="rejected" className="justify-start px-4 py-2">Rejected</TabsTrigger>
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
