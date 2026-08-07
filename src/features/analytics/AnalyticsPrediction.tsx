import { titleClassName } from "@/utils/classNames"
import type { LucideIcon } from "lucide-react"
import { TrendingUp, PackageSearch, CheckCircle, MonitorCog, User, Wrench } from "lucide-react"

interface PredictionItem {
   title: string
   value: string
   description?: string
   color: string
   Icon: LucideIcon
}

function Prediction({ title, value, description, color = "#61D381", Icon }: PredictionItem) {
   return (
      <li className="flex flex-1 flex-col bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-3 px-4 min-w-50">
         <p className="text-(--second-color) md:text-sm xl:text-base 2xl:text-lg">{title}</p>
         <p className="font-medium md:text-xl 2xl:text-2xl mt-2" style={{ color: color }}>
            {value}
         </p>
         {description && <p className="md:text-sm xl:text-base 2xl:text-lg text-(--second-color)">{description}</p>}
         <Icon className="size-7 xl:size-9 mt-auto ml-auto self-end" color={color} strokeWidth={1.5} />
      </li>
   )
}

export function AnalyticsPrediction() {
   return (
      <div
         className="rounded-xl bg-(--bg-trans-color) border border-(--stroke-color) p-6 ibm-plex-sans"
         style={{ gridArea: "prediction" }}
      >
         <h2 className={titleClassName}>ШІ Прогноз на тиждень</h2>
         <ul className="flex gap-4 flex-1 mt-4 flex-wrap">
            <Prediction title="Ймовірність виконання плану" value="103%" color="#4ade80" Icon={TrendingUp} />
            <Prediction
               title="Планування виробництва"
               value="345"
               description="виробів"
               color="#f59e0b"
               Icon={PackageSearch}
            />
            <Prediction title="Ризик браку" value="-12%" description="зниження" color="#f87171" Icon={CheckCircle} />
            <Prediction title="Завантаження дільниць" value="101%" color="#f87171" Icon={MonitorCog} />
            <Prediction title="Потрібно працівників" value="+1" description="оператори" color="#60a5fa" Icon={User} />
            <Prediction
               title="Продуктивність працівників"
               value="96%"
               description="+3%"
               color="#4ade80"
               Icon={Wrench}
            />
         </ul>
      </div>
   )
}
