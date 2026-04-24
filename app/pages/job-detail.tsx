import { useParams, Link, useNavigate } from "react-router";
import { MapPin, Clock, Briefcase, ArrowLeft, Building2, DollarSign, Share2, Twitter, Facebook, Linkedin, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Navbar from "~/components/layout/navbar";
import Footer from "~/components/layout/footer";
import { useAuth } from "~/stores/useAuth";
import { axiosInstance } from "~/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useMemo } from "react";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/jobs/${id}`);
      return response.data.data;
    },
    enabled: !!id,
    retry: false,
  });

  const { data: applications } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      const response = await axiosInstance.get("/applications", {
        params: { take: 100 },
      });
      return response.data.data;
    },
    enabled: !!user && user.role === "USER",
  });

  const isApplied = useMemo(() => {
    if (!applications || !id) return false;
    return applications.some((app: any) => app.jobId === Number(id));
  }, [applications, id]);

  const handleShare = (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `Check out this ${job?.title} position at ${job?.company}!`;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    const links: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    };

    if (links[platform]) {
      window.open(links[platform], "_blank", "noopener,noreferrer");
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error("Silakan masuk terlebih dahulu untuk melamar pekerjaan ini.");
      navigate("/login");
      return;
    }

    if (user.role === "ADMIN") {
      toast.error("Akun perusahaan tidak dapat melamar pekerjaan.");
      return;
    }

    setIsApplying(true);
    try {
      // Endpoint backend biasanya menggunakan bentuk jamak '/applications'
      // dan jobId dikirimkan sebagai path parameter sesuai dengan signature service:
      // applyToJob(jobId, userId, body)
      await axiosInstance.post(`/applications/job/${job?.id}`, {});
      
      toast.success("Lamaran Anda berhasil dikirim!");
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    } catch (error: any) {
      const message = error.response?.data?.message;
      if (message?.includes("CV utama belum tersedia")) {
        toast.error("Anda belum memiliki CV utama. Silakan upload CV di halaman profil terlebih dahulu.");
      } else {
        toast.error(message || "Gagal mengirim lamaran. Silakan coba lagi nanti.");
      }
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Navbar />
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Lowongan tidak ditemukan</h1>
          <Link to="/jobs"><Button className="mt-4">Back to Jobs</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="hero-gradient py-8">
        <div className="container">
          <Link to="/jobs" className="mb-4 inline-flex items-center gap-1 text-sm text-primary-foreground/80 hover:text-primary-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Jobs
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-card text-3xl overflow-hidden">
                {job.banner || job.company?.logo ? (
                  <img src={job.banner || job.company?.logo} alt={job.company?.companyName} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground md:text-3xl">{job.title}</h1>
                <Link to={`/companies/${job.companyId}`} className="text-primary-foreground/80 hover:underline">{job.company?.companyName || job.company}</Link>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleShare("linkedin")} className="gap-2">
                    <Linkedin className="h-4 w-4 text-[#0A66C2]" /> LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("twitter")} className="gap-2">
                    <Twitter className="h-4 w-4 text-[#1DA1F2]" /> Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("facebook")} className="gap-2">
                    <Facebook className="h-4 w-4 text-[#1877F2]" /> Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("whatsapp")} className="gap-2">
                    <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                size="lg" 
                className={isApplied ? "bg-secondary text-secondary-foreground" : "bg-card text-primary hover:bg-card/90"}
                onClick={handleApply}
                disabled={isApplying || isApplied}
              >
                {isApplying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isApplied ? "Applied" : "Apply Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-xl border border-border bg-card p-6 card-shadow">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Job Description</h2>
              <p className="text-muted-foreground leading-relaxed">{job.description}</p>
            </div>
            {job.tags && job.tags.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-6 card-shadow">
                <h2 className="mb-4 text-xl font-semibold text-foreground">Skills & Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag: string, i: number) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6 card-shadow space-y-4">
              <h3 className="font-semibold text-foreground">Job Overview</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" /> {job.location}
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Briefcase className="h-4 w-4 text-primary" /> {job.type}
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <DollarSign className="h-4 w-4 text-primary" /> {job.salary ? `IDR ${Number(job.salary).toLocaleString()}` : "Negotiable"}
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" /> Deadline: {new Date(job.deadline).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Building2 className="h-4 w-4 text-primary" /> {job.category}
                </div>
              </div>
              <Badge>{job.category}</Badge>
            </div>
            <div className="space-y-2">
              <Button 
                className="w-full" 
                size="lg"
                variant={isApplied ? "secondary" : "default"}
                onClick={handleApply}
                disabled={isApplying || isApplied}
              >
                {isApplying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isApplied ? "Applied" : "Apply Now"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full" size="lg">
                    <Share2 className="mr-2 h-4 w-4" /> Share Job
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60">
                  <DropdownMenuItem onClick={() => handleShare("linkedin")} className="gap-2">
                    <Linkedin className="h-4 w-4 text-[#0A66C2]" /> Share on LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("twitter")} className="gap-2">
                    <Twitter className="h-4 w-4 text-[#1DA1F2]" /> Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("facebook")} className="gap-2">
                    <Facebook className="h-4 w-4 text-[#1877F2]" /> Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("whatsapp")} className="gap-2">
                    <MessageCircle className="h-4 w-4 text-[#25D366]" /> Share via WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobDetail;
