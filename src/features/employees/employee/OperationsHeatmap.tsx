// EmployeeWorkloadHeatmap.tsx

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { titleClassName } from "@/utils/classNames"
import { formatShortDate } from "@/utils/time"
import { useEmployeeWorkload } from "@/hooks/api/employeeAnalytics/useEmployeeWorkload"
import type { EmployeeWorkloadPoint } from "@/api/types/employeeAnalytics"

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const LEGEND_STEPS = [0, 0.2, 0.4, 0.65, 1]
const PAGE_SIZE = 7

function getCellVisual(percent: number) {
   if (percent === 0) return { background: "var(--stroke-color)", opacity: 1 }
   const ratio = percent / 100
   const opacity = ratio <= 0.25 ? 0.25 : ratio <= 0.5 ? 0.45 : ratio <= 0.75 ? 0.7 : 1
   return {
      background: "var(--accent-color)",
      opacity,
   }
}

function HeatCell({ point }: { point: EmployeeWorkloadPoint }) {
   const { background, opacity } = getCellVisual(point.percent)

   return (
      <div className="group relative aspect-square">
         <div
            className="absolute inset-0 flex items-center justify-center rounded-[3px]"
            style={{ background, opacity }}
         ></div>
         <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-md border border-(--stroke-color) bg-(--bg-color) px-3 py-2 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            <p className="mb-1 text-xs text-(--second-color)">
               {formatShortDate(point.date)}, {String(point.hour).padStart(2, "0")}:00–
               {String((point.hour + 1) % 24).padStart(2, "0")}:00
            </p>
            <p className="flex items-center justify-between gap-4 text-sm font-medium text-white">
               <span className="text-(--second-color)">Відпрацьовано</span>
               <span>
                  {Math.round(point.worked_minutes)} з {Math.round(point.capacity_minutes)} хв
               </span>
            </p>
            <p className="flex items-center justify-between gap-4 text-sm font-medium text-white">
               <span className="text-(--second-color)">Сесій</span>
               <span>{point.sessions_count}</span>
            </p>
         </div>
      </div>
   )
}

interface EmployeeWorkloadHeatmapProps {
   employeeId: string
}

export function EmployeeWorkloadHeatmap({ employeeId }: EmployeeWorkloadHeatmapProps) {
   const [page, setPage] = useState(1)

   const { data, isLoading } = useEmployeeWorkload(employeeId, { page, pageSize: PAGE_SIZE })

   const rows = useMemo(() => {
      if (!data) return []
      const byDate = new Map<string, EmployeeWorkloadPoint[]>()
      for (const point of data.items) {
         const list = byDate.get(point.date) ?? []
         list.push(point)
         byDate.set(point.date, list)
      }
      // найновіша дата зверху — узгоджено з тим, що page=1 = сьогодні і далі вглиб минулого
      return [...byDate.entries()]
         .sort((a, b) => (a[0] < b[0] ? 1 : -1))
         .map(([date, points]) => ({
            date,
            points: [...points].sort((a, b) => a.hour - b.hour),
         }))
   }, [data])

   const totalPages = data ? Math.max(1, Math.ceil(data.total_days / PAGE_SIZE)) : 1
   const rangeLabel =
      rows.length > 0 ? `${formatShortDate(rows[rows.length - 1].date)} – ${formatShortDate(rows[0].date)}` : "—"

   return (
      <div
         className="rounded-xl border border-(--stroke-color) bg-(--bg-trans-color) py-(--components-py) px-(--components-px) flex flex-col gap-4"
         style={{ gridArea: "map" }}
      >
         <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className={titleClassName}>Продуктивність</h2>
            <div className="flex items-center gap-2">
               <span className="text-sm text-(--second-color)">{rangeLabel}</span>
               <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="rounded-md border border-(--stroke-color) p-1 text-(--second-color) transition-colors hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:text-(--second-color)"
                  aria-label="Новіший період"
               >
                  <ChevronRight size={16} />
               </button>
               <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-md border border-(--stroke-color) p-1 text-(--second-color) transition-colors hover:text-white disabled:cursor-default disabled:opacity-40 disabled:hover:text-(--second-color)"
                  aria-label="Старіший період"
               >
                  <ChevronLeft size={16} />
               </button>
            </div>
         </div>

         {isLoading || !data ? (
            <div className="h-56 w-full animate-pulse rounded-lg bg-(--bg-trans-hover-color)" />
         ) : rows.length === 0 ? (
            <div className="flex h-56 items-center justify-center text-(--second-color)">Даних немає</div>
         ) : (
            <>
               <div className="grid grid-cols-[48px_repeat(24,minmax(0,1fr))] gap-[3px]">
                  <span />
                  {HOURS.map(h => (
                     <span key={h} className="text-center text-[11px] text-(--second-color)">
                        {h % 3 === 0 ? String(h).padStart(2, "0") : ""}
                     </span>
                  ))}

                  {rows.reverse().map(row => (
                     <>
                        <span key={`label-${row.date}`} className="self-center text-[11px] text-(--second-color)">
                           {formatShortDate(row.date)}
                        </span>
                        {row.points.map(point => (
                           <HeatCell key={point.hour} point={point} />
                        ))}
                     </>
                  ))}
               </div>

               <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-(--second-color)">
                  <span>Дані оновлюються щогодини</span>
                  <div className="flex items-center gap-2 text-xs">
                     <span>Менше</span>
                     {LEGEND_STEPS.map((o, i) => (
                        <span
                           key={i}
                           className="size-3 rounded-[3px]"
                           style={
                              o
                                 ? { background: "var(--accent-color)", opacity: o }
                                 : { background: "var(--stroke-color)" }
                           }
                        />
                     ))}
                     <span>Більше</span>
                  </div>
               </div>
            </>
         )}
      </div>
   )
}
