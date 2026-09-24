// src/components/Charts/DefectsPieChart.tsx

import type { ReactNode } from "react"
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell, type TooltipContentProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"
import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import { titleClassName } from "@/utils/classNames"

export interface DefectSlice {
   name: string
   value: number
   fill: string
}

interface ChartSlice extends DefectSlice {
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

interface DefectsPieChartProps extends WithClassName {
   title: string
   data: DefectSlice[]
   isLoading?: boolean
   isError?: boolean
   controls?: ReactNode
   emptyMessage?: string
   footerHref?: string
   footerLabel?: string
}

export function DefectsPieChart({
   className,
   title,
   data,
   isLoading = false,
   isError = false,
   controls,
   emptyMessage = "Даних про дефекти поки немає",
   footerHref = "#",
   footerLabel = "Вся статистика дефектів",
}: DefectsPieChartProps) {
   const filtered = data.filter(item => item.value > 0)
   const total = filtered.reduce((sum, item) => sum + item.value, 0)

   const chartData: ChartSlice[] = filtered.map(item => ({
      ...item,
      percent: total > 0 ? Math.round((item.value / total) * 100) : 0,
   }))

   return (
      <div
         className={clsx(
            className,
            "flex flex-col bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-px) w-full",
         )}
         style={{ gridArea: "chart" }}
      >
         <div className="flex items-start justify-between gap-4 mb-6">
            <h2 className={titleClassName}>{title}</h2>
            {controls}
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
            <div className="flex flex-1 items-center justify-center py-12 text-(--second-color)">{emptyMessage}</div>
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

         <a
            href={footerHref}
            className="inline-block mt-auto text-(--accent-color) text-base underline underline-offset-4"
         >
            {footerLabel}
         </a>
      </div>
   )
}
