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

export function DefectAnalysis() {
   return (
      <div
         className="bg-(--bg-trans-color) rounded-xl border border-(--stroke-color) py-(--components-py) px-(--components-px) flex flex-col"
         style={{ gridArea: "analysis" }}
      >
         <h2 className={`${titleClassName}`}>ШІ Аналіз</h2>
         <ul className="flex flex-col justify-between gap-4 mt-2 flex-1">
            <StatItem
               Icon={CircleAlert}
               title="Ймовірна причина"
               description="Перегрів припою"
               className="stroke-(--bad-color)"
            />
            <StatItem
               Icon={TriangleAlert}
               title="Рекомендація"
               description="Перевірити температуру паяльника та швидкість подачі припою"
               className="stroke-(--attention-color)"
            />
            <StatItem
               Icon={Wrench}
               title="Ймовірність повторення"
               description="28% (Низька)"
               className="stroke-(--info-color)"
            />
            <StatItem Icon={Bug} title="Середня якість" description="92% (Достатня)" className="stroke-(--bad-color)" />
         </ul>
      </div>
   )
}
