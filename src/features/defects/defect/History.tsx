import type { DefectRead } from "@/api/types/defect"
import { titleClassName } from "@/utils/classNames"
import { formatDateTime } from "@/utils/time"
import { ClockIcon } from "lucide-react"

interface HistoryEvent {
   key: string
   title: string
   date: string
   description: string
}

function HistoryItem({ event }: { event: HistoryEvent }) {
   return (
      <li className="flex border-b last:border-b-0 border-(--stroke-color) items-center gap-4 py-4 min-h-20">
         <ClockIcon className="shrink-0" />
         <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-white text-base font-medium">{event.title}</p>
            <p className="text-(--second-color) text-sm">{formatDateTime(event.date)}</p>
            <p className="text-(--second-color) text-sm truncate">{event.description}</p>
         </div>
      </li>
   )
}

export function History({ defect }: { defect: DefectRead }) {
   const events: HistoryEvent[] = [
      { key: "open", title: "Дефект виявлено", date: defect.start_at, description: defect.title },
      ...(defect.end_at
         ? [{ key: "close", title: "Дефект закрито", date: defect.end_at, description: defect.title }]
         : []),
   ].reverse()

   return (
      <div
         className="flex flex-col ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-px) gap-2 overflow-y-scroll min-h-0 4xl:max-h-226"
         style={{ gridArea: "history" }}
      >
         <h2 className={titleClassName}>Історія</h2>
         <ul className="flex flex-col flex-1 min-h-0 overflow-y-auto">
            {events.map(event => (
               <>
                  <HistoryItem key={event.key} event={event} />
               </>
            ))}
         </ul>
      </div>
   )
}
