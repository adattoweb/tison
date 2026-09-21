import { makeProductUpdateSchema, type ProductUpdateInput } from "@/api/schemas/product"
import type { ProductListRead } from "@/api/types/product"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import { FieldError } from "@/components/UI/FieldError"
import { SelectField, type SelectOption } from "@/components/UI/SelectField"
import { useAllOrders } from "@/hooks/api/orders/useAllOrders"
import { useAllProductModels } from "@/hooks/api/productModels/useAllProductModels"
import { useAllProducts } from "@/hooks/api/products/useAllProducts"
import { useUpdateProduct } from "@/hooks/api/products/useUpdateProduct"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo } from "react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"

interface UpdateProductModalProps {
   isOpen: boolean
   product: ProductListRead
   onClose: () => void
}

export function UpdateProductModal({ isOpen, product, onClose }: UpdateProductModalProps) {
   const { mutate: doUpdateProduct, isPending } = useUpdateProduct()
   const { addToast } = useToast()

   const schema = useMemo(() => makeProductUpdateSchema(product.id), [product.id])

   const {
      handleSubmit,
      control,
      formState: { errors },
   } = useForm<ProductUpdateInput>({
      resolver: zodResolver(schema),
      defaultValues: {
         order_id: product.order_id,
         parent_id: product.parent_id,
      },
   })

   const { data: modelsData } = useAllProductModels({ page: 1, pageSize: 100, isActive: true })
   const { data: productsData } = useAllProducts({ page: 1, pageSize: 100 })
   // Модель виробу не редагується, тому замовлення беремо лише цієї моделі
   const { data: ordersData } = useAllOrders({ page: 1, pageSize: 100, productModelId: product.product_model_id })

   const modelTitle = modelsData?.items.find(m => m.id === product.product_model_id)?.title ?? "Виріб"

   const orderOptions: SelectOption[] = (ordersData?.items ?? []).map(order => ({
      value: order.id,
      label: `#${order.id} · ${modelTitle} (${order.fact}/${order.plan})`,
   }))
   // Поточне замовлення може не потрапити в перші 100, тому додаємо його вручну, щоб підпис не зникав
   if (product.order_id !== null && !orderOptions.some(o => o.value === product.order_id)) {
      orderOptions.unshift({ value: product.order_id, label: `#${product.order_id}` })
   }

   // Виріб не може бути батьком самого себе, тому себе зі списку прибираємо
   const parentOptions: SelectOption[] = (productsData?.items ?? [])
      .filter(p => p.id !== product.id)
      .map(p => ({ value: p.id, label: p.code }))
   if (product.parent_id !== null && !parentOptions.some(o => o.value === product.parent_id)) {
      parentOptions.unshift({ value: product.parent_id, label: `#${product.parent_id}` })
   }

   const onSubmit: SubmitHandler<ProductUpdateInput> = data => {
      doUpdateProduct(
         {
            id: product.id,
            // обидва поля передаємо явно, щоб PUT не обнулив зайвого
            payload: { order_id: data.order_id ?? null, parent_id: data.parent_id ?? null },
         },
         {
            onSuccess: () => {
               addToast("Успішно оновлено виріб!", { duration: 3000, type: "success" })
               onClose()
            },
         },
      )
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Редагування виробу {product.code}</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="flex flex-col w-full gap-2">
                  <div className="w-full">
                     <Controller
                        name="order_id"
                        control={control}
                        render={({ field }) => (
                           <SelectField
                              label="Замовлення"
                              placeholder="Без замовлення"
                              emptyLabel="Без замовлення"
                              value={field.value}
                              options={orderOptions}
                              emptyListLabel="Для цієї моделі замовлень немає"
                              hasError={!!errors.order_id}
                              onChange={field.onChange}
                           />
                        )}
                     />
                     <FieldError message={errors.order_id?.message} />
                  </div>

                  <div className="w-full">
                     <Controller
                        name="parent_id"
                        control={control}
                        render={({ field }) => (
                           <SelectField
                              label="Батьківський виріб"
                              placeholder="Без батьківського"
                              emptyLabel="Без батьківського"
                              value={field.value}
                              options={parentOptions}
                              emptyListLabel="Виробів немає"
                              hasError={!!errors.parent_id}
                              onChange={field.onChange}
                           />
                        )}
                     />
                     <FieldError message={errors.parent_id?.message} />
                  </div>
               </div>
            </Modal.Content>

            <footer className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
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
