import type { OperationListRead } from "@/api/types/operation"
import { STATUS } from "@/constants/status"
import { titleClassName } from "@/utils/classNames"
import { formatDateTime } from "@/utils/time"
import { ClockIcon } from "lucide-react"

function HistoryItem({ operation }: { operation: OperationListRead }) {
   const date = formatDateTime(operation.end_at ?? operation.start_at)

   return (
      <li className="flex border-b last:border-b-0 border-(--stroke-color) items-center gap-4 py-4 min-h-20">
         <ClockIcon className="shrink-0" />
         <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-white text-base font-medium truncate">{operation.operation_type?.name ?? "Операція"}</p>
            <p className="text-(--second-color) text-sm">{date ?? "Ще не розпочато"}</p>
            <p className="text-(--second-color) text-sm">
               {operation.station ? `Станція ${operation.station.code}` : "Станцію не призначено"}
            </p>
         </div>
         <p className="ml-auto shrink-0 text-base text-white">{STATUS[operation.status].label}</p>
      </li>
   )
}

interface HistoryProps {
   operations?: OperationListRead[]
}

export function History({ operations = [] }: HistoryProps) {
   const sorted = [...operations].sort((a, b) => a.order - b.order)

   return (
      <div
         className="flex flex-col flex-1 ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-px) gap-2"
         style={{ gridArea: "history" }}
      >
         <h2 className={titleClassName}>Історія</h2>
         {sorted.length === 0 ? (
            <p className="text-(--second-color)">Записів поки немає</p>
         ) : (
            <ul className="flex flex-col flex-1">
               {sorted.map(operation => (
                  <HistoryItem key={operation.id} operation={operation} />
               ))}
            </ul>
         )}
      </div>
   )
}
