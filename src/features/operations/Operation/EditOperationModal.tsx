import { useEffect } from "react"
import Modal from "@/components/Modal/Modal"
import Button from "@/components/UI/Button"
import Dropdown from "@/components/UI/Dropdown"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { operationUpdateSchema, type OperationUpdateForm } from "@/api/schemas/operation"
import { useAllStations } from "@/hooks/api/station/useAllStations"
import { useUpdateOperation } from "@/hooks/api/operations/useUpdateOperation"
import { FieldError } from "@/components/UI/FieldError"
import { STATUS } from "@/constants/status"
import type { StatusType } from "@/types/status"
import type { OperationListRead } from "@/api/types/operation"
import { toDateTimeLocal, fromDateTimeLocal } from "@/utils/time"

interface ModalProps {
   operation: OperationListRead | null
   onClose: () => void
}

const inputClassName =
   "w-full rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-4 py-2.5 text-sm text-white outline-none focus:border-(--stroke-active-color)"

export function EditOperationModal({ operation, onClose }: ModalProps) {
   const { data: stations } = useAllStations({ page: 1, pageSize: 100 })
   const { mutate: updateOperation, isPending } = useUpdateOperation()

   const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<OperationUpdateForm>({
      resolver: zodResolver(operationUpdateSchema),
      defaultValues: { station_id: undefined, status: undefined, start_at: null, end_at: null },
   })

   // підставляємо значення операції, коли модалка відкривається
   useEffect(() => {
      if (!operation) return
      reset({
         station_id: operation.station_id ?? undefined,
         status: operation.status,
         start_at: toDateTimeLocal(operation.start_at) || null,
         end_at: toDateTimeLocal(operation.end_at) || null,
      })
   }, [operation, reset])

   const onSubmit = (values: OperationUpdateForm) => {
      if (!operation) return
      updateOperation(
         {
            id: operation.id,
            payload: {
               station_id: values.station_id,
               status: values.status as StatusType,
               start_at: fromDateTimeLocal(values.start_at),
               end_at: fromDateTimeLocal(values.end_at),
            },
         },
         { onSuccess: () => onClose() },
      )
   }

   return (
      <Modal isOpen={operation !== null} onClose={onClose}>
         <Modal.Header>Редагування операції {operation?.code ?? ""}</Modal.Header>
         <Modal.Content className="flex flex-col gap-4 md:flex-wrap">
            <div className="flex flex-1 flex-col gap-1.5">
               <Modal.Label>Оберіть станцію</Modal.Label>
               <Controller
                  control={control}
                  name="station_id"
                  render={({ field }) => (
                     <Dropdown className="w-full!">
                        <Dropdown.Button className="w-full">
                           {stations?.items?.find(station => station.id === field.value)?.code ?? "Не обрано"}
                           <Dropdown.Chevron />
                        </Dropdown.Button>
                        <Dropdown.Content>
                           {stations?.items?.map(station => (
                              <Dropdown.Item key={station.id} onClick={() => field.onChange(station.id)}>
                                 {station.code}
                              </Dropdown.Item>
                           ))}
                        </Dropdown.Content>
                     </Dropdown>
                  )}
               />
               <FieldError message={errors.station_id?.message} />
            </div>

            <div className="flex flex-1 flex-col gap-1.5">
               <Modal.Label>Статус</Modal.Label>
               <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                     <Dropdown className="w-full!">
                        <Dropdown.Button className="w-full">
                           {field.value ? STATUS[field.value as StatusType].label : "Не обрано"}
                           <Dropdown.Chevron />
                        </Dropdown.Button>
                        <Dropdown.Content>
                           {(Object.keys(STATUS) as StatusType[]).map(key => (
                              <Dropdown.Item key={key} onClick={() => field.onChange(key)}>
                                 {STATUS[key].label}
                              </Dropdown.Item>
                           ))}
                        </Dropdown.Content>
                     </Dropdown>
                  )}
               />
               <FieldError message={errors.status?.message} />
            </div>

            <div className="flex flex-1 flex-col gap-1.5">
               <Modal.Label>Час початку</Modal.Label>
               <Controller
                  control={control}
                  name="start_at"
                  render={({ field }) => (
                     <input
                        type="datetime-local"
                        value={field.value ?? ""}
                        onChange={e => field.onChange(e.target.value || null)}
                        className={inputClassName}
                     />
                  )}
               />
               <FieldError message={errors.start_at?.message} />
            </div>

            <div className="flex flex-1 flex-col gap-1.5">
               <Modal.Label>Час закінчення</Modal.Label>
               <Controller
                  control={control}
                  name="end_at"
                  render={({ field }) => (
                     <input
                        type="datetime-local"
                        value={field.value ?? ""}
                        onChange={e => field.onChange(e.target.value || null)}
                        className={inputClassName}
                     />
                  )}
               />
               <FieldError message={errors.end_at?.message} />
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
