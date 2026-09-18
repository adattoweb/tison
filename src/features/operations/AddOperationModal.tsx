import Modal from "@/components/Modal/Modal"
import Button from "@/components/UI/Button"
import Dropdown from "@/components/UI/Dropdown"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { operationCreateSchema, type OperationCreateForm } from "@/api/schemas/operation"
import { useAllOperationTypes } from "@/hooks/api/operationTypes/useAllOperationTypes"
import { useAllProducts } from "@/hooks/api/products/useAllProducts"
import { useCreateOperation } from "@/hooks/api/operations/useCreateOperation"
import { FieldError } from "@/components/UI/FieldError"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddOperationModal({ isOpen, setIsOpen }: ModalProps) {
   const onClose = () => setIsOpen(false)

   const { data: operationTypes } = useAllOperationTypes({ page: 1, pageSize: 100, isActive: true, search: "" })
   const { data: products } = useAllProducts({ page: 1, pageSize: 100 })
   const { mutate: createOperation, isPending } = useCreateOperation()

   const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<OperationCreateForm>({
      resolver: zodResolver(operationCreateSchema),
      defaultValues: { operation_type_id: undefined, product_id: undefined, order: 0 },
   })

   const onSubmit = (values: OperationCreateForm) => {
      createOperation(values, {
         onSuccess: () => {
            reset()
            onClose()
         },
      })
   }

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення операції</Modal.Header>
         <Modal.Content className="flex flex-col gap-4 md:flex-wrap">
            <div className="flex flex-1 flex-col gap-1.5">
               <Modal.Label>Оберіть тип операції</Modal.Label>
               <Controller
                  control={control}
                  name="operation_type_id"
                  render={({ field }) => (
                     <Dropdown className="w-full!">
                        <Dropdown.Button className="w-full">
                           {operationTypes?.items?.find(type => type.id === field.value)?.name ?? "Не обрано"}
                           <Dropdown.Chevron />
                        </Dropdown.Button>
                        <Dropdown.Content>
                           {operationTypes?.items?.map(type => (
                              <Dropdown.Item key={type.id} onClick={() => field.onChange(type.id)}>
                                 {type.name}
                              </Dropdown.Item>
                           ))}
                        </Dropdown.Content>
                     </Dropdown>
                  )}
               />
               <FieldError message={errors.operation_type_id?.message} />
            </div>

            <div className="flex flex-1 flex-col gap-1.5">
               <Modal.Label>Оберіть продукт</Modal.Label>
               <Controller
                  control={control}
                  name="product_id"
                  render={({ field }) => (
                     <Dropdown className="w-full!">
                        <Dropdown.Button className="w-full">
                           {products?.items?.find(product => product.id === field.value)?.code ?? "Не обрано"}
                           <Dropdown.Chevron />
                        </Dropdown.Button>
                        <Dropdown.Content>
                           {products?.items?.map(product => (
                              <Dropdown.Item key={product.id} onClick={() => field.onChange(product.id)}>
                                 {product.code}
                              </Dropdown.Item>
                           ))}
                        </Dropdown.Content>
                     </Dropdown>
                  )}
               />
               <FieldError message={errors.product_id?.message} />
            </div>

            <div className="flex flex-1 flex-col gap-1.5">
               <Modal.Label>Порядок виконання</Modal.Label>
               <Controller
                  control={control}
                  name="order"
                  render={({ field }) => (
                     <input
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        className="w-full rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-4 py-2.5 text-sm text-white outline-none placeholder:text-(--second-color) focus:border-(--stroke-active-color)"
                     />
                  )}
               />
               <FieldError message={errors.order?.message} />
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
