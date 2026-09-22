import "react-day-picker/style.css"

import { OrderCreateSchema, type OrderCreateInput } from "@/api/schemas/order"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import Dropdown from "@/components/UI/Dropdown"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { useCreateOrder } from "@/hooks/api/orders/useCreateOrder"
import { useAllProductModels } from "@/hooks/api/productModels/useAllProductModels"
import { endOfDay, startOfDay } from "@/utils/time"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { CheckCheckIcon, SquareChartGantt } from "lucide-react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { TOAST_DURATION } from "@/constants/app"
import { DatePickerField } from "@/components/UI/DatePickerField"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddOrderModal({ isOpen, setIsOpen }: ModalProps) {
   const { mutate: doCreateOrder, isPending } = useCreateOrder()
   const { data: modelsData } = useAllProductModels({ page: 1, pageSize: 100, isActive: true })
   const { addToast } = useToast()

   const productModels = modelsData?.items ?? []

   const {
      register,
      handleSubmit,
      reset,
      control,
      watch,
      setValue,
      formState: { errors },
   } = useForm<OrderCreateInput>({
      resolver: zodResolver(OrderCreateSchema),
      defaultValues: {
         fact: 0,
         planned_start_at: "",
         planned_end_at: "",
      },
   })

   const plannedStart = watch("planned_start_at")
   const plannedEnd = watch("planned_end_at")

   const today = new Date()
   const endMinDate = plannedStart ? new Date(plannedStart) : today

   const onClose = () => {
      reset()
      setIsOpen(false)
   }

   const onSubmit: SubmitHandler<OrderCreateInput> = data => {
      doCreateOrder(data, {
         onSuccess: () => {
            addToast("Успішно створено замовлення!", { duration: TOAST_DURATION, type: "success" })
            onClose()
         },
      })
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення плану</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  <div className="md:col-span-2">
                     <Controller
                        name="product_model_id"
                        control={control}
                        render={({ field }) => {
                           const selected = productModels.find(m => m.id === field.value)

                           return (
                              <div className="flex flex-col gap-1.5 w-full">
                                 <Modal.Label>Оберіть виріб</Modal.Label>
                                 <Dropdown className="w-full!">
                                    <Dropdown.Button
                                       className={clsx("w-full h-11", errors.product_model_id && "border-red-400!")}
                                    >
                                       <span className={clsx("truncate", !selected && "opacity-60")}>
                                          {selected ? selected.title : "Оберіть виріб"}
                                       </span>
                                       <Dropdown.Chevron />
                                    </Dropdown.Button>
                                    <Dropdown.Content>
                                       {productModels.length === 0 && (
                                          <p className="px-3 md:px-4 py-2 opacity-60">Виробів немає</p>
                                       )}
                                       {productModels.map(model => (
                                          <Dropdown.Item key={model.id} onClick={() => field.onChange(model.id)}>
                                             {model.title}
                                          </Dropdown.Item>
                                       ))}
                                    </Dropdown.Content>
                                 </Dropdown>
                              </div>
                           )
                        }}
                     />
                     <FieldError message={errors.product_model_id?.message} />
                  </div>

                  <div>
                     <Input
                        label="План"
                        Icon={SquareChartGantt}
                        placeholder="100"
                        type="number"
                        hasError={!!errors.plan}
                        {...register("plan", { valueAsNumber: true })}
                     />
                     <FieldError message={errors.plan?.message} />
                  </div>

                  <div>
                     <Input
                        label="Факт"
                        Icon={CheckCheckIcon}
                        placeholder="0"
                        type="number"
                        hasError={!!errors.fact}
                        {...register("fact", { valueAsNumber: true })}
                     />
                     <FieldError message={errors.fact?.message} />
                  </div>

                  <div>
                     <Controller
                        name="planned_start_at"
                        control={control}
                        render={({ field }) => (
                           <DatePickerField
                              label="Дата початку виконання"
                              value={field.value}
                              minDate={today}
                              hasError={!!errors.planned_start_at}
                              onChange={date => {
                                 const iso = startOfDay(date)
                                 field.onChange(iso)
                                 // якщо кінець став раніше за новий початок, скидаємо його
                                 if (plannedEnd && new Date(plannedEnd) < new Date(iso)) {
                                    setValue("planned_end_at", "")
                                 }
                              }}
                           />
                        )}
                     />
                     <FieldError message={errors.planned_start_at?.message} />
                  </div>

                  <div>
                     <Controller
                        name="planned_end_at"
                        control={control}
                        render={({ field }) => (
                           <DatePickerField
                              label="Дата кінця виконання"
                              value={field.value}
                              minDate={endMinDate}
                              hasError={!!errors.planned_end_at}
                              onChange={date => field.onChange(endOfDay(date))}
                           />
                        )}
                     />
                     <FieldError message={errors.planned_end_at?.message} />
                  </div>
               </div>
            </Modal.Content>
            <footer className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
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
