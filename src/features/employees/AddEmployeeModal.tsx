// components/modals/AddEmployeeModal.tsx
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AtSign, Briefcase, HandCoins, Phone, Send, UserIcon } from "lucide-react"
import { isAxiosError } from "axios"

import Modal from "@/components/Modal/Modal"
import Button from "@/components/UI/Button"
import { Input } from "@/components/UI/Input"
import { FormDropdown } from "@/components/UI/FormDropdown"

import { AdminUserCreateSchema, type AdminUserCreateFormInput, type AdminUserCreateInput } from "@/api/schemas/admin"
import { useCreateUser } from "@/hooks/api/users/useCreateUser"
import { useRoles } from "@/hooks/api/roles/useRoles"
import { useShifts } from "@/hooks/api/shifts/useShifts"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function FieldError({ message }: { message?: string }) {
   if (!message) return null
   return <p className="text-red-400 text-sm">{message}</p>
}

export function AddEmployeeModal({ isOpen, setIsOpen }: ModalProps) {
   const { data: roles } = useRoles()
   const { data: shifts } = useShifts()
   const { mutate: doCreateUser, isPending } = useCreateUser()

   const {
      register,
      handleSubmit,
      control,
      reset,
      setError,
      formState: { errors },
   } = useForm<AdminUserCreateFormInput, unknown, AdminUserCreateInput>({
      resolver: zodResolver(AdminUserCreateSchema),
      defaultValues: {
         user: { email: "" },
         profile: {
            first_name: "",
            last_name: "",
            middle_name: "",
            phone: "",
            salary: 0,
            position: "",
         },
      },
   })

   const onClose = () => {
      reset()
      setIsOpen(false)
   }

   const onSubmit: SubmitHandler<AdminUserCreateInput> = data => {
      doCreateUser(data, {
         onSuccess: onClose,
         onError: error => {
            if (isAxiosError<{ detail: string; field?: string }>(error) && error.response?.status === 409) {
               const field = error.response.data?.field

               if (field === "email") {
                  setError("user.email", { message: "Юзер з таким email вже існує" })
               } else if (field === "telegram") {
                  setError("profile.telegram", { message: "Юзер з таким telegram вже існує" })
               } else if (field === "phone") {
                  setError("profile.phone", { message: "Юзер з таким телефоном вже існує" })
               }
            }
         },
      })
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення працівника</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row w-full gap-2">
                     <div className="w-full">
                        <Input
                           label="Ім'я"
                           Icon={UserIcon}
                           placeholder="Ім'я"
                           hasError={!!errors.profile?.first_name}
                           {...register("profile.first_name")}
                        />
                        <FieldError message={errors.profile?.first_name?.message} />
                     </div>
                     <div className="w-full">
                        <Input
                           label="Прізвище"
                           Icon={UserIcon}
                           placeholder="Прізвище"
                           hasError={!!errors.profile?.last_name}
                           {...register("profile.last_name")}
                        />
                        <FieldError message={errors.profile?.last_name?.message} />
                     </div>
                     <div className="w-full">
                        <Input
                           label="По батькові"
                           Icon={UserIcon}
                           placeholder="По батькові"
                           hasError={!!errors.profile?.middle_name}
                           {...register("profile.middle_name")}
                        />
                        <FieldError message={errors.profile?.middle_name?.message} />
                     </div>
                  </div>

                  <div>
                     <Input
                        label="Електронна пошта"
                        Icon={AtSign}
                        placeholder="example@mail.com"
                        hasError={!!errors.user?.email}
                        {...register("user.email")}
                     />
                     <FieldError message={errors.user?.email?.message} />
                  </div>

                  <FormDropdown
                     control={control}
                     name="user.role_id"
                     label="Роль"
                     placeholder="Оберіть роль"
                     options={roles?.map(role => ({ value: role.id, label: role.name })) ?? []}
                  />

                  <div>
                     <Input
                        label="Телеграм"
                        Icon={Send}
                        placeholder="@username"
                        hasError={!!errors.profile?.telegram}
                        {...register("profile.telegram")}
                     />
                     <FieldError message={errors.profile?.telegram?.message} />
                  </div>

                  <div>
                     <Input
                        label="Телефон"
                        Icon={Phone}
                        placeholder="+380 XX XXX XX XX"
                        hasError={!!errors.profile?.phone}
                        {...register("profile.phone")}
                     />
                     <FieldError message={errors.profile?.phone?.message} />
                  </div>

                  <div>
                     <Input
                        label="Посада"
                        Icon={Briefcase}
                        placeholder="Оператор верстата"
                        hasError={!!errors.profile?.position}
                        {...register("profile.position")}
                     />
                     <FieldError message={errors.profile?.position?.message} />
                  </div>

                  <div>
                     <Input
                        label="Заробітна плата"
                        Icon={HandCoins}
                        placeholder="0.00"
                        type="number"
                        hasError={!!errors.profile?.salary}
                        {...register("profile.salary")}
                     />
                     <FieldError message={errors.profile?.salary?.message} />
                  </div>

                  <FormDropdown
                     control={control}
                     name="profile.shift_id"
                     label="Зміна"
                     placeholder="Без зміни"
                     options={shifts?.map(shift => ({ value: shift.id, label: shift.name })) ?? []}
                  />
               </div>
            </Modal.Content>
            <footer className="flex justify-end gap-4">
               <Button type="transparent" onClick={onClose}>
                  <Button.Paragraph>Скасувати</Button.Paragraph>
               </Button>
               <Button type="accentFilled" isSubmit={true}>
                  <Button.Paragraph>{isPending ? "Створення..." : "Створити"}</Button.Paragraph>
               </Button>
            </footer>
         </form>
      </Modal>
   )
}
