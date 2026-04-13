import { useState, useMemo } from "react";
import AdminLayout from "~/components/admin/admin-layout";
import { adminJobPostings, type JobPosting, type JobPostingStatus } from "~/data/admin-data";
import { categories } from "~/data/mock-data";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { useDebounce } from "~/hooks/use-debounce";
import { Link } from "react-router";
import { Plus, Eye, EyeOff, ArrowUpDown, Pencil, Trash2, Users } from "lucide-react";

type SortField = "title" | "createdAt" | "applicantCount" | "deadline";
type SortDir = "asc" | "desc";

const AdminJobList = () => {
  const [jobs, setJobs] = useState<JobPosting[]>(adminJobPostings);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let result = [...jobs];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((j) => j.title.toLowerCase().includes(q));
    }
    if (categoryFilter !== "all") {
      result = result.filter((j) => j.category === categoryFilter);
    }
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });
    return result;
  }, [jobs, debouncedSearch, categoryFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const toggleStatus = (id: number) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, status: j.status === "published" ? "draft" as JobPostingStatus : "published" as JobPostingStatus } : j
      )
    );
  };

  const deleteJob = (id: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort(field)}>
      {label}
      <ArrowUpDown className={`h-3 w-3 ${sortField === field ? "text-primary" : ""}`} />
    </button>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Job Postings</h1>
            <p className="text-muted-foreground">{jobs.length} total postings</p>
          </div>
          <Link to="/admin/jobs/new">
            <Button className="gap-2"><Plus className="h-4 w-4" /> New Job Posting</Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="sm:max-w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c: string) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><SortButton field="title" label="Title" /></TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden sm:table-cell">City</TableHead>
                <TableHead><SortButton field="applicantCount" label="Applicants" /></TableHead>
                <TableHead className="hidden md:table-cell"><SortButton field="deadline" label="Deadline" /></TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No job postings found</TableCell></TableRow>
              ) : (
                filtered.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <Link to={`/admin/jobs/${job.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                        {job.title}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell"><Badge variant="secondary">{job.category}</Badge></TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{job.city}</TableCell>
                    <TableCell>
                      <Link to={`/admin/jobs/${job.id}`} className="flex items-center gap-1 text-primary hover:underline">
                        <Users className="h-3 w-3" /> {job.applicantCount}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{job.deadline}</TableCell>
                    <TableCell>
                      <button onClick={() => toggleStatus(job.id)} className="flex items-center gap-1" title="Toggle status">
                        {job.status === "published" ? (
                          <Badge className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 cursor-pointer gap-1">
                            <Eye className="h-3 w-3" /> Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="cursor-pointer gap-1">
                            <EyeOff className="h-3 w-3" /> Draft
                          </Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/jobs/${job.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteJob(job.id)}>
                          <Trash2 className="h-4 w-4" />
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
    </AdminLayout>
  );
};

export default AdminJobList;
