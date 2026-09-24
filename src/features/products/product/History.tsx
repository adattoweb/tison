// src/components/.../History.tsx

import {
   PlusIcon,
   PlayIcon,
   CheckCircleIcon,
   TimerIcon,
   TimerOffIcon,
   AlertTriangleIcon,
   ShieldCheckIcon,
   type LucideIcon,
} from "lucide-react"
import { titleClassName } from "@/utils/classNames"
import { formatDateTime } from "@/utils/time"
import type { ProductHistoryEvent, ProductHistoryEventType, SessionResult } from "@/api/types/productionAnalytics"
import { useProductHistory } from "@/hooks/api/productionAnalytics/useProductHistory"

const SESSION_RESULT_LABELS: Record<SessionResult, string> = {
   paused: "призупинено",
   completed: "завершено успішно",
   cancelled: "скасовано",
}

const EVENT_META: Record<ProductHistoryEventType, { icon: LucideIcon; label: (event: ProductHistoryEvent) => string }> =
   {
      operation_created: {
         icon: PlusIcon,
         label: event => `Операція «${event.operation_type_name}» створена`,
      },
      operation_started: {
         icon: PlayIcon,
         label: event => `Операція «${event.operation_type_name}» розпочата`,
      },
      operation_ended: {
         icon: CheckCircleIcon,
         label: event => `Операція «${event.operation_type_name}» завершена`,
      },
      session_started: {
         icon: TimerIcon,
         label: event => `Сесію розпочато${event.station_code ? ` на станції ${event.station_code}` : ""}`,
      },
      session_ended: {
         icon: TimerOffIcon,
         label: event =>
            `Сесію завершено${event.result ? ` — ${SESSION_RESULT_LABELS[event.result]}` : ""}${
               event.station_code ? ` (станція ${event.station_code})` : ""
            }`,
      },
      defect_opened: {
         icon: AlertTriangleIcon,
         label: event => `Дефект «${event.defect_title ?? event.defect_code}» зафіксовано`,
      },
      defect_closed: {
         icon: ShieldCheckIcon,
         label: event => `Дефект «${event.defect_title ?? event.defect_code}» закрито`,
      },
   }

function HistoryItem({ event }: { event: ProductHistoryEvent }) {
   const meta = EVENT_META[event.type]
   const Icon = meta.icon
   const operatorName = event.operator ? `${event.operator.first_name} ${event.operator.last_name}` : null

   return (
      <li className="flex border-b last:border-b-0 border-(--stroke-color) items-center gap-4 py-4 min-h-20">
         <Icon className="shrink-0" />
         <div className="flex min-w-0 flex-col gap-0.5">
            <p className="text-white text-base font-medium truncate">{meta.label(event)}</p>
            <p className="text-(--second-color) text-sm">{formatDateTime(event.at)}</p>
         </div>
         {operatorName && <p className="ml-auto shrink-0 text-sm text-(--second-color)">{operatorName}</p>}
      </li>
   )
}

interface HistoryProps {
   productId: number
}

export function History({ productId }: HistoryProps) {
   const { data, isLoading, isError } = useProductHistory(productId)

   // найновіші події зверху
   const sorted = [...(data ?? [])].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())

   return (
      <div
         className="flex flex-col flex-1 ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-px) gap-2"
         style={{ gridArea: "history" }}
      >
         <h2 className={titleClassName}>Історія</h2>

         {isLoading && <p className="text-(--second-color)">Завантаження...</p>}
         {isError && <p className="text-red-400">Не вдалося завантажити історію</p>}

         {!isLoading && !isError && sorted.length === 0 && <p className="text-(--second-color)">Записів поки немає</p>}

         {!isLoading && !isError && sorted.length > 0 && (
            <ul className="flex flex-col flex-1">
               {sorted.map((event, index) => (
                  <HistoryItem key={`${event.operation_id}-${event.type}-${event.at}-${index}`} event={event} />
               ))}
            </ul>
         )}
      </div>
   )
}
