import { PencilIcon, ShieldIcon, Trash2Icon } from "lucide-react"
import { RowMenu } from "@/components/Table/RowMenu"
import { useRoleUserCounts } from "@/hooks/api/roleAnalytics/useRoleUserCounts"
import type { RoleRead } from "@/api/types/role"

interface RoleCardProps {
   role: RoleRead
   onEdit: () => void
   onDelete: () => void
}

export function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
   const { data: counts } = useRoleUserCounts()
   const userCount = counts?.find(c => c.role_id === role.id)?.user_count

   return (
      <div className="flex flex-col gap-4 rounded-xl border border-(--stroke-color) bg-(--bg-trans-color) py-(--components-py) px-(--components-px) flex-1">
         <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
               <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--accent-trans-color) text-(--accent-color)">
                  <ShieldIcon className="size-5" />
               </div>
               <p className="truncate text-base font-medium text-white">{role.name}</p>
            </div>
            <RowMenu
               actions={[
                  { label: "Редагувати", Icon: PencilIcon, onClick: onEdit },
                  { label: "Видалити", Icon: Trash2Icon, danger: true, onClick: onDelete },
               ]}
            />
         </div>
         <div>
            <p className="text-2xl font-semibold text-white">{userCount ?? "—"}</p>
            <p className="text-sm text-(--second-color)">користувачів</p>
         </div>
      </div>
   )
}
