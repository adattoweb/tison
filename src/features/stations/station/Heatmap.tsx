import { useEffect, useMemo, useRef, useState, Fragment } from "react"
import { createPortal } from "react-dom"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import Dropdown from "@/components/UI/Dropdown"
import { titleClassName } from "@/utils/classNames"
import { useStationWorkload } from "@/hooks/api/stationAnalytics/useStationWorkload"
import type { StationWorkloadPoint } from "@/api/types/stationAnalytics"

const DAYS_OPTIONS = [7, 14, 30] as const
const LEGEND_STEPS = [0, 0.2, 0.4, 0.65, 1]
const TOOLTIP_GAP = 8

function formatDayLabel(iso: string) {
   return new Date(iso).toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit" })
}

function formatHour(hour: number) {
   return String(hour).padStart(2, "0")
}

function getCellVisual(percent: number) {
   if (percent <= 0) return { background: "var(--stroke-color)", opacity: 1 }
   const ratio = Math.min(percent / 100, 1)
   const opacity = ratio <= 0.25 ? 0.25 : ratio <= 0.5 ? 0.45 : ratio <= 0.75 ? 0.7 : 1
   return { background: "var(--accent-color)", opacity }
}

interface TooltipCoords {
   top: number
   left: number
   placement: "top" | "bottom"
}

interface HeatCellProps {
   point: StationWorkloadPoint
}

function HeatCell({ point }: HeatCellProps) {
   const { background, opacity } = getCellVisual(point.percent)
   const cellRef = useRef<HTMLDivElement>(null)
   const [coords, setCoords] = useState<TooltipCoords | null>(null)

   const showTooltip = () => {
      const rect = cellRef.current?.getBoundingClientRect()
      if (!rect) return

      const placement: TooltipCoords["placement"] = rect.top < 90 ? "bottom" : "top"
      const left = Math.min(Math.max(rect.left + rect.width / 2, 90), window.innerWidth - 90)

      setCoords({
         top: placement === "top" ? rect.top - TOOLTIP_GAP : rect.bottom + TOOLTIP_GAP,
         left,
         placement,
      })
   }

   const hideTooltip = () => setCoords(null)

   return (
      <div
         ref={cellRef}
         className="relative aspect-square"
         onMouseEnter={showTooltip}
         onMouseLeave={hideTooltip}
         onFocus={showTooltip}
         onBlur={hideTooltip}
         tabIndex={0}
      >
         <div
            className="absolute inset-0 flex items-center justify-center rounded-[3px]"
            style={{ background, opacity }}
         ></div>

         {coords &&
            createPortal(
               <div
                  className="pointer-events-none fixed z-50 w-max -translate-x-1/2 rounded-md border border-(--stroke-color) bg-(--bg-color) px-3 py-2 shadow-lg"
                  style={{
                     top: coords.top,
                     left: coords.left,
                     transform: coords.placement === "top" ? "translate(-50%, -100%)" : "translate(-50%, 0)",
                  }}
               >
                  <p className="mb-1 text-xs text-(--second-color)">
                     {formatDayLabel(point.date)}, {formatHour(point.hour)}:00–{formatHour((point.hour + 1) % 24)}:00
                  </p>
                  <p className="flex items-center justify-between gap-4 text-sm font-medium text-white">
                     <span className="text-(--second-color)">Завантаження</span>
                     <span>{Math.round(point.percent)}%</span>
                  </p>
                  <p className="flex items-center justify-between gap-4 text-sm font-medium text-white">
                     <span className="text-(--second-color)">Відпрацьовано</span>
                     <span>{Math.round(point.worked_minutes)} хв</span>
                  </p>
               </div>,
               document.body,
            )}
      </div>
   )
}

interface HeatmapProps {
   stationId: number
}

