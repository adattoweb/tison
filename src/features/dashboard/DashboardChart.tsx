import { useMemo, useState } from "react"
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell, type TooltipContentProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import Dropdown from "@/components/UI/Dropdown"
import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import { titleClassName } from "@/utils/classNames"
import { useDefectsByOperationType } from "@/hooks/api/defectAnalytics/useDefectsByOperationType"
import { toISODate } from "@/utils/time"

const DAYS_OPTIONS = [1, 7, 14, 30] as const

interface ChartSlice {
   name: string
   value: number
   fill: string
   percent: number
}

function CustomTooltip({ active, payload }: TooltipContentProps<ValueType, NameType>) {
   if (!active || !payload?.length) return null

   const slice = payload[0]?.payload as ChartSlice | undefined
   if (!slice) return null

   return (
      <div className="min-w-35 rounded-md border border-(--stroke-color) bg-(--bg-color) px-3 py-2 shadow-lg">
         <p className="flex items-center gap-2 text-sm font-medium text-white">
            <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.fill }} />
            {slice.name}
         </p>
         <p className="mt-1 flex items-center justify-between gap-4 text-sm">
            <span className="text-(--second-color)">Кількість</span>
            <span className="font-medium text-white">{slice.value}</span>
         </p>
         <p className="flex items-center justify-between gap-4 text-sm">
            <span className="text-(--second-color)">Частка</span>
            <span className="font-medium text-white">{slice.percent}%</span>
         </p>
      </div>
   )
}

export function DashboardChart({ className }: WithClassName) {
   const [days, setDays] = useState<number>(DAYS_OPTIONS[1])

   // dateTo — сьогодні, dateFrom — days-1 днів тому включно з сьогодні
   const { dateFrom, dateTo } = useMemo(() => {
      const today = new Date()
      const from = new Date(today)
      from.setDate(from.getDate() - (days - 1))
      return { dateFrom: toISODate(from), dateTo: toISODate(today) }
   }, [days])

   const { data, isLoading, isError } = useDefectsByOperationType({ dateFrom, dateTo })

   const defects = data ?? []
   const total = defects.reduce((sum, item) => sum + item.defects_count, 0)

   const chartData: ChartSlice[] = defects.map(item => ({
      name: item.name,
      value: item.defects_count,
      fill: item.color,
      percent: total > 0 ? Math.round((item.defects_count / total) * 100) : 0,
   }))

   return (
      <div
         className={clsx(
            className,
            "flex flex-col bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-px) w-full",
         )}
         style={{ gridArea: "chart" }}
      >
         <div className="flex items-start justify-between mb-6">
            <h2 className={titleClassName}>Дефекти за типом операції</h2>

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

         {isLoading && (
            <div className="flex flex-1 items-center justify-center py-12 text-(--second-color)">Завантаження...</div>
         )}

         {isError && (
            <div className="flex flex-1 items-center justify-center py-12 text-red-400">
               Не вдалося завантажити дані
            </div>
         )}

         {!isLoading && !isError && chartData.length === 0 && (
            <div className="flex flex-1 items-center justify-center py-12 text-(--second-color)">
               Дефектів за цей період немає
            </div>
         )}

         {!isLoading && !isError && chartData.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16 mb-4">
               <div className="mx-auto md:mx-0 size-56 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={chartData}
                           dataKey="value"
                           nameKey="name"
                           innerRadius="62%"
                           outerRadius="100%"
                           paddingAngle={2}
                           stroke="none"
                           isAnimationActive={false}
                        >
                           {chartData.map(slice => (
                              <Cell key={slice.name} fill={slice.fill} />
                           ))}
                        </Pie>
                        <Tooltip content={CustomTooltip} wrapperStyle={{ outline: "none" }} />
                     </PieChart>
                  </ResponsiveContainer>
               </div>

               <div className="flex flex-col gap-4 flex-1">
                  {chartData.map(item => (
                     <div key={item.name} className="flex items-center gap-3">
                        <span className="size-3.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                        <span className="text-(--second-color) text-base flex-1 truncate">{item.name}</span>
                        <span className="text-base text-right shrink-0">
                           <span className="text-white font-bold">{item.value}</span>{" "}
                           <span className="text-(--second-color)">({item.percent}%)</span>
                        </span>
                     </div>
                  ))}
               </div>
            </div>
         )}

         <a href="#" className="inline-block mt-auto text-(--accent-color) text-base underline underline-offset-4">
            Вся статистика дефектів
         </a>
      </div>
   )
}
