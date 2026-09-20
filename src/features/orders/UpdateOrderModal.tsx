import { OrderUpdateFormSchema, type OrderUpdateFormInput } from "@/api/schemas/order"
import type { OrderListRead } from "@/api/types/order"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import { DatePickerField } from "@/components/UI/DatePickerField"
import Dropdown from "@/components/UI/Dropdown"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { STATUS_OPTIONS } from "@/constants/status"
import { useUpdateOrder } from "@/hooks/api/orders/useUpdateOrder"
import { useAllProductModels } from "@/hooks/api/productModels/useAllProductModels"
import { endOfDay, startOfDay } from "@/utils/time"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { CheckCheckIcon, SquareChartGantt, Trash2Icon } from "lucide-react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"

interface UpdateOrderModalProps {
   isOpen: boolean
   order: OrderListRead
   onClose: () => void
   onDelete: () => void
}

// Нормалізуємо дату з бекенду до ISO з поясом (Z), щоб її прийняла схема
const toIso = (value: string) => new Date(value).toISOString()

export function UpdateOrderModal({ isOpen, order, onClose, onDelete }: UpdateOrderModalProps) {
   const { mutate: doUpdateOrder, isPending } = useUpdateOrder()
   const { data: modelsData } = useAllProductModels({ page: 1, pageSize: 100, isActive: true })
   const { addToast } = useToast()

   const productModels = modelsData?.items ?? []

   const {
      register,
      handleSubmit,
      control,
      watch,
      setValue,
      formState: { errors },
   } = useForm<OrderUpdateFormInput>({
      resolver: zodResolver(OrderUpdateFormSchema),
      defaultValues: {
         product_model_id: order.product_model_id,
         plan: order.plan,
         fact: order.fact,
         status: order.status,
         planned_start_at: toIso(order.planned_start_at),
         planned_end_at: toIso(order.planned_end_at),
      },
   })

   const plannedStart = watch("planned_start_at")
   const plannedEnd = watch("planned_end_at")

   const onSubmit: SubmitHandler<OrderUpdateFormInput> = data => {
      doUpdateOrder(
         {
            id: order.id,
            // фактичні дати тут не редагуємо, передаємо поточні
            payload: { ...data, start_at: order.start_at, end_at: order.end_at, status: order.status },
         },
         {
            onSuccess: () => {
               addToast("Успішно оновлено замовлення!", { duration: 3000, type: "success" })
               onClose()
            },
         },
      )
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Редагування замовлення</Modal.Header>
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
                                 <Modal.Label>Виріб</Modal.Label>
                                 <Dropdown className="w-full!">
                                    <Dropdown.Button
                                       className={clsx("w-full h-11", errors.product_model_id && "border-red-400!")}
                                    >
                                       <span className={clsx("truncate", !selected && "opacity-60")}>
                                          {selected ? selected.title : `Виріб #${field.value}`}
                                       </span>
                                       <Dropdown.Chevron />
                                    </Dropdown.Button>
                                    <Dropdown.Content>
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

                  <div className="md:col-span-2">
                     <Controller
                        name="status"
                        control={control}
                        render={({ field }) => {
                           const selected = STATUS_OPTIONS.find(o => o.value === field.value)

                           return (
                              <div className="flex flex-col gap-1.5 w-full">
                                 <Modal.Label>Статус</Modal.Label>
                                 <Dropdown className="w-full!">
                                    <Dropdown.Button
                                       className={clsx("w-full h-11", errors.status && "border-red-400!")}
                                    >
                                       <span className="truncate">{selected?.label ?? field.value}</span>
                                       <Dropdown.Chevron />
                                    </Dropdown.Button>
                                    <Dropdown.Content>
                                       {STATUS_OPTIONS.map(option => (
                                          <Dropdown.Item
                                             key={option.value}
                                             onClick={() => field.onChange(option.value)}
                                          >
                                             {option.label}
                                          </Dropdown.Item>
                                       ))}
                                    </Dropdown.Content>
                                 </Dropdown>
                              </div>
                           )
                        }}
                     />
                     <FieldError message={errors.status?.message} />
                  </div>

                  <div>
                     <Controller
                        name="planned_start_at"
                        control={control}
                        render={({ field }) => (
                           <DatePickerField
                              label="Дата початку виконання"
                              value={field.value}
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
                              minDate={plannedStart ? new Date(plannedStart) : undefined}
                              hasError={!!errors.planned_end_at}
                              onChange={date => field.onChange(endOfDay(date))}
                           />
                        )}
                     />
                     <FieldError message={errors.planned_end_at?.message} />
                  </div>
               </div>
            </Modal.Content>

            <footer className="flex flex-col-reverse sm:flex-row sm:items-center gap-2 sm:gap-4">
               <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-[#E06767] transition-colors bg-[#E06767]/10 hover:bg-[#E06767]/10 cursor-pointer sm:mr-auto"
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
