import clsx from "clsx"
import Dropdown from "../UI/Dropdown"
import type { WithClassName } from "@/types/common"

interface TablePaginationProps extends WithClassName {
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
   className = "",
}: TablePaginationProps) {
   const totalPages = Math.max(1, Math.ceil(total / pageSize))
   const from = total === 0 ? 0 : (page - 1) * pageSize + 1
   const to = Math.min(page * pageSize, total)

   return (
      <div
         className={clsx("flex flex-wrap items-center justify-between gap-4", className)}
         style={{ padding: "var(--components-py) var(--components-px)" }}
      >
         <span className="text-sm text-(--second-color)">
            Показано {from}-{to} з {total} {entityLabel}
         </span>

         <div className="flex items-center gap-4 pr-6">
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

            <Dropdown className="w-36">
               <Dropdown.Button className="w-full">
                  <span className="text-base font-normal text-white whitespace-nowrap">{pageSize} / сторінка</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>

               <Dropdown.Content>
                  {pageSizeOptions.map(n => (
                     <Dropdown.Item key={n} onClick={() => onPageSizeChange(n)}>
                        {n} / сторінка
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>
         </div>
      </div>
   )
}

function getPageNumbers(current: number, totalPages: number): (number | "...")[] {
   if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
   const pages = new Set<number>([1, totalPages, current - 1, current, current + 1])
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
