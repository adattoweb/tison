// History.tsx

import { useState } from "react"
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
import type { EmployeeActivityEvent, EmployeeActivityEventType, SessionResult } from "@/api/types/employeeAnalytics"
import type { ProfileRead } from "@/api/types/profile"
import { useEmployeeActivity } from "@/hooks/api/employeeAnalytics/useEmployeeActivity"
import { avatarUrl } from "@/constants/global"
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination"
import { titleClassName } from "@/utils/classNames"
import { formatDateTime } from "@/utils/time"
import { TablePagination } from "@/components/Table/TablePagination"

const SESSION_RESULT_LABELS: Record<SessionResult, string> = {
   paused: "призупинено",
   completed: "завершено успішно",
   cancelled: "скасовано",
}

const EVENT_META: Record<
   EmployeeActivityEventType,
   { icon: LucideIcon; label: (event: EmployeeActivityEvent) => string }
> = {
   product_created: {
      icon: PlusIcon,
      label: event => `Створив виріб «${event.product_code}»`,
   },
   operation_started: {
      icon: PlayIcon,
      label: event => `Розпочав операцію «${event.operation_type_name ?? event.operation_code}»`,
   },
   operation_ended: {
      icon: CheckCircleIcon,
      label: event => `Завершив операцію «${event.operation_type_name ?? event.operation_code}»`,
   },
   session_started: {
      icon: TimerIcon,
      label: event => `Розпочав сесію${event.station_code ? ` на станції ${event.station_code}` : ""}`,
   },
   session_ended: {
      icon: TimerOffIcon,
      label: event =>
         `Завершив сесію${event.result ? ` — ${SESSION_RESULT_LABELS[event.result]}` : ""}${
            event.station_code ? ` (станція ${event.station_code})` : ""
         }`,
   },
   defect_opened: {
      icon: AlertTriangleIcon,
      label: event => `Зафіксував дефект «${event.defect_title ?? event.defect_code}»`,
   },
   defect_closed: {
      icon: ShieldCheckIcon,
      label: event => `Закрив дефект «${event.defect_title ?? event.defect_code}»`,
   },
}

interface HistoryItemProps {
   event: EmployeeActivityEvent
   profile: ProfileRead
}

function HistoryItem({ event, profile }: HistoryItemProps) {
   const meta = EVENT_META[event.type]
   const Icon = meta.icon

   return (
      <div className="flex flex-1 border-b last:border-b-0 border-(--stroke-color) items-center gap-4 py-4 h-26 truncate">
         <Icon className="shrink-0" />
         <div className="flex h-full flex-col justify-center min-w-0">
            <p className="text-white text-base font-medium truncate">{meta.label(event)}</p>
            <p className="text-(--second-color) text-sm">{formatDateTime(event.at)}</p>
         </div>
         <div className="flex items-center gap-2 ml-auto shrink-0">
            <img src={avatarUrl} className="size-9 rounded-full" />
            <div className="flex flex-col">
               <p className="text-base text-white">
                  {profile.first_name} {profile.last_name}
               </p>
               <p className="text-(--second-color) text-base">Оператор</p>
            </div>
         </div>
      </div>
   )
}

interface HistoryProps {
   employeeId: string
   profile: ProfileRead
}

export function History({ employeeId, profile }: HistoryProps) {
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

   const { data, isLoading, isFetching, isError } = useEmployeeActivity(employeeId, { page, pageSize })

   const events = data?.items ?? []
   const total = data?.total ?? 0

   return (
      <div
         className="flex flex-col ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-px) gap-2"
         style={{ gridArea: "history" }}
      >
         <h2 className={titleClassName}>Історія</h2>

         <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
            {isLoading && <p className="text-(--second-color)">Завантаження...</p>}
            {isError && <p className="text-red-400">Не вдалося завантажити історію</p>}

            {!isLoading && !isError && events.length === 0 && (
               <p className="text-(--second-color)">Записів поки немає</p>
            )}

            {!isLoading && !isError && events.length > 0 && (
               <ul className="flex flex-col flex-1">
                  {events.map((event, index) => (
                     <li key={`${event.type}-${event.at}-${index}`}>
                        <HistoryItem event={event} profile={profile} />
                     </li>
                  ))}
               </ul>
            )}
         </div>

         {total > 0 && (
            <TablePagination
               page={page}
               pageSize={pageSize}
               total={total}
               onPageChange={setPage}
               onPageSizeChange={size => {
                  setPageSize(size)
                  setPage(1)
               }}
               entityLabel="подій"
            />
         )}
      </div>
   )
}
