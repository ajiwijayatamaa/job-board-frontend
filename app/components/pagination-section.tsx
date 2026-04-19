import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import type { PaginationMeta } from "~/types/pagination";
import { cn } from "~/lib/utils"; // Import cn untuk helper class

interface PaginationSectionProps {
  meta: PaginationMeta;
  onChangePage: (page: number) => void;
}

const PaginationSection = (props: PaginationSectionProps) => {
  const totalPages = Math.ceil(props.meta.total / props.meta.take);

  const handlePrev = () => {
    if (props.meta.page > 1) {
      props.onChangePage(props.meta.page - 1);
    }
  };

  const handleNext = () => {
    const totalPages = Math.ceil(props.meta.total / props.meta.take);
    if (props.meta.page < totalPages) {
      props.onChangePage(props.meta.page + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <Pagination>
        <PaginationContent className="gap-2">
          {/* Tombol Previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={handlePrev}
              className={cn(
                "cursor-pointer transition-all hover:bg-blue-50 hover:text-blue-600 border border-transparent",
                props.meta.page <= 1 && "pointer-events-none opacity-40",
              )}
            />
          </PaginationItem>

          {/* Angka Halaman Utama */}
          <PaginationItem>
            <PaginationLink
              isActive
              className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white border-none shadow-md min-w-[40px] h-10 transition-all scale-110"
            >
              {props.meta.page}
            </PaginationLink>
          </PaginationItem>

          {/* Info Total Halaman (Visual Saja) */}
          <div className="flex items-center px-2 text-sm text-muted-foreground font-medium">
            dari {totalPages}
          </div>

          {/* Tombol Next */}
          <PaginationItem>
            <PaginationNext
              onClick={handleNext}
              className={cn(
                "cursor-pointer transition-all hover:bg-blue-50 hover:text-blue-600 border border-transparent",
                props.meta.page >= totalPages &&
                  "pointer-events-none opacity-40",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Footer info tambahan */}
      <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">
        Menampilkan {props.meta.take} dari {props.meta.total} acara
      </span>
    </div>
  );
};

export default PaginationSection;
