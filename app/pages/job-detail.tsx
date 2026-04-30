import { useParams, Link, useNavigate, useLocation } from "react-router";
import {
  MapPin,
  Clock,
  Briefcase,
  ArrowLeft,
  Building2,
  DollarSign,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Loader2,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Timer,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
import type { ApplicationCV } from "~/types/application";
import useGetMyTestResult from "~/hooks/api/useGetMyTestResult";
import { cn } from "~/lib/utils";

// ─── Helpers ───────────────────────────────────────────────
const formatSalary = (val: any) =>
  val ? `IDR ${Number(val).toLocaleString("id-ID")}` : "Negotiable";

const daysUntilDeadline = (deadline: string) => {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const resolvePublicImageUrl = (url: string | null | undefined) => {
  if (!url) return null;
  const trimmed = String(url).trim();
  if (!trimmed) return null;

  // Absolute (Cloudinary/S3/etc.) or browser object URLs
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // Relative path served by backend (e.g. /uploads/...)
  const base = (import.meta.env.VITE_BASE_URL_API || "http://localhost:8000")
    .toString()
    .replace(/\/$/, "");
  const needsSlash = !trimmed.startsWith("/");
  return `${base}${needsSlash ? "/" : ""}${trimmed}`;
};

// ─── Main Component ────────────────────────────────────────
const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isApplying, setIsApplying] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [preTestConfirmOpen, setPreTestConfirmOpen] = useState(false);
  const [cvOption, setCvOption] = useState<"primary" | "upload" | string>(
    "primary",
  );
  const [cvName, setCvName] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [expectedSalary, setExpectedSalary] = useState("");

  const testResultIdFromState: number | null = state?.testResultId ?? null;

  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-job", id],
    queryFn: async () => (await axiosInstance.get(`/public/jobs/${id}`)).data,
    enabled: !!id,
    retry: false,
  });

  const { data: myTestResult } = useGetMyTestResult(
    Number(id),
    !!user && user.role === "USER" && !!job?.preTest && !testResultIdFromState,
  );

  const resolvedTestResultId =
    testResultIdFromState ?? myTestResult?.testResultId ?? null;

  const { data: applications } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () =>
      (
        await axiosInstance.get("/applications/me", {
          params: { take: 100, page: 1 },
        })
      ).data.data,
    enabled: !!user && user.role === "USER",
  });

  const { data: cvs, isLoading: isCvsLoading } = useQuery({
    queryKey: ["cvs"],
    queryFn: async () =>
      (await axiosInstance.get("/cvs")).data.data as ApplicationCV[],
    enabled: !!user && user.role === "USER" && applyOpen,
  });

  const isApplied = useMemo(() => {
    if (!applications || !id) return false;
    return applications.some(
      (app: any) => (app.jobId || app.job?.id) === Number(id),
    );
  }, [applications, id]);

  const needsPreTest = !!job?.preTest && !resolvedTestResultId;

  // ─── Handlers ───────────────────────────────────────────
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this ${job?.title} position at ${job?.company?.companyName || job?.company}!`;
    const eu = encodeURIComponent(url);
    const et = encodeURIComponent(text);
    const links: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${eu}&text=${et}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${eu}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${eu}`,
      whatsapp: `https://api.whatsapp.com/send?text=${et}%20${eu}`,
    };
    if (links[platform])
      window.open(links[platform], "_blank", "noopener,noreferrer");
  };

  const handleOpenApply = () => {
    if (!user) {
      toast.error("Silakan masuk terlebih dahulu.");
      navigate("/login");
      return;
    }
    if (user.role === "ADMIN") {
      toast.error("Akun perusahaan tidak dapat melamar pekerjaan.");
      return;
    }
    if (needsPreTest) {
      setPreTestConfirmOpen(true);
      return;
    }
    setApplyOpen(true);
  };

  const handleSubmitApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === "ADMIN") return;
    const parsedExpectedSalary = Number(expectedSalary);
    if (!Number.isFinite(parsedExpectedSalary) || parsedExpectedSalary < 0) {
      toast.error("Ekspektasi gaji harus berupa angka valid.");
      return;
    }
    setIsApplying(true);
    try {
      let cvIdToUse: number | undefined;
      if (cvOption === "upload") {
        if (!cvFile || !cvName.trim()) {
          toast.error("Mohon isi nama CV dan upload file PDF.");
          return;
        }
        const fd = new FormData();
        fd.append("cvName", cvName.trim());
        fd.append("cv", cvFile);
        const res = await axiosInstance.post("/cvs", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const uploaded = res.data?.data as ApplicationCV | undefined;
        if (!uploaded?.id) {
          toast.error("Gagal mengunggah CV.");
          return;
        }
        cvIdToUse = uploaded.id;
      } else if (cvOption !== "primary") {
        const parsed = Number(cvOption);
        if (Number.isFinite(parsed) && parsed > 0) cvIdToUse = parsed;
      }
      await axiosInstance.post(`/applications/job/${job?.id}`, {
        ...(cvIdToUse ? { cvId: cvIdToUse } : {}),
        expectedSalary: parsedExpectedSalary,
        ...(resolvedTestResultId ? { testResultId: resolvedTestResultId } : {}),
      });
      toast.success("Lamaran berhasil dikirim!");
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applied-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["cvs"] });
      setApplyOpen(false);
      setCvOption("primary");
      setCvName("");
      setCvFile(null);
      setExpectedSalary("");
    } catch (err: any) {
      const msg = err.response?.data?.message;
      toast.error(
        msg?.includes("CV utama belum tersedia")
          ? "Anda belum memiliki CV utama. Upload CV di halaman profil terlebih dahulu."
          : msg || "Gagal mengirim lamaran.",
      );
    } finally {
      setIsApplying(false);
    }
  };

  // ─── Loading ─────────────────────────────────────────────
  if (isLoading) {
    return (
      // Changed background color for consistency
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen bg-zinc-50/50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-center p-6">
          <div>
            <p className="text-6xl font-black text-zinc-200 mb-2">404</p>
            <h1 className="text-xl font-black text-zinc-900 uppercase italic mb-4">
              Lowongan tidak ditemukan
            </h1>
            <Link to="/jobs">
              <Button
                variant="outline"
                className="rounded-xl font-bold uppercase text-xs tracking-widest"
              >
                ← Kembali ke semua lowongan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const deadline = daysUntilDeadline(job.deadline);
  const bannerSrc = resolvePublicImageUrl(job.banner);

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <div className="hero-gradient py-8">
        {" "}
        {/* Changed to hero-gradient */}
        <div className="container">
          {" "}
          {/* Changed max-w-6xl mx-auto px-4 to container */}
          <Link
            to="/jobs"
            className="mb-4 inline-flex items-center gap-1 text-sm text-primary-foreground/80 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke semua lowongan
          </Link>

          {bannerSrc && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img
                src={bannerSrc}
                alt={job.title}
                className="h-44 w-full object-cover md:h-60"
                loading="lazy"
              />
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4 md:flex-row md:items-end justify-between" // Adjusted gap
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {" "}
                {/* Adjusted mb */}
                <Sparkles className="h-4 w-4 text-primary-foreground" />{" "}
                {/* Changed color */}
                <span className="text-xs font-semibold uppercase text-primary-foreground/80">
                  {" "}
                  {/* Adjusted text style */}
                  {job.category}
                </span>
              </div>

              <Link
                to={`/companies/${job.companyId}`}
                className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-blue-400 hover:bg-blue-500 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-primary-foreground">
                  {" "}
                  {/* Adjusted size and background */}
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-primary-foreground">
                  {" "}
                  {/* Adjusted text style */}
                  {job.company?.companyName || job.company}
                </span>
              </Link>

              <h1 className="text-2xl font-bold text-primary-foreground md:text-3xl mb-4">
                {" "}
                {/* Adjusted text style */}
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1 text-xs">
                  {" "}
                  {/* Removed font-bold */}
                  <MapPin className="h-3 w-3 text-primary" />{" "}
                  {/* Changed color */}
                  {job.city || job.location || "—"}
                </Badge>
                <Badge variant="secondary" className="gap-1 text-xs">
                  {" "}
                  {/* Removed font-bold */}
                  <DollarSign className="h-3 w-3 text-primary" />{" "}
                  {/* Changed color */}
                  {formatSalary(job.salary)}
                </Badge>
                <Badge variant="secondary" className="gap-1 text-xs">
                  {" "}
                  {/* Removed font-bold */}
                  <Clock className="h-3 w-3 text-primary" />{" "}
                  {/* Changed color */}
                  Deadline:{" "}
                  {new Date(job.deadline).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Badge>
                {job.preTest && (
                  <Badge
                    variant="outline"
                    className="gap-1 text-xs border-primary text-primary"
                  >
                    {" "}
                    {/* Adjusted badge style */}
                    <ClipboardList className="h-3 w-3" />
                    Ada Pre-Selection Test
                  </Badge>
                )}
                {deadline <= 7 && (
                  <Badge variant="destructive" className="gap-1 text-xs">
                    {" "}
                    {/* Adjusted badge style */}
                    <AlertTriangle className="h-3 w-3" />
                    {deadline === 0
                      ? "Hari ini deadline!"
                      : `${deadline} hari lagi`}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-3 min-w-[190px]">
              <DropdownMenu>
                {" "}
                {/* Adjusted button style */}
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 w-full h-10 md:h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="lg"
                  >
                    <Share2 className="w-4 h-4" /> Bagikan
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {[
                    {
                      key: "linkedin",
                      label: "LinkedIn",
                      color: "#0A66C2",
                      Icon: Linkedin,
                    },
                    {
                      key: "twitter",
                      label: "Twitter / X",
                      color: "#1DA1F2",
                      Icon: Twitter,
                    },
                    {
                      key: "facebook",
                      label: "Facebook",
                      color: "#1877F2",
                      Icon: Facebook,
                    },
                    {
                      key: "whatsapp",
                      label: "WhatsApp",
                      color: "#25D366",
                      Icon: MessageCircle,
                    },
                  ].map(({ key, label, color, Icon }) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => handleShare(key)}
                      className="gap-2"
                    >
                      <Icon style={{ width: 15, height: 15, color }} /> {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {user?.role !== "ADMIN" && (
                <Button
                  onClick={handleOpenApply}
                  disabled={isApplying || isApplied}
                  className={cn(
                    // Adjusted button style
                    "w-full h-10 md:h-11",
                    isApplied
                      ? "bg-muted text-muted-foreground cursor-default hover:bg-muted"
                      : needsPreTest
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground" // Use primary for pre-test action
                        : "bg-primary hover:bg-primary/90 text-primary-foreground",
                  )}
                >
                  {isApplying && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {isApplied
                    ? "✓ Sudah Dilamar"
                    : needsPreTest
                      ? "Ikuti Pre-Selection Test"
                      : "Apply Sekarang →"}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* BODY */}
      <div className="container py-8">
        {" "}
        {/* Changed max-w-6xl mx-auto px-4 py-10 to container py-8 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            {job.preTest && !resolvedTestResultId && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200" // Adjusted colors and rounded
              >
                <ClipboardList className="h-5 w-5 flex-shrink-0 text-yellow-600 mt-0.5" />{" "}
                {/* Adjusted color */}
                <div>
                  <p className="mb-1 text-sm font-bold text-yellow-700">
                    {" "}
                    {/* Adjusted text style */}
                    Lowongan ini mensyaratkan Pre-Selection Test
                  </p>
                  <p className="text-xs text-orange-600 leading-relaxed">
                    Selesaikan tes 25 soal (30 menit) sebelum bisa melamar.
                  </p>
                </div>
              </motion.div>
            )}

            {job.preTest && resolvedTestResultId && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200" // Adjusted rounded
              >
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-500" />
                <p className="text-sm font-semibold text-emerald-700">
                  {" "}
                  {/* Adjusted text style */}
                  Pre-selection test sudah diselesaikan — Kamu siap untuk
                  melamar!
                </p>
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border bg-card p-6 card-shadow" // Standard card style
            >
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                {" "}
                {/* Standard heading style */}
                Deskripsi Pekerjaan
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {" "}
                {/* Standard text style */}
                {job.description}
              </p>
            </motion.div>

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-xl border border-border bg-card p-6 card-shadow" // Standard card style
              >
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  {" "}
                  {/* Standard heading style */}
                  Skills & Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map(
                    (
                      tag: string,
                      i: number, // Adjusted badge style
                    ) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs font-bold px-3 py-1.5"
                      >
                        {tag}
                      </Badge>
                    ),
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">
            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border bg-card p-6 card-shadow space-y-3 text-sm" // Standard card style
            >
              <h3 className="mb-2 font-semibold text-foreground">
                {" "}
                {/* Standard heading style */}
                Ringkasan Pekerjaan
              </h3>
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-muted-foreground">
                    {" "}
                    {/* Adjusted text style */}
                    Sisa pendaftaran
                  </span>
                  <span
                    className={cn(
                      "font-semibold", // Adjusted text style
                      deadline <= 3 ? "text-blue-500" : "text-blue-500",
                    )}
                  >
                    {deadline} hari
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div // Adjusted gradient colors
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (deadline / 30) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="divide-y divide-zinc-50">
                {[
                  {
                    Icon: MapPin,
                    label: "Lokasi",
                    value: job.city || job.location || "—",
                  },
                  { Icon: Briefcase, label: "Kategori", value: job.category },
                  {
                    Icon: DollarSign,
                    label: "Gaji",
                    value: formatSalary(job.salary),
                  },
                  {
                    Icon: Clock,
                    label: "Deadline",
                    value: new Date(job.deadline).toLocaleDateString("id-ID"), // Kept original date format
                  },
                ].map(({ Icon, label, value }) => (
                  <div
                    key={label} // Adjusted text styles
                    className="flex items-center gap-3 py-3 text-sm"
                  >
                    <Icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="flex-1 text-zinc-400 font-bold text-xs uppercase tracking-wide">
                      {label}
                    </span>
                    <span className="font-black text-zinc-900 text-xs">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Apply Card */}
            {user?.role !== "ADMIN" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-xl border border-border bg-card p-6 card-shadow text-center" // Standard card style
              >
                {isApplied ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50/20">
                      {" "}
                      {/* Adjusted background */}
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    </div>
                    <p className="text-sm font-semibold text-emerald-700">
                      {" "}
                      {/* Adjusted text style */}
                      Lamaran sudah dikirim!
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleOpenApply}
                      disabled={isApplying}
                      className={cn(
                        "w-full h-10 md:h-11", // Standard button style
                        needsPreTest
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground",
                      )}
                    >
                      {isApplying && (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      )}
                      {needsPreTest
                        ? "Ikuti Pre-Selection Test"
                        : "Apply Sekarang →"}
                    </Button>
                    <p className="text-[10px] text-zinc-400 font-bold">
                      {needsPreTest
                        ? "Selesaikan tes terlebih dahulu."
                        : "Proses cepat, kurang dari 2 menit"}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Share Card */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-card p-6 card-shadow" // Standard card style
            >
              <h3 className="mb-4 font-semibold text-foreground">
                {" "}
                {/* Standard heading style */}
                Bagikan Lowongan
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: "linkedin", Icon: Linkedin, color: "#0A66C2" },
                  { key: "twitter", Icon: Twitter, color: "#1DA1F2" },
                  { key: "facebook", Icon: Facebook, color: "#1877F2" },
                  { key: "whatsapp", Icon: MessageCircle, color: "#25D366" },
                ].map(({ key, Icon, color }) => (
                  <button
                    key={key}
                    onClick={() => handleShare(key)}
                    className="flex items-center justify-center rounded-lg border border-border p-3 transition-colors hover:bg-muted" // Adjusted styling
                  >
                    <Icon style={{ width: 16, height: 16, color }} />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-w-lg">
          {" "}
          {/* Removed custom rounded */}
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {" "}
              {/* Standard dialog title style */}
              Kirim Lamaran
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {" "}
              {/* Standard text style */}
              {job.title} · {job.company?.companyName}
            </p>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                Ekspektasi Gaji (IDR)
              </label>{" "}
              {/* Adjusted input style */}
              <Input
                type="number"
                min={0}
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="Contoh: 8.000.000"
                className="h-10 md:h-11"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                CV yang Digunakan
              </label>
              <Select value={cvOption} onValueChange={setCvOption}>
                <SelectTrigger className="h-10 md:h-11">
                  {" "}
                  {/* Adjusted select trigger style */}
                  <SelectValue placeholder="Pilih CV" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Gunakan CV Primary</SelectItem>
                  <SelectItem value="upload">Upload CV Baru</SelectItem>
                  {isCvsLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading…
                    </SelectItem>
                  ) : (
                    (cvs || []).map((cv) => (
                      <SelectItem key={cv.id} value={String(cv.id)}>
                        {cv.cvName}
                        {cv.isPrimary ? " (Primary)" : ""}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {cvOption === "upload" && (
              <div className="space-y-4 rounded-xl border border-border bg-card p-4 card-shadow">
                {" "}
                {/* Standard card style */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                    Nama CV
                  </label>
                  <Input
                    value={cvName}
                    onChange={(e) => setCvName(e.target.value)}
                    placeholder="Contoh: CV - Backend Engineer"
                    className="h-10 md:h-11"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                    {" "}
                    {/* Adjusted input style */}
                    File CV (PDF)
                  </label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                    className="h-10 md:h-11"
                  />
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline" // Changed to outline
                className="flex-1" // Removed custom styling
                onClick={() => setApplyOpen(false)}
                disabled={isApplying}
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmitApply}
                disabled={isApplying || isApplied}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" // Standard button style
              >
                {isApplying && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                Kirim Lamaran
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pre-Test Confirm Dialog */}
      <Dialog open={preTestConfirmOpen} onOpenChange={setPreTestConfirmOpen}>
        <DialogContent className="max-w-md">
          {" "}
          {/* Removed custom rounded */}
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {" "}
              {/* Standard dialog title style */}
              Pre-Selection Test
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-yellow-50 border border-yellow-200">
                {" "}
                {/* Adjusted styling */}
                <Timer className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            <div className="divide-y divide-border rounded-xl border border-border bg-card p-4 card-shadow">
              {" "}
              {/* Standard card style */}
              {[
                { label: "Jumlah soal", value: "25 pilihan ganda" },
                { label: "Durasi", value: "30 menit" },
                {
                  label: "Timer",
                  value: "Tetap berjalan walau browser ditutup",
                },
                { label: "Pengerjaan", value: "Hanya bisa 1 kali" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3 text-sm" // Adjusted padding
                >
                  <span className="font-medium text-muted-foreground">
                    {label}
                  </span>{" "}
                  {/* Adjusted text style */}
                  <span className="font-semibold text-foreground">
                    {value}
                  </span>{" "}
                  {/* Adjusted text style */}
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground leading-relaxed">
              {" "}
              {/* Standard text style */}
              Pastikan koneksi internet stabil dan kamu punya cukup waktu
              sebelum memulai.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 rounded-2xl font-black uppercase text-[10px]"
                onClick={() => setPreTestConfirmOpen(false)} // Removed custom styling
              >
                Belum Siap
              </Button>
              <Button
                onClick={() => {
                  setPreTestConfirmOpen(false);
                  navigate(`/jobs/${job?.id}/take-test`);
                }}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" // Standard button style
              >
                Mulai Tes →
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default JobDetail;
