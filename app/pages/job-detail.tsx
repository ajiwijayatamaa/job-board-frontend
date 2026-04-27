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
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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

  // ─── Loading / Error ─────────────────────────────────────
  if (isLoading) {
    return (
      <div
        style={{
          background: "#F0EDE8",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader2
            className="animate-spin"
            style={{ width: 32, height: 32, color: "#4A6FA5" }}
          />
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div
        style={{
          background: "#F0EDE8",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 24,
          }}
        >
          <div>
            <p style={{ fontSize: 48, fontWeight: 700, color: "#2C3E50" }}>
              404
            </p>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "#2C3E50",
                marginBottom: 20,
              }}
            >
              Lowongan tidak ditemukan
            </h1>
            <Link to="/jobs">
              <Button variant="outline">← Kembali ke semua lowongan</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const deadline = daysUntilDeadline(job.deadline);

  // ─── Render ──────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

        /*
         * Palette (mid-tone warm):
         *  Page bg   : #F0EDE8  warm sand — not white, not dark
         *  Surface   : #FAFAF8  near-white card surface
         *  Surface2  : #EAE6DF  muted pebble for sidebar
         *  Border    : #D8D3CB
         *  Text      : #2C3E50  deep slate
         *  Muted     : #7A7469
         *  Accent    : #4A6FA5  dusty blue
         *  CTA       : #E8835A  terracotta
        */

        .jd-page { font-family: 'Plus Jakarta Sans', sans-serif; background: #F0EDE8; min-height: 100vh; color: #2C3E50; }

        .jd-hero {
          background: #FAFAF8;
          border-bottom: 1px solid #D8D3CB;
          padding: 36px 0 40px;
          position: relative;
          overflow: hidden;
        }
        .jd-hero::before {
          content: '';
          position: absolute; top: -80px; right: -60px;
          width: 340px; height: 340px; border-radius: 50%;
          background: radial-gradient(circle, rgba(74,111,165,0.09) 0%, transparent 70%);
          pointer-events: none;
        }
        .jd-hero::after {
          content: '';
          position: absolute; bottom: -60px; left: 25%;
          width: 260px; height: 260px; border-radius: 50%;
          background: radial-gradient(circle, rgba(232,131,90,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .jd-back { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #7A7469; text-decoration: none; margin-bottom: 28px; transition: color 0.2s; }
        .jd-back:hover { color: #4A6FA5; }

        .jd-category-badge { display: inline-block; background: rgba(74,111,165,0.1); border: 1px solid rgba(74,111,165,0.22); color: #4A6FA5; font-size: 11px; font-weight: 700; letter-spacing: 0.13em; text-transform: uppercase; border-radius: 6px; padding: 4px 10px; margin-bottom: 14px; }

        .jd-company-pill { display: inline-flex; align-items: center; gap: 8px; background: #EAE6DF; border: 1px solid #D8D3CB; border-radius: 999px; padding: 6px 14px 6px 8px; font-size: 13px; font-weight: 500; color: #5A5450; text-decoration: none; margin-bottom: 16px; transition: background 0.2s; }
        .jd-company-pill:hover { background: #DDD8D0; }
        .jd-company-logo { width: 28px; height: 28px; border-radius: 8px; border: 1px solid #D8D3CB; background: #F0EDE8; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }

        .jd-title { font-family: 'Lora', serif; font-size: clamp(26px, 4vw, 42px); font-weight: 600; line-height: 1.2; color: #1A2530; margin-bottom: 20px; }

        .jd-chip { display: inline-flex; align-items: center; gap: 5px; background: #EAE6DF; border: 1px solid #D0CBC3; border-radius: 8px; padding: 5px 11px; font-size: 12px; font-weight: 500; color: #5A5450; }

        .jd-btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #E8835A; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; border: none; border-radius: 12px; padding: 13px 24px; cursor: pointer; transition: background 0.2s, transform 0.15s, box-shadow 0.2s; box-shadow: 0 2px 10px rgba(232,131,90,0.22); width: 100%; }
        .jd-btn-primary:hover:not(:disabled) { background: #D4714A; transform: translateY(-1px); box-shadow: 0 4px 18px rgba(232,131,90,0.28); }
        .jd-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
        .jd-btn-pretest { background: #4A6FA5 !important; box-shadow: 0 2px 10px rgba(74,111,165,0.22) !important; }
        .jd-btn-pretest:hover:not(:disabled) { background: #3A5A8A !important; box-shadow: 0 4px 18px rgba(74,111,165,0.28) !important; }
        .jd-btn-applied { background: #EAE6DF !important; color: #7A7469 !important; box-shadow: none !important; cursor: default !important; }
        .jd-btn-applied:hover { transform: none !important; }

        .jd-btn-outline { display: inline-flex; align-items: center; justify-content: center; gap: 6px; background: transparent; border: 1.5px solid #D8D3CB; color: #5A5450; font-size: 13px; font-weight: 500; border-radius: 10px; padding: 10px 18px; cursor: pointer; transition: background 0.15s, border-color 0.15s; }
        .jd-btn-outline:hover { background: #EAE6DF; border-color: #C5BFB7; }

        .jd-card { background: #FAFAF8; border: 1px solid #D8D3CB; border-radius: 16px; padding: 24px; }
        .jd-sidebar-card { background: #EAE6DF; border: 1px solid #D0CBC3; border-radius: 16px; padding: 20px; }

        .jd-section-label { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #7A7469; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .jd-section-label::after { content: ''; flex: 1; height: 1px; background: #D8D3CB; }

        .jd-stat { display: flex; align-items: center; gap: 10px; padding: 11px 0; border-bottom: 1px solid #DDD8D0; font-size: 13px; }
        .jd-stat:last-child { border-bottom: none; }
        .jd-stat-label { flex: 1; color: #7A7469; }
        .jd-stat-value { font-weight: 600; color: #2C3E50; }

        .jd-deadline-track { height: 4px; background: #D8D3CB; border-radius: 999px; overflow: hidden; margin-top: 6px; }
        .jd-deadline-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #4A6FA5, #E8835A); transition: width 0.6s ease; }

        .jd-tag { display: inline-flex; align-items: center; padding: 5px 12px; border-radius: 6px; background: #EAE6DF; border: 1px solid #D0CBC3; font-size: 12px; font-weight: 500; color: #5A5450; }

        .jd-notice-blue { display: flex; gap: 12px; padding: 16px; border-radius: 12px; background: rgba(74,111,165,0.07); border: 1px solid rgba(74,111,165,0.18); }
        .jd-notice-green { display: flex; gap: 12px; padding: 14px 16px; border-radius: 12px; background: rgba(34,197,94,0.07); border: 1px solid rgba(34,197,94,0.18); }
        .jd-notice-red { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.18); font-size: 12px; font-weight: 500; color: #DC4444; }

        .jd-social-btn { display: flex; align-items: center; justify-content: center; padding: 12px; border-radius: 10px; border: 1.5px solid #D8D3CB; background: #FAFAF8; cursor: pointer; transition: background 0.15s, border-color 0.15s; }
        .jd-social-btn:hover { background: #EAE6DF; border-color: #C5BFB7; }

        [data-radix-dialog-content] { background: #FAFAF8 !important; border: 1px solid #D8D3CB !important; color: #2C3E50 !important; }
        .jd-dialog-label { display: block; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #7A7469; margin-bottom: 8px; }
        .jd-dialog-input { background: #F0EDE8 !important; border: 1.5px solid #D8D3CB !important; border-radius: 10px !important; color: #2C3E50 !important; }
        .jd-dialog-input:focus { border-color: #4A6FA5 !important; box-shadow: 0 0 0 3px rgba(74,111,165,0.1) !important; }

        .jd-test-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #E5E0D8; font-size: 13px; }
        .jd-test-row:last-child { border-bottom: none; }

        .jd-fade { animation: jdFadeUp 0.4s ease both; }
        .jd-d1 { animation-delay: 0.05s; }
        .jd-d2 { animation-delay: 0.12s; }
        .jd-d3 { animation-delay: 0.2s; }
        @keyframes jdFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
      `}</style>

      <div className="jd-page">
        <Navbar />

        {/* ── HERO ── */}
        <div className="jd-hero">
          <div className="container mx-auto max-w-6xl px-4">
            <Link to="/jobs" className="jd-back">
              <ArrowLeft style={{ width: 13, height: 13 }} /> Semua Lowongan
            </Link>

            <div
              className="jd-fade"
              style={{
                display: "grid",
                gap: 24,
                gridTemplateColumns: "1fr auto",
                alignItems: "flex-end",
              }}
            >
              {/* Left */}
              <div>
                <div className="jd-category-badge">{job.category}</div>

                <Link
                  to={`/companies/${job.companyId}`}
                  className="jd-company-pill"
                >
                  <div className="jd-company-logo">
                    {job.banner || job.company?.logo ? (
                      <img
                        src={job.banner || job.company?.logo}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Building2
                        style={{ width: 13, height: 13, color: "#7A7469" }}
                      />
                    )}
                  </div>
                  {job.company?.companyName || job.company}
                </Link>

                <h1 className="jd-title">{job.title}</h1>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span className="jd-chip">
                    <MapPin
                      style={{ width: 13, height: 13, color: "#4A6FA5" }}
                    />
                    {job.city || job.location || "—"}
                  </span>
                  <span className="jd-chip">
                    <DollarSign
                      style={{ width: 13, height: 13, color: "#4A6FA5" }}
                    />
                    {formatSalary(job.salary)}
                  </span>
                  <span className="jd-chip">
                    <Clock
                      style={{ width: 13, height: 13, color: "#4A6FA5" }}
                    />
                    Deadline:{" "}
                    {new Date(job.deadline).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {job.preTest && (
                    <span
                      className="jd-chip"
                      style={{
                        background: "rgba(74,111,165,0.08)",
                        border: "1px solid rgba(74,111,165,0.2)",
                        color: "#4A6FA5",
                      }}
                    >
                      <ClipboardList style={{ width: 13, height: 13 }} />
                      Ada Pre-Selection Test
                    </span>
                  )}
                </div>
              </div>

              {/* Right */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 10,
                  minWidth: 190,
                }}
              >
                {deadline <= 7 && (
                  <span className="jd-notice-red">
                    <AlertTriangle style={{ width: 13, height: 13 }} />
                    {deadline === 0
                      ? "Hari ini deadline!"
                      : `${deadline} hari lagi`}
                  </span>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="jd-btn-outline">
                      <Share2 style={{ width: 14, height: 14 }} />
                      Bagikan
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    style={{
                      background: "#FAFAF8",
                      border: "1px solid #D8D3CB",
                    }}
                  >
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
                        style={{ color: "#2C3E50", gap: 8 }}
                      >
                        <Icon style={{ width: 15, height: 15, color }} />
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {user?.role !== "ADMIN" && (
                  <button
                    className={`jd-btn-primary ${isApplied ? "jd-btn-applied" : needsPreTest ? "jd-btn-pretest" : ""}`}
                    onClick={handleOpenApply}
                    disabled={isApplying || isApplied}
                    style={{ minWidth: 190 }}
                  >
                    {isApplying && (
                      <Loader2
                        style={{ width: 15, height: 15 }}
                        className="animate-spin"
                      />
                    )}
                    {isApplied
                      ? "✓ Sudah Dilamar"
                      : needsPreTest
                        ? "Ikuti Pre-Selection Test"
                        : "Apply Sekarang →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <div
            style={{
              display: "grid",
              gap: 28,
              gridTemplateColumns: "1fr 320px",
            }}
          >
            {/* LEFT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {job.preTest && !resolvedTestResultId && (
                <div className="jd-notice-blue jd-fade jd-d1">
                  <ClipboardList
                    style={{
                      width: 18,
                      height: 18,
                      color: "#4A6FA5",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#3A5A8A",
                        marginBottom: 4,
                      }}
                    >
                      Lowongan ini mensyaratkan Pre-Selection Test
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#5A6E8A",
                        lineHeight: 1.65,
                      }}
                    >
                      Selesaikan tes 25 soal (30 menit) sebelum bisa melamar.
                      Klik tombol "Ikuti Pre-Selection Test" untuk memulai.
                    </p>
                  </div>
                </div>
              )}
              {job.preTest && resolvedTestResultId && (
                <div className="jd-notice-green jd-fade jd-d1">
                  <CheckCircle2
                    style={{
                      width: 18,
                      height: 18,
                      color: "#22c55e",
                      flexShrink: 0,
                    }}
                  />
                  <p
                    style={{ fontSize: 13, color: "#166534", fontWeight: 500 }}
                  >
                    Pre-selection test sudah diselesaikan — kamu siap untuk
                    melamar!
                  </p>
                </div>
              )}

              <div className="jd-card jd-fade jd-d2">
                <div className="jd-section-label">Deskripsi Pekerjaan</div>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.9,
                    color: "#4A4540",
                    whiteSpace: "pre-line",
                  }}
                >
                  {job.description}
                </p>
              </div>

              {job.tags && job.tags.length > 0 && (
                <div className="jd-card jd-fade jd-d3">
                  <div className="jd-section-label">Skills & Tags</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {job.tags.map((tag: string, i: number) => (
                      <span key={i} className="jd-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="jd-sidebar-card jd-fade jd-d1">
                <div className="jd-section-label">Ringkasan Pekerjaan</div>
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ color: "#7A7469" }}>Sisa pendaftaran</span>
                    <span
                      style={{
                        fontWeight: 600,
                        color: deadline <= 3 ? "#DC4444" : "#4A6FA5",
                      }}
                    >
                      {deadline} hari
                    </span>
                  </div>
                  <div className="jd-deadline-track">
                    <div
                      className="jd-deadline-fill"
                      style={{
                        width: `${Math.min(100, (deadline / 30) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div style={{ borderTop: "1px solid #D0CBC3", paddingTop: 4 }}>
                  {[
                    {
                      Icon: MapPin,
                      label: "Lokasi",
                      value: job.city || job.location || "—",
                    },
                    {
                      Icon: Briefcase,
                      label: "Tipe",
                      value: job.type || job.category,
                    },
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
                    { Icon: Building2, label: "Kategori", value: job.category },
                  ].map(({ Icon, label, value }) => (
                    <div key={label} className="jd-stat">
                      <Icon
                        style={{
                          width: 14,
                          height: 14,
                          color: "#4A6FA5",
                          flexShrink: 0,
                        }}
                      />
                      <span className="jd-stat-label">{label}</span>
                      <span className="jd-stat-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {user?.role !== "ADMIN" && (
                <div
                  className="jd-card jd-fade jd-d2"
                  style={{ textAlign: "center", padding: 20 }}
                >
                  {isApplied ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: "rgba(34,197,94,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckCircle2
                          style={{ width: 22, height: 22, color: "#22c55e" }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#7A7469",
                        }}
                      >
                        Lamaran sudah dikirim
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      <button
                        className={`jd-btn-primary ${needsPreTest ? "jd-btn-pretest" : ""}`}
                        onClick={handleOpenApply}
                        disabled={isApplying}
                      >
                        {isApplying && (
                          <Loader2
                            style={{ width: 15, height: 15 }}
                            className="animate-spin"
                          />
                        )}
                        {needsPreTest
                          ? "Ikuti Pre-Selection Test"
                          : "Apply Sekarang →"}
                      </button>
                      <p style={{ fontSize: 11, color: "#7A7469" }}>
                        {needsPreTest
                          ? "Selesaikan tes terlebih dahulu"
                          : "Proses cepat, kurang dari 2 menit"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="jd-sidebar-card jd-fade jd-d3">
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#7A7469",
                    marginBottom: 12,
                  }}
                >
                  Bagikan Lowongan
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    gap: 8,
                  }}
                >
                  {[
                    { key: "linkedin", Icon: Linkedin, color: "#0A66C2" },
                    { key: "twitter", Icon: Twitter, color: "#1DA1F2" },
                    { key: "facebook", Icon: Facebook, color: "#1877F2" },
                    { key: "whatsapp", Icon: MessageCircle, color: "#25D366" },
                  ].map(({ key, Icon, color }) => (
                    <button
                      key={key}
                      onClick={() => handleShare(key)}
                      className="jd-social-btn"
                    >
                      <Icon style={{ width: 16, height: 16, color }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Apply Dialog ── */}
        <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
          <DialogContent className="max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontWeight: 700,
                  color: "#1A2530",
                }}
              >
                Kirim Lamaran
              </DialogTitle>
              <p style={{ fontSize: 12, color: "#7A7469", marginTop: 2 }}>
                {job.title} · {job.company?.companyName}
              </p>
            </DialogHeader>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                paddingTop: 8,
              }}
            >
              <div>
                <label className="jd-dialog-label">Ekspektasi Gaji (IDR)</label>
                <Input
                  type="number"
                  min={0}
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(e.target.value)}
                  placeholder="Contoh: 8.000.000"
                  className="jd-dialog-input"
                />
              </div>
              <div>
                <label className="jd-dialog-label">CV yang Digunakan</label>
                <Select value={cvOption} onValueChange={setCvOption}>
                  <SelectTrigger className="jd-dialog-input">
                    <SelectValue placeholder="Pilih CV" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      background: "#FAFAF8",
                      border: "1px solid #D8D3CB",
                    }}
                  >
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
                <div
                  style={{
                    background: "#F0EDE8",
                    border: "1px solid #D8D3CB",
                    borderRadius: 12,
                    padding: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <div>
                    <label className="jd-dialog-label">Nama CV</label>
                    <Input
                      value={cvName}
                      onChange={(e) => setCvName(e.target.value)}
                      placeholder="e.g. CV - Backend Engineer"
                      className="jd-dialog-input"
                    />
                  </div>
                  <div>
                    <label className="jd-dialog-label">File CV (PDF)</label>
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                      className="jd-dialog-input"
                    />
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
                <button
                  className="jd-btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => setApplyOpen(false)}
                  disabled={isApplying}
                >
                  Batal
                </button>
                <button
                  className="jd-btn-primary"
                  style={{ flex: 1, borderRadius: 12 }}
                  onClick={handleSubmitApply}
                  disabled={isApplying || isApplied}
                >
                  {isApplying && (
                    <Loader2
                      style={{ width: 15, height: 15 }}
                      className="animate-spin"
                    />
                  )}
                  Kirim Lamaran
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Pre-Test Confirm Dialog ── */}
        <Dialog open={preTestConfirmOpen} onOpenChange={setPreTestConfirmOpen}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle
                style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontWeight: 700,
                  color: "#1A2530",
                }}
              >
                Pre-Selection Test
              </DialogTitle>
            </DialogHeader>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                paddingTop: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: "rgba(74,111,165,0.1)",
                    border: "1px solid rgba(74,111,165,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Timer style={{ width: 28, height: 28, color: "#4A6FA5" }} />
                </div>
              </div>
              <div
                style={{
                  background: "#F0EDE8",
                  border: "1px solid #D8D3CB",
                  borderRadius: 12,
                  padding: "4px 16px",
                }}
              >
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
                  <div key={label} className="jd-test-row">
                    <span style={{ color: "#7A7469" }}>{label}</span>
                    <span style={{ fontWeight: 600, color: "#2C3E50" }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <p
                style={{
                  textAlign: "center",
                  fontSize: 12,
                  color: "#7A7469",
                  lineHeight: 1.7,
                }}
              >
                Pastikan koneksi internet stabil dan kamu punya cukup waktu
                sebelum memulai.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="jd-btn-outline"
                  style={{ flex: 1 }}
                  onClick={() => setPreTestConfirmOpen(false)}
                >
                  Belum Siap
                </button>
                <button
                  className="jd-btn-primary jd-btn-pretest"
                  style={{ flex: 1, borderRadius: 12 }}
                  onClick={() => {
                    setPreTestConfirmOpen(false);
                    navigate(`/jobs/${job?.id}/take-test`);
                  }}
                >
                  Mulai Tes →
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </>
  );
};

export default JobDetail;
