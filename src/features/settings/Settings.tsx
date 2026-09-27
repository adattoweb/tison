import { useState } from "react"
import { PlusIcon } from "lucide-react"
import PageHeader from "@/components/UI/PageHeader"
import PageDescription from "@/components/UI/PageDescription"
import Button from "@/components/UI/Button"
import { ConfirmModal } from "@/components/Modal/ConfirmModal"
import { useToast } from "@/components/Toast/useToast"
import { useRoles } from "@/hooks/api/roles/useRoles"
import { usePermissions } from "@/hooks/api/permissions/usePermissions"
import { useDeleteRole } from "@/hooks/api/roles/useDeleteRole"
import { RoleCard } from "./RoleCard"
import { RoleModal } from "./RoleModal"
import { PermissionsMatrix } from "./PermissionsMatrix"
import type { RoleRead } from "@/api/types/role"
import { isAxiosError } from "axios"

export function Settings() {
   const { data: roles, isLoading: isLoadingRoles } = useRoles()
   const { data: permissions, isLoading: isLoadingPermissions } = usePermissions()
   const { mutate: doDeleteRole } = useDeleteRole()
   const { addToast } = useToast()

   const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
   const [editingRole, setEditingRole] = useState<RoleRead | undefined>()
   const [deletingRole, setDeletingRole] = useState<RoleRead | null>(null)

   const openCreateModal = () => {
      setEditingRole(undefined)
      setIsRoleModalOpen(true)
   }

   const openEditModal = (role: RoleRead) => {
      setEditingRole(role)
      setIsRoleModalOpen(true)
   }

   return (
      <div className="flex flex-col gap-(--components-gap)">
         <div className="flex items-center justify-between gap-4">
            <div>
               <PageHeader>Ролі системи</PageHeader>
               <PageDescription>Керування ролями та рівнями доступу в системі</PageDescription>
            </div>
            <Button type="accentFilled" onClick={openCreateModal}>
               <Button.Icon Icon={PlusIcon} />
               <Button.Paragraph>Нова роль</Button.Paragraph>
            </Button>
         </div>

         {isLoadingRoles ? (
            <p className="text-(--second-color)">Завантаження...</p>
         ) : (
            <div className="gap-(--components-gap) flex">
               {roles?.map(role => (
                  <RoleCard
                     key={role.id}
                     role={role}
                     onEdit={() => openEditModal(role)}
                     onDelete={() => setDeletingRole(role)}
                  />
               ))}
            </div>
         )}

         {isLoadingRoles || isLoadingPermissions ? (
            <p className="text-(--second-color)">Завантаження...</p>
         ) : (
            roles && permissions && <PermissionsMatrix roles={roles} permissions={permissions} />
         )}

         <RoleModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} role={editingRole} />

         <ConfirmModal
            isOpen={deletingRole !== null}
            onClose={() => setDeletingRole(null)}
            onConfirm={() => {
               if (!deletingRole) return
               doDeleteRole(deletingRole.id, {
                  onSuccess: () => {
                     addToast("Успішно видалено роль!", { duration: 3000, type: "success" })
                     setDeletingRole(null)
                  },
                  onError: error => {
                     if (isAxiosError<{ detail: string }>(error) && error.response?.status === 409) {
                        addToast(
                           error.response.data?.detail ??
                              "Неможливо видалити роль, поки з нею повʼязані користувачі. Спершу приберіть цю роль у користувачів.",
                           { duration: 5000, type: "error" },
                        )
                     } else {
                        addToast("Не вдалося видалити роль", { duration: 3000, type: "error" })
                     }
                     setDeletingRole(null)
                  },
               })
            }}
            title="Видалити роль?"
            description={deletingRole ? `Роль «${deletingRole.name}» буде видалено безповоротно.` : undefined}
            confirmLabel="Видалити"
            cancelLabel="Скасувати"
         />
      </div>
   )
}
