import { useEffect, useState } from "react"
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Cell,
   ResponsiveContainer,
   type TooltipContentProps,
} from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import { titleClassName } from "@/utils/classNames"

interface HourlyLoadPoint {
   hour: number
   load: number
}

const START_HOUR = 8
const END_HOUR = 22

async function fetchHourlyLoad(): Promise<HourlyLoadPoint[]> {
   await new Promise(r => setTimeout(r, 500))

   const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i)
   const peakHour = 14

   return hours.map(hour => {
      const curve = Math.exp(-((hour - peakHour) ** 2) / (2 * 4 ** 2))
      const load = Math.round(55 + curve * 65 + (Math.random() * 16 - 8))
      return { hour, load }
   })
}

function getStatus(load: number) {
   if (load > 100) return { color: "var(--bad-color)", label: "Перевантаження" }
   if (load >= 90) return { color: "var(--accent-color)", label: "Підвищене" }
   return { color: "var(--right-color)", label: "Норма" }
}

function CustomTooltip({ active, payload }: TooltipContentProps<ValueType, NameType>) {
   if (!active || !payload?.length) return null
   const p = payload[0].payload as HourlyLoadPoint
   const status = getStatus(p.load)

   return (
      <div className="rounded-md border border-(--stroke-color) bg-(--bg-color) px-3 py-2 shadow-lg">
         <p className="mb-1 text-xs text-(--second-color)">{String(p.hour).padStart(2, "0")}:00</p>
         <p className="flex items-center justify-between gap-4 text-sm font-medium text-white">
            <span className="text-(--second-color)">Завантаження</span>
            <span>{p.load}%</span>
         </p>
         <p className="text-sm font-medium" style={{ color: status.color }}>
            {status.label}
         </p>
      </div>
   )
}

export default function HourlyLoadChart() {
   const [data, setData] = useState<HourlyLoadPoint[] | null>(null)

   useEffect(() => {
      fetchHourlyLoad().then(setData)
   }, [])

   return (
      <div
         className="rounded-xl border border-(--stroke-color) bg-(--bg-trans-color) py-(--components-py) px-(--components-px) flex flex-col gap-4"
         style={{ gridArea: "chart" }}
      >
         <h2 className={titleClassName}>Завантаження по годинах</h2>

         {!data ? (
            <div className="h-64 w-full animate-pulse rounded-lg bg-(--bg-trans-hover-color) sm:h-72 lg:h-80" />
         ) : (
            <div className="h-64 w-full sm:h-72 lg:h-80">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 16, right: 8, left: -8, bottom: 0 }}>
                     <CartesianGrid vertical={false} stroke="var(--stroke-color)" />
                     <XAxis
                        dataKey="hour"
                        tickFormatter={h => String(h).padStart(2, "0")}
                        axisLine={{ stroke: "var(--stroke-color)" }}
                        tickLine={false}
                        tick={{ fill: "var(--second-color)", fontSize: 12 }}
                     />
                     <YAxis
                        domain={[0, (max: number) => Math.ceil((max + 10) / 25) * 25]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "var(--second-color)", fontSize: 12 }}
                        width={32}
                        label={{ value: "%", position: "top", offset: 16, fill: "var(--second-color)", fontSize: 12 }}
                     />
                     <Tooltip
                        content={CustomTooltip}
                        cursor={{ fill: "var(--bg-trans-hover-color)" }}
                        isAnimationActive={false}
                     />
                     <Bar dataKey="load" radius={[6, 6, 0, 0]} maxBarSize={40} isAnimationActive={false}>
                        {data.map((p, i) => (
                           <Cell key={i} fill={getStatus(p.load).color} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         )}
      </div>
   )
}
