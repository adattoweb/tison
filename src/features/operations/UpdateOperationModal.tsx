import { operationUpdateSchema, type OperationUpdateForm } from "@/api/schemas/operation"
import type { OperationListRead } from "@/api/types/operation"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import Dropdown from "@/components/UI/Dropdown"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { STATUS } from "@/constants/status"
import { useUpdateOperation } from "@/hooks/api/operations/useUpdateOperation"
import { useAllStations } from "@/hooks/api/station/useAllStations"
import type { StatusType } from "@/types/status"
import { fromLocalInput, toLocalInput } from "@/utils/time"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { CalendarClockIcon, Trash2Icon } from "lucide-react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"

interface UpdateOperationModalProps {
   isOpen: boolean
   operation: OperationListRead
   onClose: () => void
   onDelete: () => void
}

const STATUS_KEYS = Object.keys(STATUS) as StatusType[]

// порожнє поле = null, щоб схема (nullable) його пропустила
const emptyToNull = (value: string) => (value === "" ? null : value)

export function UpdateOperationModal({ isOpen, operation, onClose, onDelete }: UpdateOperationModalProps) {
   const { mutate: doUpdateOperation, isPending } = useUpdateOperation()
   const { data: stationsData } = useAllStations({ page: 1, pageSize: 100 })
   const { addToast } = useToast()

   const stations = stationsData?.items ?? []

   const {
      register,
      handleSubmit,
      control,
      formState: { errors },
   } = useForm<OperationUpdateForm>({
      resolver: zodResolver(operationUpdateSchema),
      defaultValues: {
         station_id: operation.station_id ?? undefined,
         status: operation.status,
         // null, а не "", бо схема відхиляє порожній рядок (min(1))
         start_at: operation.start_at ? toLocalInput(operation.start_at) : null,
         end_at: operation.end_at ? toLocalInput(operation.end_at) : null,
      },
   })

   const onSubmit: SubmitHandler<OperationUpdateForm> = data => {
      doUpdateOperation(
         {
            id: operation.id,
            payload: {
               station_id: data.station_id,
               status: data.status,
               start_at: data.start_at ? fromLocalInput(data.start_at) : null,
               end_at: data.end_at ? fromLocalInput(data.end_at) : null,
            },
         },
         {
            onSuccess: () => {
               addToast("Успішно оновлено операцію!", { duration: 3000, type: "success" })
               onClose()
            },
         },
      )
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Редагування операції {operation.code}</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                     <Controller
                        name="station_id"
                        control={control}
                        render={({ field }) => {
                           const label =
                              stations.find(s => s.id === field.value)?.code ??
                              (field.value === operation.station_id ? operation.station?.code : undefined)

                           return (
                              <div className="flex flex-col gap-1.5 w-full">
                                 <Modal.Label>Станція</Modal.Label>
                                 <Dropdown className="w-full!">
                                    <Dropdown.Button
                                       className={clsx("w-full h-11", errors.station_id && "border-red-400!")}
                                    >
                                       <span className={clsx("truncate", !label && "opacity-60")}>
                                          {label ?? "Оберіть станцію"}
                                       </span>
                                       <Dropdown.Chevron />
                                    </Dropdown.Button>
                                    <Dropdown.Content>
                                       {stations.length === 0 && (
                                          <p className="px-3 md:px-4 py-2 opacity-60">Станцій немає</p>
                                       )}
                                       {stations.map(station => (
                                          <Dropdown.Item key={station.id} onClick={() => field.onChange(station.id)}>
                                             {station.code}
                                          </Dropdown.Item>
                                       ))}
                                    </Dropdown.Content>
                                 </Dropdown>
                              </div>
                           )
                        }}
                     />
                     <FieldError message={errors.station_id?.message} />
                  </div>

                  <div>
                     <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                           <div className="flex flex-col gap-1.5 w-full">
                              <Modal.Label>Статус</Modal.Label>
                              <Dropdown className="w-full!">
                                 <Dropdown.Button className={clsx("w-full h-11", errors.status && "border-red-400!")}>
                                    <span className="truncate">{STATUS[field.value]?.label ?? field.value}</span>
                                    <Dropdown.Chevron />
                                 </Dropdown.Button>
                                 <Dropdown.Content>
                                    {STATUS_KEYS.map(key => (
                                       <Dropdown.Item key={key} onClick={() => field.onChange(key)}>
                                          {STATUS[key].label}
                                       </Dropdown.Item>
                                    ))}
                                 </Dropdown.Content>
                              </Dropdown>
                           </div>
                        )}
                     />
                     <FieldError message={errors.status?.message} />
                  </div>

                  <div>
                     <Input
                        label="Початок"
                        Icon={CalendarClockIcon}
                        type="datetime-local"
                        hasError={!!errors.start_at}
                        {...register("start_at", { setValueAs: emptyToNull })}
                     />
                     <FieldError message={errors.start_at?.message} />
                  </div>

                  <div>
                     <Input
                        label="Завершення"
                        Icon={CalendarClockIcon}
                        type="datetime-local"
                        hasError={!!errors.end_at}
                        {...register("end_at", { setValueAs: emptyToNull })}
                     />
                     <FieldError message={errors.end_at?.message} />
                  </div>
               </div>
            </Modal.Content>

            <footer className="flex flex-col-reverse sm:flex-row sm:items-center gap-2 sm:gap-4">
               <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-[#E06767] transition-colors hover:bg-[#E06767]/10 cursor-pointer sm:mr-auto"
               >
                  <Trash2Icon size={16} strokeWidth={1.5} />
                  Видалити
               </button>
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
