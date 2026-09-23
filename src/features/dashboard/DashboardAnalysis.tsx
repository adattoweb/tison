import { useMemo, useState } from "react"
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   Dot,
   ReferenceLine,
   type TooltipContentProps,
} from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import Dropdown from "@/components/UI/Dropdown"
import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import { titleClassName } from "@/utils/classNames"
import { useProductionAnalyticsChart } from "@/hooks/api/productionAnalytics/useProductionAnalyticsChart"
import { formatShortDate, toISODate } from "@/utils/time"
import { Link } from "react-router"

const DAYS_OPTIONS = [3, 7, 14, 30] as const

const SERIES_LABELS: Record<string, string> = {
   planned: "План",
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

interface ChartRow {
   date: string
   label: string
   planned: number
   fact: number
   isDeadline: boolean
}

interface DeadlineDotProps {
   cx?: number
   cy?: number
   payload?: ChartRow
}

// Позначає точку на графіку діамантом, якщо на цей день припадає дедлайн замовлення
function DeadlineDot({ cx, cy, payload }: DeadlineDotProps) {
   if (cx === undefined || cy === undefined || !payload?.isDeadline) return null
   return <Dot cx={cx} cy={cy} r={4} fill="#E06767" stroke="none" />
}

function CustomTooltip({ active, payload, label }: TooltipContentProps<ValueType, NameType>) {
   if (!active || !payload?.length) return null

   const row = payload[0]?.payload as ChartRow | undefined

   return (
      <div className="min-w-35 rounded-md border border-(--stroke-color) bg-(--bg-color) px-3 py-2 shadow-lg">
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
         {row?.isDeadline && <p className="mt-1 text-xs text-[#E06767]">Дедлайн замовлення</p>}
      </div>
   )
}

export default function DashboardAnalysis({ className }: WithClassName) {
   const [days, setDays] = useState<number>(DAYS_OPTIONS[1])

   // dateTo — сьогодні, dateFrom — days-1 днів тому включно з сьогодні
   const { dateFrom, dateTo } = useMemo(() => {
      const today = new Date()
      const from = new Date(today)
      from.setDate(from.getDate() - (days - 1))
      return { dateFrom: toISODate(from), dateTo: toISODate(today) }
   }, [days])

   const { data, isLoading, isError } = useProductionAnalyticsChart({ dateFrom, dateTo })

   const chartData: ChartRow[] = (data ?? []).map(point => ({
      date: point.date,
      label: formatShortDate(point.date),
      planned: point.planned,
      fact: point.fact,
      isDeadline: point.is_deadline,
   }))

   const deadlineLabels = chartData.filter(row => row.isDeadline).map(row => row.label)

   return (
      <div
         className={clsx(
            className,
            "rounded-xl border border-(--stroke-color) bg-(--bg-trans-color) py-(--components-py) px-(--components-px) flex-1 flex flex-col h-full min-h-0",
         )}
         style={{ gridArea: "analysis" }}
      >
         <div className="mb-2 flex flex-wrap items-start justify-between gap-4 shrink-0">
            <h2 className={titleClassName}>Аналіз виробництва</h2>

            <Dropdown>
               <Dropdown.Button>
                  <span className="font-normal text-white whitespace-nowrap">{days} днів</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>

               <Dropdown.Content>
                  {DAYS_OPTIONS.map(option => (
                     <Dropdown.Item key={option} onClick={() => setDays(option)}>
                        {option} днів
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>
         </div>

         <div className="flex flex-col gap-8 lg:flex-row lg:gap-10 flex-1 min-h-0">
            <div className="flex w-full flex-col lg:w-70! shrink-0">
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

               <Link
                  to="/analytics"
                  className="mt-auto text-sm font-medium text-(--accent-color) underline underline-offset-4 transition-opacity hover:opacity-80 lg:pt-8 "
               >
                  Детальніше
               </Link>
            </div>

            <div className="flex w-full min-w-0 flex-col flex-1 min-h-0">
               <div className="mb-2 flex flex-wrap items-center gap-x-6 gap-y-2 shrink-0">
                  <h3 className="text-sm md:text-base font-medium text-white">Динаміка виробництва</h3>
                  <div className="flex items-center gap-4 text-sm text-(--second-color)">
                     <span className="flex items-center gap-2">
                        <span className="h-0 w-4 border-t-2 border-dashed border-(--accent-color)" />
                        План
                     </span>
                     <span className="flex items-center gap-2">
                        <span className="h-px w-4 bg-white" />
                        Факт
                     </span>
                     {deadlineLabels.length > 0 && (
                        <span className="flex items-center gap-2">
                           <span className="size-2 rounded-full bg-[#E06767]" />
                           Дедлайн
                        </span>
                     )}
                  </div>
               </div>

               <div className="w-full flex-1 min-h-64">
                  {isLoading && (
                     <div className="flex h-full items-center justify-center text-(--second-color)">
                        Завантаження...
                     </div>
                  )}

                  {isError && (
                     <div className="flex h-full items-center justify-center text-red-400">
                        Не вдалося завантажити дані
                     </div>
                  )}

                  {!isLoading && !isError && chartData.length === 0 && (
                     <div className="flex h-full items-center justify-center text-(--second-color)">Даних немає</div>
                  )}

                  {!isLoading && !isError && chartData.length > 0 && (
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 0, right: 8, left: -8, bottom: 0 }}>
                           <CartesianGrid vertical={false} stroke="var(--stroke-color)" />
                           <XAxis
                              dataKey="label"
                              axisLine={{ stroke: "var(--stroke-color)" }}
                              tickLine={false}
                              tick={{ fill: "var(--second-color)", fontSize: 12 }}
                              interval="preserveStartEnd"
                              minTickGap={24}
                           />
                           <YAxis
                              allowDecimals={false}
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
                           {deadlineLabels.map(label => (
                              <ReferenceLine
                                 key={label}
                                 x={label}
                                 stroke="#E06767"
                                 strokeDasharray="3 3"
                                 strokeOpacity={0.5}
                              />
                           ))}
                           <Line
                              type="linear"
                              dataKey="planned"
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
                              dot={<DeadlineDot />}
                              isAnimationActive={false}
                              activeDot={{ r: 4, fill: "#ffffff" }}
                           />
                        </LineChart>
                     </ResponsiveContainer>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}
