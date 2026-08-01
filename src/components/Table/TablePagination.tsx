import clsx from "clsx"
import Dropdown from "../UI/Dropdown"

interface TablePaginationProps {
   page: number
   pageSize: number
   total: number
   onPageChange: (page: number) => void
   onPageSizeChange: (pageSize: number) => void
   pageSizeOptions?: number[]
   entityLabel?: string
}

export function TablePagination({
   page,
   pageSize,
   total,
   onPageChange,
   onPageSizeChange,
   pageSizeOptions = [10, 25, 50],
   entityLabel = "записів",
}: TablePaginationProps) {
   const totalPages = Math.max(1, Math.ceil(total / pageSize))
   const from = total === 0 ? 0 : (page - 1) * pageSize + 1
   const to = Math.min(page * pageSize, total)

   return (
      <div
         className="flex flex-wrap items-center justify-between gap-4 border-t border-(--stroke-color)"
         style={{ padding: "var(--components-py) var(--components-px)" }}
      >
         <span className="text-sm text-(--second-color)">
            Показано {from}-{to} з {total} {entityLabel}
         </span>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
               {getPageNumbers(page, totalPages).map((p, i) =>
                  p === "..." ? (
                     <span key={`dots-${i}`} className="px-1 text-sm text-(--second-color)">
                        …
                     </span>
                  ) : (
                     <button
                        key={p}
                        type="button"
                        onClick={() => onPageChange(p)}
                        className={clsx(
                           "h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition-colors",
                           p === page
                              ? "bg-(--accent-color) text-(--bg-color)"
                              : "bg-(--bg-trans-color) text-white hover:bg-(--bg-trans-hover-color)",
                        )}
                     >
                        {p}
                     </button>
                  ),
               )}
            </div>
            <div className="w-36">
               <Dropdown
                  value={`${pageSize} / сторінка`}
                  options={pageSizeOptions.map(n => `${n} / сторінка`)}
                  onChange={v => onPageSizeChange(Number(v.split(" ")[0]))}
               />
            </div>
         </div>
      </div>
   )
}

function getPageNumbers(current: number, totalPages: number): (number | "...")[] {
   if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
   const pages = new Set<number>([1, 2, totalPages - 1, totalPages, current - 1, current, current + 1])
   const sorted = [...pages].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b)
   const result: (number | "...")[] = []
   let prev = 0
   for (const p of sorted) {
      if (prev && p - prev > 1) result.push("...")
      result.push(p)
      prev = p
   }
   return result
}