export function Heatmap({ stationId }: HeatmapProps) {
   const [days, setDays] = useState<number>(DAYS_OPTIONS[0])
   // page=1 — найновіший тиждень, більший page — старіші тижні (та сама семантика, що на бекенді)
   const [page, setPage] = useState(1)

   const { data, isLoading, isError } = useStationWorkload(stationId, { days, page })

   const points = data?.items ?? []
   const totalPages = data?.total_pages ?? 1

   // Зміна кількості днів змінює весь діапазон — повертаємось на найновіший тиждень
   useEffect(() => {
      setPage(1)
   }, [days])

   const hours = useMemo(() => Array.from(new Set(points.map(p => p.hour))).sort((a, b) => a - b), [points])

   const rows = useMemo(() => {
      const dates = Array.from(new Set(points.map(p => p.date))).sort()
      const byKey = new Map(points.map(p => [`${p.date}_${p.hour}`, p]))

      return dates.map(date => ({
         date,
         cells: hours.map(hour => byKey.get(`${date}_${hour}`)),
      }))
   }, [points, hours])

   const isNewestPage = page <= 1
   const isOldestPage = page >= totalPages

   const gridTemplateColumns = `28px repeat(${hours.length || 1}, minmax(0, 1fr))`

   const rangeLabel =
      rows.length > 0 ? `${formatDayLabel(rows[0].date)} – ${formatDayLabel(rows[rows.length - 1].date)}` : ""

   return (
      <div
         className="rounded-xl border border-(--stroke-color) bg-(--bg-trans-color) py-(--components-py) px-(--components-px) flex flex-col gap-4 min-w-0"
         style={{ gridArea: "heatmap" }}
      >
         <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className={titleClassName}>Завантаженість станції</h2>

            <Dropdown>
               <Dropdown.Button>
                  <span className="font-normal text-white whitespace-nowrap">Останні {days} днів</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>
               <Dropdown.Content>
                  {DAYS_OPTIONS.map(option => (
                     <Dropdown.Item key={option} onClick={() => setDays(option)}>
                        Останні {option} днів
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>
         </div>

         {isLoading && <div className="h-56 w-full animate-pulse rounded-lg bg-(--bg-trans-hover-color)" />}

         {isError && (
            <div className="flex items-center justify-center py-12 text-red-400">Не вдалося завантажити дані</div>
         )}

         {!isLoading && !isError && rows.length === 0 && (
            <div className="flex items-center justify-center py-12 text-(--second-color)">Даних немає</div>
         )}

         {!isLoading && !isError && rows.length > 0 && (
            <>
               {totalPages > 1 && (
                  <div className="flex items-center justify-between gap-2 text-sm text-(--second-color)">
                     <button
                        type="button"
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                        disabled={isOldestPage}
                        aria-label="Попередній тиждень"
                        className="flex items-center justify-center rounded-md p-1 transition-colors hover:bg-(--bg-trans-hover-color) hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                     >
                        <ChevronLeftIcon className="size-4" />
                     </button>

                     <span className="text-xs md:text-sm">{rangeLabel}</span>

                     <button
                        type="button"
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        disabled={isNewestPage}
                        aria-label="Наступний тиждень"
                        className="flex items-center justify-center rounded-md p-1 transition-colors hover:bg-(--bg-trans-hover-color) hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                     >
                        <ChevronRightIcon className="size-4" />
                     </button>
                  </div>
               )}

               <div className="w-full overflow-x-auto pb-1">
                  <div className="grid gap-[3px] min-w-125" style={{ gridTemplateColumns }}>
                     <span />
                     {hours.map(hour => (
                        <span key={hour} className="text-center text-[11px] text-(--second-color)">
                           {hour % 2 === 0 ? formatHour(hour) : ""}
                        </span>
                     ))}

                     {rows.map(row => (
                        <Fragment key={row.date}>
                           <span className="self-center text-[11px] text-(--second-color)">
                              {formatDayLabel(row.date)}
                           </span>
                           {row.cells.map((point, hourIndex) =>
                              point ? (
                                 <HeatCell key={`${row.date}-${point.hour}`} point={point} />
                              ) : (
                                 <div key={`${row.date}-empty-${hourIndex}`} className="aspect-square" />
                              ),
                           )}
                        </Fragment>
                     ))}
                  </div>
               </div>

               <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-(--second-color)">
                  <span>За графіком роботи станції</span>
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
