import { useAllDefects } from "@/hooks/api/defects/useAllDefects"
import { titleClassName } from "@/utils/classNames"
import { formatDuration } from "@/utils/time"
import clsx from "clsx"
import { CircleAlert, CircleCheck, TriangleAlert, Wrench, type LucideIcon } from "lucide-react"

interface ItemProps {
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

export function DefectStats({ operationId }: { operationId: number }) {
   const { data } = useAllDefects({ page: 1, pageSize: 100, operationId })

   const items = data?.items ?? []
   const total = data?.total ?? 0
   const open = items.filter(d => d.status === "OPEN").length
   const closed = items.filter(d => d.status === "CLOSE").length

   // час вирішення в секундах для закритих дефектів
   const durations = items.flatMap(d =>
      d.end_at ? [(new Date(d.end_at).getTime() - new Date(d.start_at).getTime()) / 1000] : [],
   )
   const average = durations.length ? durations.reduce((sum, value) => sum + value, 0) / durations.length : null

   return (
      <div
         className="bg-(--bg-trans-color) rounded-xl border border-(--stroke-color) py-(--components-py) px-(--components-px) flex flex-col"
         style={{ gridArea: "stats" }}
      >
         <h2 className={titleClassName}>Статистика по операції</h2>
         <ul className="flex flex-col justify-between flex-1 gap-4 mt-2">
            <StatItem
               Icon={CircleAlert}
               title="Всього дефектів"
               description={String(total)}
               className="stroke-(--bad-color)"
            />
            <StatItem
               Icon={TriangleAlert}
               title="Відкритих"
               description={String(open)}
               className="stroke-(--attention-color)"
            />
            <StatItem
               Icon={CircleCheck}
               title="Закритих"
               description={String(closed)}
               className="stroke-(--info-color)"
            />
            <StatItem
               Icon={Wrench}
               title="Середній час вирішення"
               description={average === null ? "—" : formatDuration(Math.round(average))}
               className="stroke-(--info-color)"
            />
         </ul>
      </div>
   )
}
