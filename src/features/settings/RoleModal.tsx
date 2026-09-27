import { useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TagIcon } from "lucide-react"
import Modal from "@/components/Modal/Modal"
import Button from "@/components/UI/Button"
import { Input } from "@/components/UI/Input"
import { FieldError } from "@/components/UI/FieldError"
import { useToast } from "@/components/Toast/useToast"
import { RoleSchema, type RoleFormInput } from "@/api/schemas/role"
import { useCreateRole } from "@/hooks/api/roles/useCreateRole"
import { useUpdateRole } from "@/hooks/api/roles/useUpdateRole"
import { TOAST_DURATION } from "@/constants/app"
import type { RoleRead } from "@/api/types/role"

interface RoleModalProps {
   isOpen: boolean
   onClose: () => void
   /** Якщо передано — режим редагування, інакше створення нової ролі */
   role?: RoleRead
}

export function RoleModal({ isOpen, onClose, role }: RoleModalProps) {
   const { mutate: doCreateRole, isPending: isCreating } = useCreateRole()
   const { mutate: doUpdateRole, isPending: isUpdating } = useUpdateRole()
   const { addToast } = useToast()

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<RoleFormInput>({
      resolver: zodResolver(RoleSchema),
      defaultValues: { name: role?.name ?? "" },
   })

   useEffect(() => {
      reset({ name: role?.name ?? "" })
   }, [role, reset])

   const handleClose = () => {
      reset()
      onClose()
   }

   const onSubmit: SubmitHandler<RoleFormInput> = data => {
      if (role) {
         doUpdateRole(
            { id: role.id, payload: data },
            {
               onSuccess: () => {
                  addToast("Успішно оновлено роль!", { duration: TOAST_DURATION, type: "success" })
                  handleClose()
               },
            },
         )
      } else {
         doCreateRole(data, {
            onSuccess: () => {
               addToast("Успішно створено роль!", { duration: TOAST_DURATION, type: "success" })
               handleClose()
            },
         })
      }
   }

   const isPending = isCreating || isUpdating

   return (
      <Modal isOpen={isOpen} onClose={handleClose}>
         <Modal.Header>{role ? "Редагування ролі" : "Створення ролі"}</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="w-full">
                  <Input
                     label="Назва ролі"
                     Icon={TagIcon}
                     placeholder="Контролер якості"
                     hasError={!!errors.name}
                     {...register("name")}
                  />
                  <FieldError message={errors.name?.message} />
               </div>
            </Modal.Content>
            <footer className="flex justify-end gap-4">
               <Button type="transparent" onClick={handleClose}>
                  <Button.Paragraph>Скасувати</Button.Paragraph>
               </Button>
               <Button type="accentFilled" isSubmit={true}>
                  <Button.Paragraph>{isPending ? "Збереження..." : role ? "Зберегти" : "Створити"}</Button.Paragraph>
               </Button>
            </footer>
         </form>
      </Modal>
   )
}
