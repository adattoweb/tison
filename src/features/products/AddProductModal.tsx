import { ProductCreateSchema, type ProductCreateInput } from "@/api/schemas/product"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import { FieldError } from "@/components/UI/FieldError"
import { SelectField, type SelectOption } from "@/components/UI/SelectField"
import { TOAST_DURATION } from "@/constants/app"
import { useAllOrders } from "@/hooks/api/orders/useAllOrders"
import { useAllProductModels } from "@/hooks/api/productModels/useAllProductModels"
import { useAllProducts } from "@/hooks/api/products/useAllProducts"
import { useCreateProduct } from "@/hooks/api/products/useCreateProduct"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddProductModal({ isOpen, setIsOpen }: ModalProps) {
   const { mutate: doCreateProduct, isPending } = useCreateProduct()
   const { addToast } = useToast()

   const {
      handleSubmit,
      reset,
      control,
      watch,
      setValue,
      formState: { errors },
   } = useForm<ProductCreateInput>({
      resolver: zodResolver(ProductCreateSchema),
      defaultValues: {
         product_model_id: undefined,
         order_id: null,
         parent_id: null,
      },
   })

   const productModelId = watch("product_model_id")

   const { data: modelsData } = useAllProductModels({ page: 1, pageSize: 100, isActive: true })
   const { data: productsData } = useAllProducts({ page: 1, pageSize: 100 })
   // Замовлення показуємо лише для обраної моделі, бо продукт має належати замовленню своєї моделі
   const { data: ordersData } = useAllOrders({ page: 1, pageSize: 100, productModelId })

   const productModels = modelsData?.items ?? []
   const modelTitleById = new Map(productModels.map(model => [model.id, model.title]))

   const modelOptions: SelectOption[] = productModels.map(model => ({ value: model.id, label: model.title }))

   const orderOptions: SelectOption[] =
      productModelId === undefined
         ? []
         : (ordersData?.items ?? []).map(order => ({
              value: order.id,
              label: `№${order.id} · ${modelTitleById.get(order.product_model_id) ?? "Виріб"} (${order.fact}/${order.plan})`,
           }))

   const parentOptions: SelectOption[] = (productsData?.items ?? []).map(product => ({
      value: product.id,
      label: product.code,
   }))

   const onClose = () => {
      reset()
      setIsOpen(false)
   }

   const onSubmit: SubmitHandler<ProductCreateInput> = data => {
      doCreateProduct(
         {
            product_model_id: data.product_model_id,
            order_id: data.order_id ?? null,
            parent_id: data.parent_id ?? null,
         },
         {
            onSuccess: () => {
               addToast("Успішно створено виріб!", { duration: TOAST_DURATION, type: "success" })
               onClose()
            },
         },
      )
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення виробу</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="flex flex-col w-full gap-2">
                  <div className="w-full">
                     <Controller
                        name="product_model_id"
                        control={control}
                        render={({ field }) => (
                           <SelectField
                              label="Модель виробу"
                              placeholder="Оберіть модель"
                              value={field.value}
                              options={modelOptions}
                              emptyListLabel="Моделей немає"
                              hasError={!!errors.product_model_id}
                              onChange={value => {
                                 field.onChange(value)
                                 // замовлення іншої моделі вже не підходить
                                 setValue("order_id", null)
                              }}
                           />
                        )}
                     />
                     <FieldError message={errors.product_model_id?.message} />
                  </div>

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
                              disabled={productModelId === undefined}
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
                  <Button.Paragraph>{isPending ? "Створення..." : "Створити"}</Button.Paragraph>
               </Button>
            </footer>
         </form>
      </Modal>
   )
}
