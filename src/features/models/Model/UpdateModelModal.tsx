import { ProductModelEditSchema, type ProductModelEditInput } from "@/api/schemas/productModel"
import type { ProductModelListRead } from "@/api/types/product_model"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { Textarea } from "@/components/UI/Textarea"
import { useUpdateProductModel } from "@/hooks/api/productModels/useUpdateProductModel"
import { zodResolver } from "@hookform/resolvers/zod"
import { NotebookPenIcon, ShapesIcon } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"

interface UpdateProductModelModalProps {
   isOpen: boolean
   model: ProductModelListRead
   onClose: () => void
}

export function UpdateProductModelModal({ isOpen, model, onClose }: UpdateProductModelModalProps) {
   const { mutate: doUpdateProductModel, isPending } = useUpdateProductModel()
   const { addToast } = useToast()

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<ProductModelEditInput>({
      resolver: zodResolver(ProductModelEditSchema),
      defaultValues: {
         title: model.title,
         type: model.type,
         description: model.description ?? "",
      },
   })

   const onSubmit: SubmitHandler<ProductModelEditInput> = data => {
      doUpdateProductModel(
         {
            id: model.id,
            payload: {
               // змінюємо лише ці три поля
               title: data.title,
               type: data.type,
               description: data.description?.trim() ? data.description : null,
               // решту передаємо як є, бо бекенд вимагає повний payload
               images: model.images ?? [],
            },
         },
         {
            onSuccess: () => {
               addToast("Успішно оновлено модель виробу!", { duration: 3000, type: "success" })
               onClose()
            },
         },
      )
   }

   return (
      <>
         <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Header>Редагування моделі</Modal.Header>
            <form onSubmit={handleSubmit(onSubmit)}>
               <Modal.Content>
                  <div className="flex flex-col w-full gap-2">
                     <div className="w-full">
                        <Input
                           label="Назва"
                           Icon={NotebookPenIcon}
                           placeholder="Плата керування V4"
                           hasError={!!errors.title}
                           {...register("title")}
                        />
                        <FieldError message={errors.title?.message} />
                     </div>
                     <div className="w-full">
                        <Input
                           label="Тип"
                           Icon={ShapesIcon}
                           placeholder="Плата керування"
                           hasError={!!errors.type}
                           {...register("type")}
                        />
                        <FieldError message={errors.type?.message} />
                     </div>
                     <div className="w-full">
                        <Textarea
                           label="Опис"
                           Icon={NotebookPenIcon}
                           placeholder="Опис"
                           rows={5}
                           hasError={!!errors.description}
                           {...register("description")}
                        />
                        <FieldError message={errors.description?.message} />
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
      </>
   )
}
