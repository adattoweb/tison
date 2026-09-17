import type { OperationListRead } from "@/api/types/operation"
import type { ProfileRead } from "@/api/types/profile"
import { avatarUrl } from "@/constants/global"
import { titleClassName } from "@/utils/classNames"
import { ClockIcon } from "lucide-react"

interface ItemsProps {
   operation: OperationListRead
   profile: ProfileRead
}

function HistoryItem({ operation, profile }: ItemsProps) {
   return (
      <div className="flex flex-1 border-b last:border-b-0 border-(--stroke-color) items-center gap-4 py-4 h-26 truncate">
         <ClockIcon />
         <div className="flex h-full flex-col">
            <p className="text-white text-base font-medium">{operation.operation_type_id}</p>
            <p className="text-(--second-color) text-sm">{operation.end_at}</p>
            {/* <p className="mt-auto text-(--second-color) text-sm">Зробив пайку, наче все працює.</p> */}
         </div>
         <div className="flex items-center gap-2 ml-auto">
            <img src={avatarUrl} className="size-9 rounded-full" />
            <div className="flex flex-col">
               <p className="text-base text-white">
                  {profile.first_name} {profile.last_name}
               </p>
               <p className="text-(--second-color) text-base row-span-1 grid-cols-1">Оператор</p>
            </div>
         </div>
      </div>
   )
}

interface HistoryProps {
   operations: OperationListRead[]
   profile: ProfileRead
   isLoading: boolean
}

export function History({ operations, profile, isLoading }: HistoryProps) {
   return (
      <div
         className="flex flex-col ibm-plex-sans bg-(--bg-trans-color) border border-(--stroke-color) rounded-xl py-(--components-py) px-(--components-px) gap-2"
         style={{ gridArea: "history" }}
      >
         <h2 className={titleClassName}>Історія</h2>
         <ul className="flex flex-col flex-1">
            {isLoading ? (
               <p>Завантаження...</p>
            ) : (
               operations.map((operation, id) => <HistoryItem key={id} operation={operation} profile={profile} />)
            )}
         </ul>
      </div>
   )
}
