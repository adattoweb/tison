import Modal from "@/components/Modal/Modal"
import Button from "@/components/UI/Button"
import Dropdown from "@/components/UI/Dropdown"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { stationCreateSchema, type StationCreateForm } from "@/api/schemas/station"
import { useAllDepartments } from "@/hooks/api/departments/useAllDepartments"
import { useAllProfiles } from "@/hooks/api/profile/useAllProfiles"
import { TimeDropdown } from "@/components/UI/TimeDropdown"
import { FieldError } from "@/components/UI/FieldError"
import { useUpdateStation } from "@/hooks/api/station/useUpdateStation"
import type { StationListRead } from "@/api/types/station"
import { useToast } from "@/components/Toast/useToast"
import { TOAST_DURATION } from "@/constants/app"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
   station: StationListRead
}

export function UpdateStationModal({ isOpen, setIsOpen, station }: ModalProps) {
   const onClose = () => setIsOpen(false)

   const { data: departments } = useAllDepartments({ page: 1, pageSize: 100 })
   const { data: profilesPage } = useAllProfiles({ page: 1, pageSize: 100 })
   const { mutate: updateStation, isPending } = useUpdateStation(station.id)
   const { addToast } = useToast()

   const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<StationCreateForm>({
      resolver: zodResolver(stationCreateSchema),
      defaultValues: {
         department_id: station.department_id,
         responsible_id: station.responsible_id,
         description: station.description,
         start_at: station.start_at,
         end_at: station.end_at,
      },
   })

   const onSubmit = (values: StationCreateForm) => {
      updateStation(values, {
         onSuccess: () => {
            addToast("Успішно відредаговано станцію!", { duration: TOAST_DURATION, type: "success" })
            reset()
            onClose()
         },
      })
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Редагування станції</Modal.Header>
         <Modal.Content className="flex flex-col md:flex-wrap gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
               <Modal.Label>Оберіть дільницю</Modal.Label>
               <Controller
                  control={control}
                  name="department_id"
                  render={({ field }) => (
                     <Dropdown className="w-full!">
                        <Dropdown.Button className="w-full">
                           {departments?.items?.find(d => d.id === field.value)?.name ?? "Не обрано"}
                           <Dropdown.Chevron />
                        </Dropdown.Button>
                        <Dropdown.Content>
                           {departments?.items?.map(dep => (
                              <Dropdown.Item key={dep.id} onClick={() => field.onChange(dep.id)}>
                                 {dep.name}
                              </Dropdown.Item>
                           ))}
                        </Dropdown.Content>
                     </Dropdown>
                  )}
               />
               <FieldError message={errors.department_id?.message} />
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
               <Modal.Label>Оберіть відповідального</Modal.Label>
               <Controller
                  control={control}
                  name="responsible_id"
                  render={({ field }) => {
                     const current = profilesPage?.items.find(p => p.user_id === field.value)
                     return (
                        <Dropdown className="w-full!">
                           <Dropdown.Button className="w-full">
                              {current ? `${current.last_name} ${current.first_name}` : "Немає"}
                              <Dropdown.Chevron />
                           </Dropdown.Button>
                           <Dropdown.Content>
                              <Dropdown.Item onClick={() => field.onChange(null)}>Немає</Dropdown.Item>
                              {profilesPage?.items.map(profile => (
                                 <Dropdown.Item key={profile.user_id} onClick={() => field.onChange(profile.user_id)}>
                                    {profile.last_name} {profile.first_name}
                                 </Dropdown.Item>
                              ))}
                           </Dropdown.Content>
                        </Dropdown>
                     )
                  }}
               />
            </div>
            <div className="flex gap-1.5">
               <div className="flex flex-col gap-1.5 flex-1">
                  <Modal.Label>Час початку роботи</Modal.Label>
                  <TimeDropdown control={control} name="start_at" />
                  <FieldError message={errors.start_at?.message} />
               </div>
               <div className="h-px w-5 mx-2 bg-white mt-3"></div>
               <div className="flex flex-col gap-1.5 flex-1">
                  <Modal.Label>Час закінчення роботи</Modal.Label>
                  <TimeDropdown control={control} name="end_at" />
                  <FieldError message={errors.end_at?.message} />
               </div>
            </div>
         </Modal.Content>
         <footer className="flex justify-end gap-4">
            <Button type="transparent" onClick={onClose}>
               <Button.Paragraph>Скасувати</Button.Paragraph>
            </Button>
            <Button type="accentFilled" onClick={handleSubmit(onSubmit)} disabled={isPending}>
               <Button.Paragraph>Зберегти</Button.Paragraph>
            </Button>
         </footer>
      </Modal>
   )
}
