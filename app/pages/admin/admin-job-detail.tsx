import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import AdminLayout from "~/components/admin/admin-layout";
import { adminJobPostings, adminApplicants, type Applicant, type ApplicantStatus } from "~/data/admin-data";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { useDebounce } from "~/hooks/use-debounce";
import { ArrowLeft, Pencil, FileText, User, Eye } from "lucide-react";
import { toast } from "sonner";

const statusColors: Record<ApplicantStatus, string> = {
  submitted: "bg-muted text-muted-foreground",
  processed: "bg-primary/10 text-primary",
  interviewed: "bg-yellow-100 text-yellow-700",
  accepted: "bg-accent/10 text-accent",
  rejected: "bg-destructive/10 text-destructive",
};

const AdminJobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = adminJobPostings.find((j) => j.id === Number(id));

  const [applicants, setApplicants] = useState<Applicant[]>(
    adminApplicants.filter((a) => a.jobId === Number(id)).sort((a, b) => new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime())
  );
  const [search, setSearch] = useState("");
  const [eduFilter, setEduFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [cvPreview, setCvPreview] = useState<Applicant | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const educationOptions = useMemo(
    () => [...new Set(applicants.map((a) => a.education))],
    [applicants]
  );

  const filtered = useMemo(() => {
    let result = [...applicants];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.salaryExpectation.toLowerCase().includes(q) ||
          String(a.age).includes(q)
      );
    }
    if (eduFilter !== "all") {
      result = result.filter((a) => a.education === eduFilter);
    }
    return result;
  }, [applicants, debouncedSearch, eduFilter]);

  const updateStatus = (applicantId: number, status: ApplicantStatus) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === applicantId ? { ...a, status } : a))
    );
    toast.success(`Applicant status updated to ${status}`);
  };

  if (!job) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">Job posting not found</p>
          <Link to="/admin/jobs"><Button variant="outline">Back to listings</Button></Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Job Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
              <p className="text-muted-foreground">{job.city} · {job.category} · Deadline: {job.deadline}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={job.status === "published" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}>
              {job.status}
            </Badge>
            <Link to={`/admin/jobs/${job.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1"><Pencil className="h-4 w-4" /> Edit</Button>
            </Link>
          </div>
        </div>

        {/* Job Info Card */}
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <p className="text-foreground leading-relaxed">{job.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {job.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
            {job.salary && <p className="mt-3 text-sm text-muted-foreground">Salary: {job.salary}</p>}
          </CardContent>
        </Card>

        {/* Applicants Section */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Applicants ({applicants.length})</h2>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Input
              placeholder="Search by name, age, salary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />
            <Select value={eduFilter} onValueChange={setEduFilter}>
              <SelectTrigger className="sm:max-w-[240px]">
                <SelectValue placeholder="Education" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Education</SelectItem>
                {educationOptions.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead className="hidden sm:table-cell">Age</TableHead>
                  <TableHead className="hidden md:table-cell">Education</TableHead>
                  <TableHead className="hidden md:table-cell">Salary Exp.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No applicants found</TableCell></TableRow>
                ) : (
                  filtered.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{a.profilePicture}</span>
                          <div>
                            <p className="font-medium text-foreground">{a.name}</p>
                            <p className="text-xs text-muted-foreground">Applied {a.appliedAt}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{a.age}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{a.education}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{a.salaryExpectation}</TableCell>
                      <TableCell>
                        <Select
                          value={a.status}
                          onValueChange={(v) => updateStatus(a.id, v as ApplicantStatus)}
                        >
                          <SelectTrigger className="h-8 w-[130px]">
                            <Badge className={`${statusColors[a.status]} text-xs`}>{a.status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="processed">Processed</SelectItem>
                            <SelectItem value="interviewed">Interviewed</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Profile" onClick={() => setSelectedApplicant(a)}>
                            <User className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Preview CV" onClick={() => setCvPreview(a)}>
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Profile Dialog */}
        <Dialog open={!!selectedApplicant} onOpenChange={() => setSelectedApplicant(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Applicant Profile</DialogTitle>
              <DialogDescription>View applicant details</DialogDescription>
            </DialogHeader>
            {selectedApplicant && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{selectedApplicant.profilePicture}</span>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{selectedApplicant.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedApplicant.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-muted-foreground">Age</p><p className="font-medium text-foreground">{selectedApplicant.age}</p></div>
                  <div><p className="text-muted-foreground">Gender</p><p className="font-medium text-foreground">{selectedApplicant.gender}</p></div>
                  <div><p className="text-muted-foreground">Education</p><p className="font-medium text-foreground">{selectedApplicant.education}</p></div>
                  <div><p className="text-muted-foreground">Salary Exp.</p><p className="font-medium text-foreground">{selectedApplicant.salaryExpectation}</p></div>
                  <div className="col-span-2"><p className="text-muted-foreground">Address</p><p className="font-medium text-foreground">{selectedApplicant.address}</p></div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Status</p>
                  <Badge className={`${statusColors[selectedApplicant.status]} mt-1`}>{selectedApplicant.status}</Badge>
                  {selectedApplicant.status === "rejected" && selectedApplicant.rejectionReason && (
                    <p className="mt-2 text-sm text-destructive bg-destructive/5 rounded-md p-2">{selectedApplicant.rejectionReason}</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* CV Preview Dialog */}
        <Dialog open={!!cvPreview} onOpenChange={() => setCvPreview(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>CV Preview</DialogTitle>
              <DialogDescription>{cvPreview?.name}'s submitted CV</DialogDescription>
            </DialogHeader>
            {cvPreview && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/30 p-6 space-y-4">
                  <div className="flex items-center gap-4 border-b border-border pb-4">
                    <span className="text-4xl">{cvPreview.profilePicture}</span>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{cvPreview.name}</h3>
                      <p className="text-sm text-muted-foreground">{cvPreview.email}</p>
                      <p className="text-sm text-muted-foreground">{cvPreview.address}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p><span className="text-muted-foreground">Age:</span> {cvPreview.age}</p>
                      <p><span className="text-muted-foreground">Gender:</span> {cvPreview.gender}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Education</h4>
                    <p className="text-sm text-foreground">{cvPreview.education}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Salary Expectation</h4>
                    <p className="text-sm text-foreground">{cvPreview.salaryExpectation}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="h-4 w-4" /> Download Full CV
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminJobDetail;
