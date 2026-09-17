import Modal from "@/components/Modal/Modal"
import Button from "@/components/UI/Button"
import Dropdown from "@/components/UI/Dropdown"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { stationCreateSchema, type StationCreateForm } from "@/api/schemas/station"
import { useAllDepartments } from "@/hooks/api/departments/useAllDepartments"
import { useAllProfiles } from "@/hooks/api/profile/useAllProfiles"
import { useCreateStation } from "@/hooks/api/station/useCreateStation"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddStationModal({ isOpen, setIsOpen }: ModalProps) {
   const onClose = () => setIsOpen(false)

   const { data: departments } = useAllDepartments()
   const { data: profilesPage } = useAllProfiles({ page: 1, pageSize: 100 })
   const { mutate: createStation, isPending } = useCreateStation()

   const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<StationCreateForm>({
      resolver: zodResolver(stationCreateSchema),
      defaultValues: { department_id: undefined, responsible_id: null },
   })

   const onSubmit = (values: StationCreateForm) => {
      createStation(values, {
         onSuccess: () => {
            reset()
            onClose()
         },
      })
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення станції</Modal.Header>
         <Modal.Content className="flex flex-col md:flex-row md:flex-wrap gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
               <Modal.Label>Оберіть дільницю</Modal.Label>
               <Controller
                  control={control}
                  name="department_id"
                  render={({ field }) => (
                     <Dropdown className="w-full!">
                        <Dropdown.Button className="w-full">
                           {departments?.find(d => d.id === field.value)?.name ?? "Не обрано"}
                           <Dropdown.Chevron />
                        </Dropdown.Button>
                        <Dropdown.Content>
                           {departments?.map(dep => (
                              <Dropdown.Item key={dep.id} onClick={() => field.onChange(dep.id)}>
                                 {dep.name}
                              </Dropdown.Item>
                           ))}
                        </Dropdown.Content>
                     </Dropdown>
                  )}
               />
               {errors.department_id && (
                  <span className="text-sm text-(--error-color)">{errors.department_id.message}</span>
               )}
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
         </Modal.Content>
         <footer className="flex justify-end gap-4">
            <Button type="transparent" onClick={onClose}>
               <Button.Paragraph>Скасувати</Button.Paragraph>
            </Button>
            <Button type="accentFilled" onClick={handleSubmit(onSubmit)} disabled={isPending}>
               <Button.Paragraph>Створити</Button.Paragraph>
            </Button>
         </footer>
      </Modal>
   )
}
