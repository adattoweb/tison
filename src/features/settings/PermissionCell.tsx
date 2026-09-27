import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Checkbox } from "@/components/UI/Checkbox"
import { useCreateRolePermission } from "@/hooks/api/rolePermissions/useCreateRolePermission"
import { useDeleteRolePermission } from "@/hooks/api/rolePermissions/useDeleteRolePermission"
import type { PermissionListRead } from "@/api/types/permission"

interface PermissionCellProps {
   roleId: number
   permission: PermissionListRead
   checked: boolean
}

export function PermissionCell({ roleId, permission, checked }: PermissionCellProps) {
   const { mutate: grant, isPending: isGranting } = useCreateRolePermission()
   const { mutate: revoke, isPending: isRevoking } = useDeleteRolePermission()

   const { control, reset } = useForm<{ granted: boolean }>({ defaultValues: { granted: checked } })

   // синхронізуємось із серверним станом після invalidateQueries
   useEffect(() => {
      reset({ granted: checked })
   }, [checked, reset])

   return (
      <Controller
         name="granted"
         control={control}
         render={({ field }) => (
            <Checkbox
               checked={field.value}
               disabled={isGranting || isRevoking}
               onChange={e => {
                  const next = e.target.checked
                  field.onChange(next)

                  if (next) {
                     grant({ role_id: roleId, permission_id: permission.id }, { onError: () => field.onChange(!next) })
                  } else {
                     revoke({ role_id: roleId, permission_id: permission.id }, { onError: () => field.onChange(!next) })
                  }
               }}
            />
         )}
      />
   )
}
