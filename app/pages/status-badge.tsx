import { FileText, Clock, CheckCircle2, CalendarDays, XCircle } from "lucide-react";
import { type ApplicationStatus } from "~/data/dashboard-data";

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: React.ReactNode }> = {
  submitted: { label: "Submitted", color: "bg-muted text-muted-foreground", icon: <FileText className="h-3.5 w-3.5" /> },
  reviewed: { label: "Reviewed", color: "bg-secondary text-secondary-foreground", icon: <Clock className="h-3.5 w-3.5" /> },
  shortlisted: { label: "Shortlisted", color: "bg-primary/15 text-primary", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  interview: { label: "Interview", color: "bg-accent/15 text-accent-foreground", icon: <CalendarDays className="h-3.5 w-3.5" /> },
  accepted: { label: "Accepted", color: "bg-accent text-accent-foreground", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  rejected: { label: "Rejected", color: "bg-destructive/15 text-destructive", icon: <XCircle className="h-3.5 w-3.5" /> },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};