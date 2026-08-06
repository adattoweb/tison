import { useMemo } from "react"
import { PieChart, Pie, ResponsiveContainer } from "recharts"
import type { WithClassName } from "@/types/common"
import clsx from "clsx"
import { titleClassName } from "@/utils/classNames"

interface DefectItem {
   name: string
   value: number
   fill: string
}

const mockDefects: DefectItem[] = [
   { name: "Пайка", value: 20, fill: "#c0392b" },
   { name: "Лакування", value: 12, fill: "#b5651d" },
   { name: "Монтаж", value: 4, fill: "#e8ba6f" },
   { name: "Прошивка", value: 7, fill: "#4a9d5c" },
   { name: "Тестування", value: 7, fill: "#1f5c3a" },
   { name: "Інші", value: 50, fill: "#5a5a5a" },
]

export function Chart({ className }: WithClassName) {
   const total = useMemo(() => mockDefects.reduce((sum, item) => sum + item.value, 0), [])

   return (
      <div
         className={clsx(
            className,
            "flex flex-col bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-px) w-full",
         )}
         style={{ gridArea: "chart" }}
      >
         <div className="flex items-start justify-between mb-6">
            <h2 className={titleClassName}>Найчастіше виконувані операції</h2>
         </div>

         <div className="flex flex-wrap justify-center md:items-center gap-8 md:gap-16 mb-4">
            <div className="mx-auto md:mx-0 size-56 shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={mockDefects}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="62%"
                        outerRadius="100%"
                        paddingAngle={2}
                        stroke="none"
                     />
                  </PieChart>
               </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-4 flex-1">
               {mockDefects.map(item => {
                  const percent = Math.round((item.value / total) * 100)
                  return (
                     <div key={item.name} className="flex items-center gap-3 truncate">
                        <span className="size-3.5 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                        <span className="text-(--second-color) text-base flex-1">{item.name}</span>
                        <span className="text-base text-right">
                           <span className="text-white font-bold">{item.value}</span>{" "}
                           <span className="text-(--second-color)">({percent}%)</span>
                        </span>
                     </div>
                  )
               })}
            </div>
         </div>

         <a href="#" className="inline-block mt-auto text-(--accent-color) text-base underline underline-offset-4">
            Вся статистика дефектів
         </a>
      </div>
   )
}
