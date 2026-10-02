import { useState } from "react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { NotebookPenIcon } from "lucide-react"

import Modal from "@/components/Modal/Modal"
import Button from "@/components/UI/Button"
import Dropdown from "@/components/UI/Dropdown"
import { FieldError } from "@/components/UI/FieldError"
import { Textarea } from "@/components/UI/Textarea"
import { useToast } from "@/components/Toast/useToast"
import { TOAST_DURATION } from "@/constants/app"

import { WorkSessionCreateSchema, type WorkSessionCreateInput } from "@/api/schemas/workSession"
import { useCreateWorkSession } from "@/hooks/api/workSessions/useCreateWorkSession"
import { useAllStations } from "@/hooks/api/stations/useAllStations"
import { useAllOrders } from "@/hooks/api/orders/useAllOrders"
import { useAllProducts } from "@/hooks/api/products/useAllProducts"
import { useAllOperations } from "@/hooks/api/operations/useAllOperations"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ORDER_STATUSES = ["IDLE", "ACTIVE"] as const

export function AddWorkSessionModal({ isOpen, setIsOpen }: ModalProps) {
   const { mutate: doCreateWorkSession, isPending } = useCreateWorkSession()
   const { addToast } = useToast()

   const [orderId, setOrderId] = useState<number | null>(null)
   const [productId, setProductId] = useState<number | null>(null)

   const { data: stationsData, isLoading: isStationsLoading } = useAllStations({ page: 1, pageSize: 100 })
   const stations = stationsData?.items ?? []

   const { data: idleOrdersData, isLoading: isIdleOrdersLoading } = useAllOrders({
      page: 1,
      pageSize: 100,
      status: "IDLE",
   })
   const { data: activeOrdersData, isLoading: isActiveOrdersLoading } = useAllOrders({
      page: 1,
      pageSize: 100,
      status: "ACTIVE",
   })
   const orders = [...(idleOrdersData?.items ?? []), ...(activeOrdersData?.items ?? [])]
   const isOrdersLoading = isIdleOrdersLoading || isActiveOrdersLoading

   const { data: productsData, isLoading: isProductsLoading } = useAllProducts({
      page: 1,
      pageSize: 100,
      order_id: orderId ?? undefined,
   })
   const products = orderId ? (productsData?.items ?? []) : []

   const { data: operationsData, isLoading: isOperationsLoading } = useAllOperations({
      page: 1,
      pageSize: 100,
      product_id: productId ?? undefined,
   })
   const operations = productId ? (operationsData?.items ?? []) : []

   const {
      register,
      handleSubmit,
      reset,
      control,
      formState: { errors },
   } = useForm<WorkSessionCreateInput>({
      resolver: zodResolver(WorkSessionCreateSchema),
   })

   const onClose = () => {
      reset()
      setOrderId(null)
      setProductId(null)
      setIsOpen(false)
   }

   const onSubmit: SubmitHandler<WorkSessionCreateInput> = data => {
      doCreateWorkSession(data, {
         onSuccess: () => {
            addToast("Сесію успішно створено!", { duration: TOAST_DURATION, type: "success" })
            onClose()
         },
         onError: () => {
            addToast("Не вдалося створити сесію", { duration: TOAST_DURATION, type: "error" })
         },
      })
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення сесії</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="flex flex-col w-full gap-2">
                  {/* ---------- станція ---------- */}
                  <div className="w-full">
                     <Controller
                        name="station_id"
                        control={control}
                        render={({ field }) => {
                           const selected = stations.find(s => s.id === field.value)
                           return (
                              <div className="flex flex-col gap-1.5 w-full">
                                 <Modal.Label>Станція</Modal.Label>
                                 <Dropdown className="w-full!">
                                    <Dropdown.Button
                                       className={clsx("w-full h-11", errors.station_id && "border-red-400!")}
                                       disabled={isStationsLoading}
                                    >
                                       <span className={clsx("truncate", !selected && "opacity-60")}>
                                          {isStationsLoading ? "Завантаження…" : (selected?.code ?? "Оберіть станцію")}
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

                  {/* ---------- замовлення ---------- */}
                  <div className="w-full">
                     <Modal.Label>Замовлення</Modal.Label>
                     <Dropdown className="w-full!">
                        <Dropdown.Button className="w-full h-11" disabled={isOrdersLoading}>
                           <span className={clsx("truncate", orderId === null && "opacity-60")}>
                              {isOrdersLoading
                                 ? "Завантаження…"
                                 : orders.find(o => o.id === orderId)
                                   ? `Замовлення №${orderId}`
                                   : "Оберіть замовлення"}
                           </span>
                           <Dropdown.Chevron />
                        </Dropdown.Button>
                        <Dropdown.Content>
                           {orders.length === 0 && (
                              <p className="px-3 md:px-4 py-2 opacity-60">Активних замовлень немає</p>
                           )}
                           {orders.map(order => (
                              <Dropdown.Item
                                 key={order.id}
                                 onClick={() => {
                                    setOrderId(order.id)
                                    // зміна замовлення скидає нижчі по ієрархії вибори
                                    setProductId(null)
                                 }}
                              >
                                 Замовлення №{order.id}
                              </Dropdown.Item>
                           ))}
                        </Dropdown.Content>
                     </Dropdown>
                  </div>

                  {/* ---------- виріб (не йде на бекенд, лише фільтрує операції) ---------- */}
                  <div className="w-full">
                     <Modal.Label>Виріб</Modal.Label>
                     <Dropdown className="w-full!">
                        <Dropdown.Button className="w-full h-11" disabled={!orderId || isProductsLoading}>
                           <span className={clsx("truncate", productId === null && "opacity-60")}>
                              {!orderId
                                 ? "Спершу оберіть замовлення"
                                 : isProductsLoading
                                   ? "Завантаження…"
                                   : (products.find(p => p.id === productId)?.code ?? "Оберіть виріб")}
                           </span>
                           <Dropdown.Chevron />
                        </Dropdown.Button>
                        <Dropdown.Content>
                           {orderId && products.length === 0 && !isProductsLoading && (
                              <p className="px-3 md:px-4 py-2 opacity-60">Виробів по цьому замовленню немає</p>
                           )}
                           {products.map(product => (
                              <Dropdown.Item key={product.id} onClick={() => setProductId(product.id)}>
                                 {product.code}
                              </Dropdown.Item>
                           ))}
                        </Dropdown.Content>
                     </Dropdown>
                  </div>

                  {/* ---------- операція ---------- */}
                  <div className="w-full">
                     <Controller
                        name="operation_id"
                        control={control}
                        render={({ field }) => {
                           const selected = operations.find(op => op.id === field.value)
                           return (
                              <div className="flex flex-col gap-1.5 w-full">
                                 <Modal.Label>Операція</Modal.Label>
                                 <Dropdown className="w-full!">
                                    <Dropdown.Button
                                       className={clsx("w-full h-11", errors.operation_id && "border-red-400!")}
                                       disabled={!productId || isOperationsLoading}
                                    >
                                       <span className={clsx("truncate", !selected && "opacity-60")}>
                                          {!productId
                                             ? "Спершу оберіть виріб"
                                             : isOperationsLoading
                                               ? "Завантаження…"
                                               : selected
                                                 ? [selected.code, selected.operation_type?.name]
                                                      .filter(Boolean)
                                                      .join(" · ")
                                                 : "Оберіть операцію"}
                                       </span>
                                       <Dropdown.Chevron />
                                    </Dropdown.Button>
                                    <Dropdown.Content>
                                       {productId && operations.length === 0 && !isOperationsLoading && (
                                          <p className="px-3 md:px-4 py-2 opacity-60">
                                             Операцій для цього виробу немає
                                          </p>
                                       )}
                                       {operations.map(operation => (
                                          <Dropdown.Item
                                             key={operation.id}
                                             onClick={() => field.onChange(operation.id)}
                                          >
                                             {[operation.code, operation.operation_type?.name]
                                                .filter(Boolean)
                                                .join(" · ")}
                                          </Dropdown.Item>
                                       ))}
                                    </Dropdown.Content>
                                 </Dropdown>
                              </div>
                           )
                        }}
                     />
                     <FieldError message={errors.operation_id?.message} />
                  </div>

                  {/* ---------- примітка ---------- */}
                  <div className="w-full">
                     <Textarea
                        label="Примітка"
                        Icon={NotebookPenIcon}
                        placeholder="Необов'язково"
                        rows={3}
                        hasError={!!errors.note}
                        {...register("note")}
                     />
                     <FieldError message={errors.note?.message} />
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
