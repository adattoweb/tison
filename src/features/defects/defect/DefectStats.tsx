import type { WithClassName } from "@/types/common"
import { titleClassName } from "@/utils/classNames"
import clsx from "clsx"
import { Bug, CircleAlert, TriangleAlert, Wrench, type LucideIcon } from "lucide-react"

interface ItemProps extends WithClassName {
   Icon: LucideIcon
   title: string
   description: string
   className?: string
}

function StatItem({ Icon, title, description, className = "" }: ItemProps) {
   return (
      <li className={clsx("flex items-center gap-3", className)}>
         <Icon className="size-7 stroke-inherit" />
         <div className="flex flex-col">
            <p className="text-white text-base font-medium">{title}</p>
            <p className="text-(--second-color) text-base">{description}</p>
         </div>
      </li>
   )
}

export function DefectStats() {
   return (
      <div
         className="bg-(--bg-trans-color) rounded-xl border border-(--stroke-color) py-(--components-py) px-(--components-px) flex flex-col"
         style={{ gridArea: "stats" }}
      >
         <h2 className={`${titleClassName}`}>Статистика типу дефекту</h2>
         <ul className="flex flex-col justify-between flex-1 gap-4 mt-2">
            <StatItem Icon={CircleAlert} title="Всього випадків" description="18" className="stroke-(--bad-color)" />
            <StatItem Icon={TriangleAlert} title="Критичних" description="5" className="stroke-(--attention-color)" />
            <StatItem
               Icon={Wrench}
               title="Середній час вирішення"
               description="3 години 21 хвилин"
               className="stroke-(--info-color)"
            />
            <StatItem
               Icon={Bug}
               title="Найчастіша причина"
               description="Перегрів припою"
               className="stroke-(--bad-color)"
            />
         </ul>
      </div>
   )
}
