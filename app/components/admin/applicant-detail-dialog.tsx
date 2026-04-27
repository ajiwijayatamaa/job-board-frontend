import {
  ExternalLink,
  GraduationCap,
  MapPin,
  User2,
  Wallet2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import useGetApplicantById from "~/hooks/api/useGetApplicantById";
import { cn } from "~/lib/utils";

export default function ApplicantDetailDialog({
  applicationId,
  jobId,
  open,
  onClose,
}: {
  applicationId: number;
  jobId: number;
  open: boolean;
  onClose: () => void;
}) {
  const { data: applicant, isLoading } = useGetApplicantById(applicationId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-[2.5rem] border-none shadow-2xl p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="font-black uppercase tracking-tighter italic text-[#0F2342] text-xl">
            Kandidat <span className="text-[#1D5FAD]">Profile</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="py-12 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-[#1D5FAD]/20 border-t-[#1D5FAD] rounded-full animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Memuat Data...
            </p>
          </div>
        )}

        {applicant && (
          <div className="space-y-6">
            {/* --- Header Profile --- */}
            <div className="flex items-center gap-5 p-4 rounded-3xl bg-[#F4F8FF] border border-[#1D5FAD]/5">
              <Avatar className="w-16 h-16 rounded-2xl border-2 border-white shadow-sm">
                <AvatarImage
                  src={applicant.user.profilePhoto ?? undefined}
                  className="object-cover"
                />
                <AvatarFallback className="bg-[#1D5FAD] text-white font-black text-xl">
                  {applicant.user.fullName?.[0] ??
                    applicant.user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="font-black text-[#0F2342] text-lg leading-tight truncate">
                  {applicant.user.fullName ?? "—"}
                </h3>
                <p className="text-xs font-medium text-slate-500 truncate">
                  {applicant.user.email}
                </p>
              </div>
            </div>

            {/* --- Grid Info --- */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Pendidikan",
                  value: applicant.user.education,
                  icon: GraduationCap,
                },
                { label: "Gender", value: applicant.user.gender, icon: User2 },
                { label: "Domisili", value: applicant.user.city, icon: MapPin },
                {
                  label: "Ekspektasi Gaji",
                  value: applicant.expectedSalary
                    ? `Rp ${Number(applicant.expectedSalary).toLocaleString("id-ID")}`
                    : "—",
                  icon: Wallet2,
                },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5 px-1">
                  <div className="flex items-center gap-1.5">
                    <item.icon className="w-3 h-3 text-[#1D5FAD]" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {item.label}
                    </p>
                  </div>
                  <p className="font-bold text-[#0F2342] text-sm truncate pl-4.5">
                    {item.value ?? "—"}
                  </p>
                </div>
              ))}
            </div>

            {/* --- Stats/Test Result --- */}
            {applicant.testResult && (
              <div className="relative overflow-hidden p-5 bg-[#0F2342] rounded-[2rem] text-white shadow-lg shadow-blue-900/20">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <div className="w-16 h-16 rounded-full border-8 border-white" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300 mb-2">
                  Pre-Selection Test Score
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black italic">
                    {Number(applicant.testResult.score).toFixed(0)}
                  </span>
                  <span className="text-blue-300/60 font-bold text-sm">
                    / 100
                  </span>
                </div>
              </div>
            )}

            {/* --- Rejection Reason --- */}
            {applicant.rejectionReason && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-1.5 flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-rose-500 rounded-full" />
                  Alasan Penolakan
                </p>
                <p className="text-sm text-rose-700 font-bold leading-relaxed">
                  "{applicant.rejectionReason}"
                </p>
              </div>
            )}

            {/* --- Action --- */}
            <Button
              className="w-full h-14 bg-[#1D5FAD] hover:bg-[#164d8f] text-white rounded-[1.2rem] font-black uppercase text-[11px] tracking-[0.15em] shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]"
              onClick={() =>
                window.open(
                  `${import.meta.env.VITE_BASE_URL_API}/cvs/${applicant.cv.id}/file`,
                  "_blank",
                )
              }
            >
              <ExternalLink className="w-4 h-4 mr-3 text-blue-200" />
              Tinjau Dokumen CV
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
