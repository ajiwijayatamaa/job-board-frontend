import { useState, useMemo } from "react";
import { format } from "date-fns";
import AdminLayout from "~/components/admin/admin-layout";
import {
  adminInterviewSchedules,
  adminApplicants,
  adminJobPostings,
  type InterviewSchedule,
  type Applicant,
} from "@/data/admin-data";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useDebounce } from "~/hooks/use-debounce";
import {
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Video,
  Building2,
  Bell,
  BellRing,
  CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

interface ScheduleForm {
  jobId: number | null;
  applicantIds: number[];
  title: string;
  date: string;
  time: string;
  duration: number;
  type: "Online" | "On-site";
  location: string;
  interviewer: string;
  notes: string;
}

const emptyForm: ScheduleForm = {
  jobId: null,
  applicantIds: [],
  title: "",
  date: "",
  time: "",
  duration: 60,
  type: "Online",
  location: "",
  interviewer: "",
  notes: "",
};

const AdminInterviews = () => {
  const [schedules, setSchedules] = useState<InterviewSchedule[]>(adminInterviewSchedules);
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const debouncedSearch = useDebounce(search, 300);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ScheduleForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>();

  const publishedJobs = adminJobPostings.filter((j) => j.status === "published");

  const availableApplicants = useMemo(() => {
    if (!form.jobId) return [];
    return adminApplicants.filter(
      (a) => a.jobId === form.jobId && (a.status === "processed" || a.status === "interviewed")
    );
  }, [form.jobId]);

  const filtered = useMemo(() => {
    let result = [...schedules];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.interviewer.toLowerCase().includes(q)
      );
    }
    if (jobFilter !== "all") {
      result = result.filter((s) => s.jobId === Number(jobFilter));
    }
    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [schedules, debouncedSearch, jobFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setCalendarDate(undefined);
    setDialogOpen(true);
  };

  const openEdit = (schedule: InterviewSchedule) => {
    setEditingId(schedule.id);
    setForm({
      jobId: schedule.jobId,
      applicantIds: [...schedule.applicantIds],
      title: schedule.title,
      date: schedule.date,
      time: schedule.time,
      duration: schedule.duration,
      type: schedule.type,
      location: schedule.location,
      interviewer: schedule.interviewer,
      notes: schedule.notes || "",
    });
    setCalendarDate(new Date(schedule.date));
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title || !form.jobId || !form.date || !form.time || form.applicantIds.length === 0) {
      toast.error("Please fill in all required fields and select at least one applicant");
      return;
    }

    if (editingId) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? { ...s, ...form, jobId: form.jobId!, notes: form.notes || undefined }
            : s
        )
      );
      toast.success("Interview schedule updated");
    } else {
      const newSchedule: InterviewSchedule = {
        id: Math.max(0, ...schedules.map((s) => s.id)) + 1,
        jobId: form.jobId!,
        applicantIds: form.applicantIds,
        title: form.title,
        date: form.date,
        time: form.time,
        duration: form.duration,
        type: form.type,
        location: form.location,
        interviewer: form.interviewer,
        notes: form.notes || undefined,
        reminderSent: false,
      };
      setSchedules((prev) => [...prev, newSchedule]);
      toast.success("Interview schedule created");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setSchedules((prev) => prev.filter((s) => s.id !== deleteId));
      toast.success("Interview schedule deleted");
      setDeleteId(null);
    }
  };

  const sendReminder = (id: number) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, reminderSent: true } : s))
    );
    toast.success("Reminder notification sent to all invited applicants");
  };

  const toggleApplicant = (applicantId: number) => {
    setForm((prev) => ({
      ...prev,
      applicantIds: prev.applicantIds.includes(applicantId)
        ? prev.applicantIds.filter((id) => id !== applicantId)
        : [...prev.applicantIds, applicantId],
    }));
  };

  const getApplicantName = (id: number) =>
    adminApplicants.find((a) => a.id === id)?.name ?? `Applicant #${id}`;

  const getJobTitle = (id: number) =>
    adminJobPostings.find((j) => j.id === id)?.title ?? `Job #${id}`;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Interview Schedules</h1>
            <p className="text-muted-foreground">Manage interview sessions for applicants</p>
          </div>
          <Button onClick={openCreate} className="gap-1">
            <Plus className="h-4 w-4" /> New Schedule
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search by title or interviewer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger className="sm:max-w-[260px]">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {publishedJobs.map((j) => (
                <SelectItem key={j.id} value={String(j.id)}>
                  {j.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Schedule Cards */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CalendarDays className="mb-2 h-10 w-10" />
              <p>No interview schedules found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((schedule) => (
              <Card key={schedule.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{schedule.title}</h3>
                      <p className="text-sm text-muted-foreground">{getJobTitle(schedule.jobId)}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        schedule.type === "Online"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent-foreground"
                      }
                    >
                      {schedule.type === "Online" ? (
                        <Video className="mr-1 h-3 w-3" />
                      ) : (
                        <Building2 className="mr-1 h-3 w-3" />
                      )}
                      {schedule.type}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {schedule.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {schedule.time} ({schedule.duration}min)
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{schedule.location}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Users className="h-3 w-3" /> Invited ({schedule.applicantIds.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {schedule.applicantIds.map((aid) => (
                        <Badge key={aid} variant="outline" className="text-xs">
                          {getApplicantName(aid)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {schedule.notes && (
                    <p className="text-xs text-muted-foreground italic">📝 {schedule.notes}</p>
                  )}

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground">
                      Interviewer: {schedule.interviewer}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title={schedule.reminderSent ? "Reminder sent" : "Send reminder"}
                        onClick={() => sendReminder(schedule.id)}
                      >
                        {schedule.reminderSent ? (
                          <BellRing className="h-4 w-4 text-primary" />
                        ) : (
                          <Bell className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Edit"
                        onClick={() => openEdit(schedule)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        title="Delete"
                        onClick={() => setDeleteId(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Interview" : "New Interview Schedule"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Update interview details" : "Schedule a new interview session"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Technical Interview Round 1"
                />
              </div>

              <div>
                <Label>Job Position *</Label>
                <Select
                  value={form.jobId ? String(form.jobId) : ""}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, jobId: Number(v), applicantIds: [] }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job" />
                  </SelectTrigger>
                  <SelectContent>
                    {publishedJobs.map((j) => (
                      <SelectItem key={j.id} value={String(j.id)}>
                        {j.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {form.jobId && (
                <div>
                  <Label>Invite Applicants *</Label>
                  {availableApplicants.length === 0 ? (
                    <p className="text-sm text-muted-foreground mt-1">
                      No eligible applicants (processed/interviewed) for this job.
                    </p>
                  ) : (
                    <div className="mt-2 space-y-2 max-h-36 overflow-y-auto rounded-md border border-border p-2">
                      {availableApplicants.map((a) => (
                        <label
                          key={a.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded px-2 py-1"
                        >
                          <Checkbox
                            checked={form.applicantIds.includes(a.id)}
                            onCheckedChange={() => toggleApplicant(a.id)}
                          />
                          <span className="text-sm text-foreground">{a.name}</span>
                          <Badge variant="outline" className="text-xs ml-auto">
                            {a.status}
                          </Badge>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.date || "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={calendarDate}
                        onSelect={(d) => {
                          setCalendarDate(d);
                          if (d) setForm((f) => ({ ...f, date: format(d, "yyyy-MM-dd") }));
                        }}
                        disabled={(d) => d < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Time *</Label>
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Duration (min)</Label>
                  <Input
                    type="number"
                    min={15}
                    value={form.duration}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, duration: Number(e.target.value) }))
                    }
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, type: v as "Online" | "On-site" }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="On-site">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Location *</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Google Meet link or office address"
                />
              </div>

              <div>
                <Label>Interviewer *</Label>
                <Input
                  value={form.interviewer}
                  onChange={(e) => setForm((f) => ({ ...f, interviewer: e.target.value }))}
                  placeholder="e.g. John Doe - Engineering Manager"
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Additional instructions or focus areas..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingId ? "Update" : "Create"} Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Interview Schedule</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove this interview schedule. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminInterviews;
