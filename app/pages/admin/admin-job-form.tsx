import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import AdminLayout from "~/components/admin/admin-layout";
import { adminJobPostings } from "~/data/admin-data";
import { categories, locations } from "~/data/mock-data";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { X, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const AdminJobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const existing = isEdit ? adminJobPostings.find((j) => j.id === Number(id)) : null;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [banner, setBanner] = useState(existing?.banner ?? "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [city, setCity] = useState(existing?.city ?? "");
  const [salary, setSalary] = useState(existing?.salary ?? "");
  const [deadline, setDeadline] = useState(existing?.deadline ?? "");
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [published, setPublished] = useState(existing?.status === "published");

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category || !city || !deadline) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success(isEdit ? "Job posting updated!" : "Job posting created!");
    navigate("/admin/jobs");
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{isEdit ? "Edit" : "Create"} Job Posting</h1>
            <p className="text-muted-foreground">{isEdit ? "Update your job posting details" : "Fill in the details for a new job posting"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="card-shadow">
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Developer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the role, responsibilities..." rows={6} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner">Banner Image URL (optional)</Label>
                <Input id="banner" value={banner} onChange={(e) => setBanner(e.target.value)} placeholder="https://..." />
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>City Location *</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent>{locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary (optional)</Label>
                  <Input id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. Rp 15M - 25M" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline *</Label>
                  <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                />
                <Button type="button" variant="secondary" onClick={addTag}>Add</Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Publish immediately</Label>
                  <p className="text-sm text-muted-foreground">Make this job posting visible to applicants</p>
                </div>
                <Switch checked={published} onCheckedChange={setPublished} />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" className="gap-2"><Save className="h-4 w-4" /> {isEdit ? "Update" : "Create"} Posting</Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminJobForm;
