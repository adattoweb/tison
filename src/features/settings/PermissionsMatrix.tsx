import { UserIcon } from "lucide-react"
import { titleClassName } from "@/utils/classNames"
import { groupPermissions } from "./permissionLabels"
import { PermissionCell } from "./PermissionCell"
import type { RoleRead } from "@/api/types/role"
import type { PermissionListRead } from "@/api/types/permission"

interface PermissionsMatrixProps {
   roles: RoleRead[]
   permissions: PermissionListRead[]
}

export function PermissionsMatrix({ roles, permissions }: PermissionsMatrixProps) {
   const groups = groupPermissions(permissions)
   const gridTemplateColumns = `260px repeat(${roles.length}, minmax(180px, 1fr))`

   const isGranted = (role: RoleRead, permissionId: number) =>
      role.role_permissions.some(rp => rp.permission_id === permissionId)

   return (
      <div className="rounded-xl border border-(--stroke-color) bg-(--bg-trans-color) py-(--components-py) px-(--components-px)">
         <h2 className={titleClassName}>Права доступу</h2>
         <p className="mb-4 text-sm text-(--second-color)">Налаштування прав доступу для кожної ролі</p>

         <div className="overflow-x-auto">
            <div className="min-w-max">
               <div
                  className="grid items-center gap-4 border-b border-(--stroke-color) pb-3"
                  style={{ gridTemplateColumns }}
               >
                  <span className="text-sm font-medium text-(--second-color)">Модуль системи</span>
                  {roles.map(role => (
                     <span
                        key={role.id}
                        className="flex items-center gap-2 truncate text-lg font-medium text-white justify-center"
                     >
                        <UserIcon className="size-5 shrink-0 text-(--accent-color)" />
                        {role.name}
                     </span>
                  ))}
               </div>

               {groups.map(group => (
                  <div key={group.resource}>
                     {group.items.length > 1 ? (
                        <>
                           <p className="pt-4 pb-1 text-base font-medium text-white">{group.label}</p>
                           {group.items.map(permission => (
                              <div
                                 key={permission.id}
                                 className="grid items-center gap-4 border-b border-(--stroke-color) py-2 last:border-b-0"
                                 style={{ gridTemplateColumns }}
                              >
                                 <span className="pl-4 text-sm text-(--second-color)">{permission.label}</span>
                                 {roles.map(role => (
                                    <PermissionCell
                                       key={role.id}
                                       roleId={role.id}
                                       permission={permission}
                                       checked={isGranted(role, permission.id)}
                                    />
                                 ))}
                              </div>
                           ))}
                        </>
                     ) : (
                        <div
                           className="grid items-center gap-4 border-b border-(--stroke-color) py-3 last:border-b-0"
                           style={{ gridTemplateColumns }}
                        >
                           <span className="pt-3 text-base font-medium text-white">{group.label}</span>
                           {roles.map(role => (
                              <PermissionCell
                                 key={role.id}
                                 roleId={role.id}
                                 permission={group.items[0]}
                                 checked={isGranted(role, group.items[0].id)}
                              />
                           ))}
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}
