import { useState } from "react"
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   Dot,
   type TooltipContentProps,
} from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import Dropdown from "@/components/UI/Dropdown"

interface ChartPoint {
   time: string
   plan: number
   fact: number
}

const chartData: ChartPoint[] = [
   { time: "6:00", plan: 0, fact: 0 },
   { time: "7:30", plan: 22, fact: 30 },
   { time: "9:00", plan: 38, fact: 60 },
   { time: "10:30", plan: 45, fact: 60 },
   { time: "12:00", plan: 52, fact: 75 },
   { time: "13:30", plan: 55, fact: 80 },
   { time: "15:00", plan: 51, fact: 85 },
   { time: "16:30", plan: 54, fact: 78 },
   { time: "18:00", plan: 59, fact: 85 },
]

const SERIES_LABELS: Record<string, string> = {
   plan: "План",
   fact: "Факт",
}

interface StatRowProps {
   label: string
   value: string
   valueColor?: string
}

function StatRow({ label, value, valueColor = "text-white" }: StatRowProps) {
   return (
      <div className="flex items-center justify-between gap-4">
         <span className="text-sm text-(--second-color)">{label}</span>
         <span className={`text-base font-semibold ${valueColor}`}>{value}</span>
      </div>
   )
}

interface LastPointDotProps {
   cx?: number
   cy?: number
   index?: number
}

function LastPointDot({ cx, cy, index }: LastPointDotProps) {
   if (cx === undefined || cy === undefined || index === undefined) return null
   if (index !== chartData.length - 1) return null
   return <Dot cx={cx} cy={cy} r={5} fill="var(--accent-color)" stroke="none" />
}

function CustomTooltip({ active, payload, label }: TooltipContentProps<ValueType, NameType>) {
   if (!active || !payload?.length) return null

   return (
      <div className="min-w-[140px] rounded-md border border-(--stroke-color) bg-(--bg-color) px-3 py-2 shadow-lg">
         <p className="mb-1 text-xs text-(--second-color)">{label}</p>
         {payload.map(entry => {
            const key = String(entry.dataKey ?? entry.name ?? "")
            return (
               <p key={key} className="flex items-center justify-between gap-4 text-sm font-medium text-white">
                  <span className="text-(--second-color)">{SERIES_LABELS[key] ?? key}</span>
                  <span>{entry.value}</span>
               </p>
            )
         })}
      </div>
   )
}

export default function DashboardAnalysis() {
   const [period, setPeriod] = useState("Сьогодні")

   return (
      <div
         className="rounded-xl border border-(--stroke-color) bg-(--bg-trans-color) py-(--components-py) px-(--components-px)"
         style={{ gridArea: "analysis" }}
      >
         <div className="mb-2 flex flex-wrap items-start justify-between gap-4">
            <h2 className="text-lg font-bold text-white sm:text-xl">Аналіз виробництва</h2>
            <Dropdown value={period} options={["Сьогодні", "Тиждень", "Місяць"]} onChange={setPeriod} />
         </div>

         <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
            <div className="flex w-full flex-col lg:w-70!">
               <div className="flex flex-col gap-4">
                  <StatRow label="Виробів у роботі" value="53" />
                  <StatRow label="На тестуванні" value="12" />
                  <StatRow label="Завершено сьогодні" value="66" />
               </div>

               <div className="my-6 h-px bg-(--stroke-color)" />

               <div className="flex flex-col gap-4">
                  <StatRow label="Середній цикл виробу" value="4 дні" />
                  <StatRow label="Прогноз виконання плану" value="102%" valueColor="text-[#61D381]" />
               </div>

               <a
                  href="#"
                  className="mt-auto text-sm font-medium text-(--accent-color) underline underline-offset-4 transition-opacity hover:opacity-80 lg:pt-8 "
               >
                  Детальніше
               </a>
            </div>

            <div className="flex w-full min-w-0 flex-col">
               <div className="mb-2 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <h3 className="text-base font-bold text-white">Динаміка виробництва</h3>
                  <div className="flex items-center gap-4 text-sm text-(--second-color)">
                     <span className="flex items-center gap-2">
                        <span className="h-0 w-4 border-t-2 border-dashed border-(--accent-color)" />
                        План
                     </span>
                     <span className="flex items-center gap-2">
                        <span className="h-px w-4 bg-white" />
                        Факт
                     </span>
                  </div>
               </div>

               <div className="h-55 w-full sm:h-65 lg:h-70">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={chartData} margin={{ top: 0, right: 8, left: -8, bottom: 0 }}>
                        <CartesianGrid vertical={false} stroke="var(--stroke-color)" />
                        <XAxis
                           dataKey="time"
                           axisLine={{ stroke: "var(--stroke-color)" }}
                           tickLine={false}
                           tick={{ fill: "var(--second-color)", fontSize: 12 }}
                           interval="preserveStartEnd"
                           minTickGap={24}
                        />
                        <YAxis
                           domain={[0, 100]}
                           ticks={[0, 25, 50, 75, 100]}
                           axisLine={false}
                           tickLine={false}
                           tick={{ fill: "var(--second-color)", fontSize: 12 }}
                           width={32}
                        />
                        <Tooltip
                           content={CustomTooltip}
                           cursor={{ stroke: "var(--stroke-color)" }}
                           isAnimationActive={false}
                           allowEscapeViewBox={{ x: false, y: true }}
                           wrapperStyle={{ outline: "none" }}
                        />
                        <Line
                           type="linear"
                           dataKey="plan"
                           stroke="var(--accent-color)"
                           strokeWidth={2}
                           strokeDasharray="4 4"
                           dot={false}
                           isAnimationActive={false}
                           activeDot={{ r: 4, fill: "var(--accent-color)" }}
                        />
                        <Line
                           type="linear"
                           dataKey="fact"
                           stroke="#ffffff"
                           strokeWidth={2}
                           dot={<LastPointDot />}
                           isAnimationActive={false}
                           activeDot={{ r: 4, fill: "#ffffff" }}
                        />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
      </div>
   )
}
