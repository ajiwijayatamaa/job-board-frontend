import { ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import useGetApplicantById from "~/hooks/api/useGetApplicantById";

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
      <DialogContent className="max-w-md rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="font-black uppercase italic text-zinc-900">
            Detail Pelamar
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="py-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {applicant && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14">
                <AvatarImage src={applicant.user.profilePhoto ?? undefined} />
                <AvatarFallback className="bg-orange-100 text-orange-600 font-black">
                  {applicant.user.fullName?.[0] ??
                    applicant.user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-black text-zinc-900">
                  {applicant.user.fullName ?? "—"}
                </h3>
                <p className="text-xs text-zinc-400">{applicant.user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Pendidikan", value: applicant.user.education ?? "—" },
                { label: "Gender", value: applicant.user.gender ?? "—" },
                { label: "Kota", value: applicant.user.city ?? "—" },
                {
                  label: "Ekspektasi Gaji",
                  value: applicant.expectedSalary
                    ? `Rp ${Number(applicant.expectedSalary).toLocaleString("id-ID")}`
                    : "—",
                },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] font-black uppercase text-zinc-400">
                    {label}
                  </p>
                  <p className="font-bold text-zinc-900">{value}</p>
                </div>
              ))}
            </div>

            {applicant.testResult && (
              <div className="p-3 bg-orange-50 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">
                  Skor Pre-Test
                </p>
                <p className="text-2xl font-black text-orange-500">
                  {Number(applicant.testResult.score).toFixed(0)}
                  <span className="text-sm text-zinc-400 font-bold">
                    {" "}
                    / 100
                  </span>
                </p>
              </div>
            )}

            {applicant.rejectionReason && (
              <div className="p-3 bg-red-50 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-red-400 mb-1">
                  Alasan Penolakan
                </p>
                <p className="text-sm text-red-600 font-medium">
                  {applicant.rejectionReason}
                </p>
              </div>
            )}

            <Button
              className="w-full bg-zinc-900 hover:bg-black text-white rounded-2xl font-black uppercase text-xs tracking-widest"
              onClick={() =>
                window.open(
                  `${import.meta.env.VITE_BASE_URL_API}/cvs/${applicant.cv.id}/file`,
                  "_blank",
                )
              }
            >
              <ExternalLink className="w-4 h-4 mr-2 text-orange-500" />
              Lihat CV
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
