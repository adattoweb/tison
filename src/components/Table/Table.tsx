import { createContext } from "react"
import type { ReactNode } from "react"
import { MoreVertical } from "lucide-react"
import clsx from "clsx"
import { useCheckContext } from "@/hooks/useCheckContext"

type Align = "left" | "center" | "right"

const alignClass: Record<Align, string> = {
   left: "text-left justify-start",
   center: "text-center justify-center",
   right: "text-right justify-end",
}
const GridContext = createContext<string | null>(null)

interface TableProps {
   columns: string[]
   className?: string
   children: ReactNode
}

export function Table({ columns, className, children }: TableProps) {
   const gridTemplateColumns = columns.join(" ")
   return (
      <GridContext.Provider value={gridTemplateColumns}>
         <div
            role="table"
            className={clsx("w-full rounded-2xl border border-(--stroke-color) bg-(--bg-color)", className)}
         >
            {children}
         </div>
      </GridContext.Provider>
   )
}

function TableHeader({ children }: { children: ReactNode }) {
   const gridTemplateColumns = useCheckContext(GridContext)
   return (
      <div
         role="row"
         className="grid border-b border-(--stroke-color) rounded-t-2xl bg-(--bg-trans-color) py-(--components-py) px-(--components-px) gap-x-(--components-gap)"
         style={{ gridTemplateColumns }}
      >
         {children}
      </div>
   )
}

function TableHeaderCell({
   children,
   align = "left",
   className,
}: {
   children?: ReactNode
   align?: Align
   className?: string
}) {
   return (
      <div
         role="columnheader"
         className={clsx(
            "flex items-center min-w-0 text-sm font-medium text-(--second-color)",
            alignClass[align],
            className,
         )}
      >
         {children}
      </div>
   )
}

function TableBody({ children, className }: { children: ReactNode; className?: string }) {
   return (
      <div
         role="rowgroup"
         className={clsx(
            "[&>[role=row]]:border-b [&>[role=row]]:border-(--stroke-color) [&>[role=row]:last-child]:border-b-0",
            className,
         )}
      >
         {children}
      </div>
   )
}

interface TableRowProps {
   children: ReactNode
   className?: string
   onClick?: () => void
}

function TableRow({ children, className, onClick }: TableRowProps) {
   const gridTemplateColumns = useCheckContext(GridContext)
   return (
      <div
         role="row"
         onClick={onClick}
         className={clsx(
            "grid transition-colors py-(--components-py) px-(--components-px) gap-x-(--components-gap) cursor-pointer hover:bg-(--bg-trans-hover-color)",
            className,
         )}
         style={{ gridTemplateColumns }}
      >
         {children}
      </div>
   )
}

function TableCell({
   children,
   align = "left",
   className,
}: {
   children?: ReactNode
   align?: Align
   className?: string
}) {
   return (
      <div
         role="cell"
         className={clsx("flex items-center min-w-0 text-[15px] text-white", alignClass[align], className)}
      >
         {children}
      </div>
   )
}

function TableRowMenuButton({ onClick, className }: { onClick?: () => void; className?: string }) {
   return (
      <button
         type="button"
         onClick={onClick}
         aria-label="Дії"
         className={clsx(
            "rounded-lg p-1.5 text-(--second-color) transition-colors hover:bg-(--bg-trans-hover-color) hover:text-white",
            className,
         )}
      >
         <MoreVertical size={18} />
      </button>
   )
}

Table.Header = TableHeader
Table.HeaderCell = TableHeaderCell
Table.Body = TableBody
Table.Row = TableRow
Table.Cell = TableCell
Table.RowMenuButton = TableRowMenuButton
