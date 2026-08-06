import { useEffect, useState } from "react"
import { titleClassName } from "@/utils/classNames"

interface OperationPoint {
   day: number
   hour: number
   operationsCount: number
}

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]
const VISIBLE_DAYS = [0, 2, 4]
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const LEGEND_STEPS = [0, 0.2, 0.4, 0.65, 1]

const WORK_START = 7
const WORK_END = 21
const PEAK_HOUR = 14
const PEAK_OPERATIONS = 40

async function fetchOperationsHeatmap(): Promise<OperationPoint[]> {
   await new Promise(r => setTimeout(r, 500))

   return DAYS.flatMap((_, day) =>
      HOURS.map(hour => {
         if (hour < WORK_START || hour > WORK_END) return { day, hour, operationsCount: 0 }

         const isWeekend = day >= 5
         const distanceFromPeak = hour - PEAK_HOUR
         const curve = Math.exp(-(distanceFromPeak ** 2) / (2 * 3.5 ** 2))

         let value = PEAK_OPERATIONS * curve
         if (isWeekend) value *= 0.35

         const operationsCount = Math.max(0, Math.round(value + (Math.random() * 6 - 3)))

         return { day, hour, operationsCount }
      }),
   )
}

function getCellVisual(count: number, max: number) {
   if (count === 0) return { background: "var(--stroke-color)", opacity: 1 }
   const ratio = count / max
   const opacity = ratio <= 0.25 ? 0.25 : ratio <= 0.5 ? 0.45 : ratio <= 0.75 ? 0.7 : 1
   return {
      background: "var(--accent-color)",
      opacity,
   }
}

function HeatCell({ point, max }: { point: OperationPoint; max: number }) {
   const { background, opacity } = getCellVisual(point.operationsCount, max)

   return (
      <div className="group relative aspect-square">
         <div
            className="absolute inset-0 flex items-center justify-center rounded-[3px]"
            style={{ background, opacity }}
         ></div>
         <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-md border border-(--stroke-color) bg-(--bg-color) px-3 py-2 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            <p className="mb-1 text-xs text-(--second-color)">
               {DAYS[point.day]}, {String(point.hour).padStart(2, "0")}:00–
               {String((point.hour + 1) % 24).padStart(2, "0")}:00
            </p>
            <p className="flex items-center justify-between gap-4 text-sm font-medium text-white">
               <span className="text-(--second-color)">Створено операцій</span>
               <span>{point.operationsCount}</span>
            </p>
         </div>
      </div>
   )
}

export function OperationsHeatmap() {
   const [data, setData] = useState<OperationPoint[][] | null>(null)
   const [max, setMax] = useState(1)

   useEffect(() => {
      fetchOperationsHeatmap().then(points => {
         const byDay = DAYS.map((_, day) => points.filter(p => p.day === day).sort((a, b) => a.hour - b.hour))
         setMax(Math.max(...points.map(p => p.operationsCount), 1))
         setData(byDay)
      })
   }, [])

   return (
      <div
         className="rounded-xl border border-(--stroke-color) bg-(--bg-trans-color) py-(--components-py) px-(--components-px) flex flex-col gap-4"
         style={{ gridArea: "map" }}
      >
         <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className={titleClassName}>Продуктивність</h2>
            <span className="text-sm text-(--second-color)">Останні 3 місяці</span>
         </div>

         {!data ? (
            <div className="h-56 w-full animate-pulse rounded-lg bg-(--bg-trans-hover-color)" />
         ) : (
            <>
               <div className="grid grid-cols-[24px_repeat(24,minmax(0,1fr))] gap-[3px]">
                  <span />
                  {HOURS.map(h => (
                     <span key={h} className="text-center text-[11px] text-(--second-color)">
                        {h % 3 === 0 ? String(h).padStart(2, "0") : ""}
                     </span>
                  ))}

                  {data.map((row, day) => (
                     <>
                        <span key={`label-${day}`} className="self-center text-[11px] text-(--second-color)">
                           {VISIBLE_DAYS.includes(day) ? DAYS[day] : ""}
                        </span>
                        {row.map(point => (
                           <HeatCell key={point.hour} point={point} max={max} />
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
