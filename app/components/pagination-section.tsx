import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import type { PaginationMeta } from "~/types/pagination";
import { cn } from "~/lib/utils";

interface PaginationSectionProps {
  meta: PaginationMeta;
  onChangePage: (page: number) => void;
}

const PaginationSection = (props: PaginationSectionProps) => {
  // Hitung total halaman
  const totalPages = Math.ceil(props.meta.total / props.meta.take) || 1;

  // LOGIKA BARU: Menghitung rentang data yang sedang ditampilkan
  // 'from' adalah urutan data pertama di halaman aktif
  const from =
    props.meta.total === 0 ? 0 : (props.meta.page - 1) * props.meta.take + 1;

  // 'to' adalah urutan data terakhir di halaman aktif (tidak boleh melebihi total data)
  const to = Math.min(props.meta.page * props.meta.take, props.meta.total);

  const handlePrev = () => {
    if (props.meta.page > 1) {
      props.onChangePage(props.meta.page - 1);
    }
  };

  const handleNext = () => {
    if (props.meta.page < totalPages) {
      props.onChangePage(props.meta.page + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <Pagination>
        <PaginationContent className="gap-1.5">
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePrev}
              className={cn(
                "cursor-pointer h-9 rounded-xl border border-[#D1DFF0] bg-white text-slate-500 text-xs font-semibold hover:bg-[#F4F8FF] hover:text-[#1D5FAD] hover:border-[#A5C0E4] transition-all",
                props.meta.page <= 1 && "pointer-events-none opacity-40",
              )}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              isActive
              className="h-9 min-w-[36px] rounded-xl bg-[#1D5FAD] text-white text-xs font-bold border-none shadow-sm hover:bg-[#174E8F] hover:text-white transition-all"
            >
              {props.meta.page}
            </PaginationLink>
          </PaginationItem>

          <div className="flex items-center px-2 text-xs text-slate-400 font-semibold">
            dari {totalPages}
          </div>

          <PaginationItem>
            <PaginationNext
              onClick={handleNext}
              className={cn(
                "cursor-pointer h-9 rounded-xl border border-[#D1DFF0] bg-white text-slate-500 text-xs font-semibold hover:bg-[#F4F8FF] hover:text-[#1D5FAD] hover:border-[#A5C0E4] transition-all",
                props.meta.page >= totalPages &&
                  "pointer-events-none opacity-40",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="flex items-center gap-2">
        <div className="h-px w-12 bg-[#E2EAF4]" />
        <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-semibold">
          {/* SEKARANG SUDAH LOGIS: misal "1 - 10 dari 25 data" */}
          {from} - {to} dari {props.meta.total} data
        </span>
        <div className="h-px w-12 bg-[#E2EAF4]" />
      </div>
    </div>
  );
};

export default PaginationSection;
