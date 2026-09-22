import { useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AtSign, Briefcase, HandCoins, Phone, Send, Star, UserIcon } from "lucide-react"
import { isAxiosError } from "axios"

import Modal from "@/components/Modal/Modal"
import Button from "@/components/UI/Button"
import { Input } from "@/components/UI/Input"
import { FormDropdown } from "@/components/UI/FormDropdown"
import { FieldError } from "@/components/UI/FieldError"
import { useToast } from "@/components/Toast/useToast"

import {
   ProfileAdminUpdateSchema,
   type ProfileAdminUpdateFormInput,
   type ProfileAdminUpdateInput,
} from "@/api/schemas/profile"
import { useUpdateProfileByAdmin } from "@/hooks/api/profile/useUpdateProfileByAdmin"
import { useShifts } from "@/hooks/api/shifts/useShifts"
import type { ProfileRead } from "@/api/types/profile"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
   profile: ProfileRead
}

export function UpdateProfileModal({ isOpen, setIsOpen, profile }: ModalProps) {
   const { data: shifts } = useShifts()
   const { mutate: doUpdateProfile, isPending } = useUpdateProfileByAdmin()
   const { addToast } = useToast()

   const defaultValues: ProfileAdminUpdateFormInput = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      middle_name: profile.middle_name,
      telegram: profile.telegram ?? "",
      phone: profile.phone,
      salary: profile.salary,
      position: profile.position,
      points: profile.points,
      shift_id: profile.shift_id ?? undefined,
      email: profile.email,
   }

   const {
      register,
      handleSubmit,
      control,
      reset,
      setError,
      formState: { errors, isDirty },
   } = useForm<ProfileAdminUpdateFormInput, unknown, ProfileAdminUpdateInput>({
      resolver: zodResolver(ProfileAdminUpdateSchema),
      defaultValues,
   })

   useEffect(() => {
      reset(defaultValues)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [profile, reset])

   const onClose = () => {
      reset()
      setIsOpen(false)
   }

   const onSubmit: SubmitHandler<ProfileAdminUpdateInput> = data => {
      doUpdateProfile(
         { profileId: profile.id, data, userId: profile.user_id },
         {
            onSuccess: () => {
               addToast("Профіль успішно оновлено!", { duration: 3000, type: "success" })
               onClose()
            },
            onError: error => {
               if (isAxiosError<{ detail: string; field?: string }>(error) && error.response?.status === 409) {
                  const field = error.response.data?.field

                  if (field === "email") {
                     setError("email", { message: "Юзер з таким email вже існує" })
                  } else if (field === "telegram") {
                     setError("telegram", { message: "Юзер з таким telegram вже існує" })
                  } else if (field === "phone") {
                     setError("phone", { message: "Юзер з таким телефоном вже існує" })
                  }
               }
            },
         },
      )
   }

   const shiftOptions = [
      { value: null, label: "Без зміни" },
      ...(shifts?.map(shift => ({ value: shift.id, label: shift.name })) ?? []),
   ]
   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Редагування профілю</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row w-full gap-2">
                     <div className="w-full">
                        <Input
                           label="Ім'я"
                           Icon={UserIcon}
                           placeholder="Ім'я"
                           hasError={!!errors.first_name}
                           {...register("first_name")}
                        />
                        <FieldError message={errors.first_name?.message} />
                     </div>
                     <div className="w-full">
                        <Input
                           label="Прізвище"
                           Icon={UserIcon}
                           placeholder="Прізвище"
                           hasError={!!errors.last_name}
                           {...register("last_name")}
                        />
                        <FieldError message={errors.last_name?.message} />
                     </div>
                     <div className="w-full">
                        <Input
                           label="По батькові"
                           Icon={UserIcon}
                           placeholder="По батькові"
                           hasError={!!errors.middle_name}
                           {...register("middle_name")}
                        />
                        <FieldError message={errors.middle_name?.message} />
                     </div>
                  </div>

                  <div>
                     <Input
                        label="Електронна пошта"
                        Icon={AtSign}
                        placeholder="example@mail.com"
                        hasError={!!errors.email}
                        {...register("email")}
                     />
                     <FieldError message={errors.email?.message} />
                  </div>

                  <div>
                     <Input
                        label="Телеграм"
                        Icon={Send}
                        placeholder="@username"
                        hasError={!!errors.telegram}
                        {...register("telegram")}
                     />
                     <FieldError message={errors.telegram?.message} />
                  </div>

                  <div>
                     <Input
                        label="Телефон"
                        Icon={Phone}
                        placeholder="+380 XX XXX XX XX"
                        hasError={!!errors.phone}
                        {...register("phone")}
                     />
                     <FieldError message={errors.phone?.message} />
                  </div>

                  <div>
                     <Input
                        label="Посада"
                        Icon={Briefcase}
                        placeholder="Оператор верстата"
                        hasError={!!errors.position}
                        {...register("position")}
                     />
                     <FieldError message={errors.position?.message} />
                  </div>

                  <div>
                     <Input
                        label="Заробітна плата"
                        Icon={HandCoins}
                        placeholder="0.00"
                        type="number"
                        hasError={!!errors.salary}
                        {...register("salary")}
                     />
                     <FieldError message={errors.salary?.message} />
                  </div>

                  <div>
                     <Input
                        label="Бали"
                        Icon={Star}
                        placeholder="0"
                        type="number"
                        hasError={!!errors.points}
                        {...register("points")}
                     />
                     <FieldError message={errors.points?.message} />
                  </div>

                  <FormDropdown
                     control={control}
                     name="shift_id"
                     label="Зміна"
                     placeholder="Без зміни"
                     options={shiftOptions}
                  />
               </div>
            </Modal.Content>
            <footer className="flex justify-end gap-4">
               <Button type="transparent" onClick={onClose}>
                  <Button.Paragraph>Скасувати</Button.Paragraph>
               </Button>
               <Button type="accentFilled" isSubmit={true}>
                  <Button.Paragraph>{isPending ? "Збереження..." : "Зберегти"}</Button.Paragraph>
               </Button>
            </footer>
         </form>
      </Modal>
   )
}
