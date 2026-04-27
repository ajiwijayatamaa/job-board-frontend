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
      <div className="min-h-screen bg-zinc-50/50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-zinc-200 border-t-orange-500 rounded-full animate-spin" />
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

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Navbar />

      {/* HERO */}
      <div className="bg-white border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <Button
            variant="ghost"
            asChild
            className="mb-6 -ml-2 text-zinc-500 hover:text-zinc-900 font-bold uppercase text-[10px] tracking-widest"
          >
            <Link to="/jobs">
              <ArrowLeft className="mr-2 h-3 w-3" /> Semua Lowongan
            </Link>
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  {job.category}
                </span>
              </div>

              <Link
                to={`/companies/${job.companyId}`}
                className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-white border border-zinc-200 flex items-center justify-center overflow-hidden">
                  {job.banner ? (
                    <img
                      src={job.banner}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-3 h-3 text-zinc-400" />
                  )}
                </div>
                <span className="text-xs font-bold text-zinc-600">
                  {job.company?.companyName || job.company}
                </span>
              </Link>

              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-900 uppercase italic mb-4">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1 font-bold text-xs">
                  <MapPin className="w-3 h-3 text-orange-500" />
                  {job.city || job.location || "—"}
                </Badge>
                <Badge variant="secondary" className="gap-1 font-bold text-xs">
                  <DollarSign className="w-3 h-3 text-orange-500" />
                  {formatSalary(job.salary)}
                </Badge>
                <Badge variant="secondary" className="gap-1 font-bold text-xs">
                  <Clock className="w-3 h-3 text-orange-500" />
                  Deadline:{" "}
                  {new Date(job.deadline).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Badge>
                {job.preTest && (
                  <Badge className="gap-1 font-bold text-xs bg-orange-50 text-orange-600 border border-orange-200">
                    <ClipboardList className="w-3 h-3" />
                    Ada Pre-Selection Test
                  </Badge>
                )}
                {deadline <= 7 && (
                  <Badge className="gap-1 font-bold text-xs bg-red-50 text-red-500 border border-red-200">
                    <AlertTriangle className="w-3 h-3" />
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
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2"
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
                    "w-full rounded-2xl h-12 font-black uppercase text-xs tracking-[0.2em] shadow-xl",
                    isApplied
                      ? "bg-zinc-100 text-zinc-400 shadow-none cursor-default hover:bg-zinc-100"
                      : needsPreTest
                        ? "bg-orange-500 hover:bg-orange-600 shadow-orange-200 text-white"
                        : "bg-zinc-900 hover:bg-black text-white shadow-zinc-200",
                  )}
                >
                  {isApplying && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            {job.preTest && !resolvedTestResultId && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="flex gap-3 p-4 rounded-2xl bg-orange-50 border border-orange-200"
              >
                <ClipboardList className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-black text-orange-700 mb-1">
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
                className="flex gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <p className="text-sm font-bold text-emerald-700">
                  Pre-selection test sudah diselesaikan — kamu siap untuk
                  melamar!
                </p>
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2rem] shadow-sm border-none p-8"
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
                Deskripsi Pekerjaan
              </h2>
              <p className="text-sm leading-relaxed text-zinc-600 whitespace-pre-line">
                {job.description}
              </p>
            </motion.div>

            {/* Tags */}
            {job.tags && job.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-[2rem] shadow-sm p-8"
              >
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
                  Skills & Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag: string, i: number) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-xs font-bold px-3 py-1.5"
                    >
                      {tag}
                    </Badge>
                  ))}
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
              className="bg-white rounded-[2rem] shadow-sm p-6"
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
                Ringkasan Pekerjaan
              </h2>
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400 font-bold">
                    Sisa pendaftaran
                  </span>
                  <span
                    className={cn(
                      "font-black",
                      deadline <= 3 ? "text-red-500" : "text-orange-500",
                    )}
                  >
                    {deadline} hari
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all"
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
                    value: new Date(job.deadline).toLocaleDateString("id-ID"),
                  },
                ].map(({ Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 py-3 text-sm"
                  >
                    <Icon className="w-4 h-4 text-orange-500 flex-shrink-0" />
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
                className="bg-white rounded-[2rem] shadow-sm p-6 text-center"
              >
                {isApplied ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">
                      Lamaran sudah dikirim
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleOpenApply}
                      disabled={isApplying}
                      className={cn(
                        "w-full rounded-2xl h-12 font-black uppercase text-xs tracking-[0.2em] shadow-xl",
                        needsPreTest
                          ? "bg-orange-500 hover:bg-orange-600 shadow-orange-200 text-white"
                          : "bg-zinc-900 hover:bg-black text-white shadow-zinc-200",
                      )}
                    >
                      {isApplying && (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      )}
                      {needsPreTest
                        ? "Ikuti Pre-Selection Test"
                        : "Apply Sekarang →"}
                    </Button>
                    <p className="text-[10px] text-zinc-400 font-bold">
                      {needsPreTest
                        ? "Selesaikan tes terlebih dahulu"
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
              className="bg-white rounded-[2rem] shadow-sm p-6"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
                Bagikan Lowongan
              </p>
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
                    className="flex items-center justify-center p-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors"
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
        <DialogContent className="max-w-lg rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="font-black uppercase italic text-zinc-900">
              Kirim Lamaran
            </DialogTitle>
            <p className="text-xs text-zinc-400 font-bold">
              {job.title} · {job.company?.companyName}
            </p>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                Ekspektasi Gaji (IDR)
              </label>
              <Input
                type="number"
                min={0}
                value={expectedSalary}
                onChange={(e) => setExpectedSalary(e.target.value)}
                placeholder="Contoh: 8.000.000"
                className="h-11 rounded-xl border-zinc-200 focus-visible:border-orange-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                CV yang Digunakan
              </label>
              <Select value={cvOption} onValueChange={setCvOption}>
                <SelectTrigger className="h-11 rounded-xl border-zinc-200">
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
              <div className="bg-zinc-50 rounded-2xl p-4 space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                    Nama CV
                  </label>
                  <Input
                    value={cvName}
                    onChange={(e) => setCvName(e.target.value)}
                    placeholder="e.g. CV - Backend Engineer"
                    className="h-11 rounded-xl border-zinc-200 focus-visible:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">
                    File CV (PDF)
                  </label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                    className="h-11 rounded-xl border-zinc-200"
                  />
                </div>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1 rounded-2xl font-black uppercase text-[10px]"
                onClick={() => setApplyOpen(false)}
                disabled={isApplying}
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmitApply}
                disabled={isApplying || isApplied}
                className="flex-1 bg-zinc-900 hover:bg-black text-white rounded-2xl font-black uppercase text-[10px] shadow-xl shadow-zinc-200"
              >
                {isApplying && (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                )}
                Kirim Lamaran
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pre-Test Confirm Dialog */}
      <Dialog open={preTestConfirmOpen} onOpenChange={setPreTestConfirmOpen}>
        <DialogContent className="max-w-md rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="font-black uppercase italic text-zinc-900">
              Pre-Selection Test
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                <Timer className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-zinc-50 rounded-2xl divide-y divide-zinc-100">
              {[
                { label: "Jumlah soal", value: "25 pilihan ganda" },
                { label: "Durasi", value: "30 menit" },
                {
                  label: "Timer",
                  value: "Tetap berjalan walau browser ditutup",
                },
                { label: "Pengerjaan", value: "Hanya bisa 1 kali" },
                { label: "Nilai minimum lulus", value: "75 / 100" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center px-4 py-3 text-sm"
                >
                  <span className="text-zinc-400 font-bold">{label}</span>
                  <span className="font-black text-zinc-900">{value}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-zinc-400 font-medium leading-relaxed">
              Pastikan koneksi internet stabil dan kamu punya cukup waktu
              sebelum memulai.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1 rounded-2xl font-black uppercase text-[10px]"
                onClick={() => setPreTestConfirmOpen(false)}
              >
                Belum Siap
              </Button>
              <Button
                onClick={() => {
                  setPreTestConfirmOpen(false);
                  navigate(`/jobs/${job?.id}/take-test`);
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl shadow-orange-200"
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
