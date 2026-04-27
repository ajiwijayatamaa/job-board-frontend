import { useState } from "react";
import { Building2, MapPin, ChevronUp, ChevronDown, CalendarDays, Video, MessageSquare } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { StatusBadge } from "./status-badge";
import { TrackingTimeline } from "./tracking-timeline";

interface Application {
  id: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  jobTitle?: string;
  job: {
    title: string;
    city?: string;
    company: {
      companyName: string;
      logo?: string;
    };
  };
  interview?: {
    interviewDate: string;
    locationLink?: string | null;
    date?: string;
    time?: string;
  };
  rejectionReason?: string | null;
}

export const ApplicationCard = ({ app }: { app: Application }) => {
  const [expanded, setExpanded] = useState(false);

  const statusUpper = (app.status || "").toUpperCase();
  const submittedDate = new Date(app.createdAt).toLocaleDateString();
  const reviewCompleted = ["PROCESSED", "INTERVIEW", "ACCEPTED", "REJECTED"].includes(statusUpper);
  const interviewCompleted = ["INTERVIEW", "ACCEPTED", "REJECTED"].includes(statusUpper);
  const finalCompleted = ["ACCEPTED", "REJECTED"].includes(statusUpper);

  const tracking = [
    { label: "Submitted", completed: true, date: submittedDate },
    { label: "Reviewed", completed: reviewCompleted },
    { label: "Interview", completed: interviewCompleted },
    {
      label: statusUpper === "REJECTED" ? "Rejected" : "Accepted",
      completed: finalCompleted,
    },
  ];

  const interviewDate =
    app.interview?.date ||
    (app.interview?.interviewDate
      ? new Date(app.interview.interviewDate).toLocaleDateString()
      : undefined);
  const interviewTime =
    app.interview?.time ||
    (app.interview?.interviewDate
      ? new Date(app.interview.interviewDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : undefined);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-2xl">
              {app.job?.company?.logo ? (
                <img src={app.job.company.logo} alt={app.job.company.companyName} className="h-full w-full rounded-lg object-cover" />
              ) : (
                <Building2 className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{app.jobTitle || app.job?.title}</h3>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" /> {app.job?.company?.companyName}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {app.job?.city || "-"} Â· Applied {new Date(app.createdAt).toLocaleDateString()}
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
              <TrackingTimeline tracking={tracking} />
            </div>

            {app.interview && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-foreground">Interview Schedule</h4>
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      {interviewDate || "-"}{interviewTime ? ` at ${interviewTime}` : ""}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Video className="h-4 w-4" />
                      {app.interview.locationLink ? "Online" : "TBA"}
                    </div>
                    <p className="text-xs text-muted-foreground">{app.interview.locationLink || "Akan diinformasikan lebih lanjut"}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {statusUpper === "REJECTED" && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <h4 className="mb-2 text-sm font-semibold text-destructive">Rejection Details</h4>
                <p className="text-sm font-medium text-foreground">Reason: {app.rejectionReason || "-"}</p>
                <div className="mt-2 flex items-start gap-2">
                  <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground italic">"Silakan cek dashboard untuk detail proses."</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

