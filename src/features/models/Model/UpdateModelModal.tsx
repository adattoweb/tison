import { useState } from "react"
import { ProductModelEditSchema, type ProductModelEditInput } from "@/api/schemas/productModel"
import type { ProductModelListRead } from "@/api/types/product_model"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { Textarea } from "@/components/UI/Textarea"
import { MultiImageUpload, type ImageItem } from "@/components/UI/MultiImageUpload"
import { TOAST_DURATION } from "@/constants/app"
import { useUpdateProductModel } from "@/hooks/api/productModels/useUpdateProductModel"
import { useUploadImage } from "@/hooks/api/media/useUploadImage"
import { zodResolver } from "@hookform/resolvers/zod"
import { NotebookPenIcon, ShapesIcon } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"

interface UpdateProductModelModalProps {
   isOpen: boolean
   model: ProductModelListRead
   onClose: () => void
}

const MAX_IMAGES = 10

export function UpdateProductModelModal({ isOpen, model, onClose }: UpdateProductModelModalProps) {
   const { mutate: doUpdateProductModel, isPending: isUpdating } = useUpdateProductModel()
   const { mutateAsync: doUploadImage } = useUploadImage()
   const { addToast } = useToast()

   // існуючі URL одразу кладемо в той самий список, що й нові файли — без file, лише url
   const [images, setImages] = useState<ImageItem[]>(
      (model.images ?? []).map(url => ({ id: crypto.randomUUID(), url })),
   )
   const [isUploadingImages, setIsUploadingImages] = useState(false)

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

   const onSubmit: SubmitHandler<ProductModelEditInput> = async data => {
      // ті, що вже мали URL з сервера (без file) — лишаються як є
      const existingUrls = images.filter(img => !img.file).map(img => img.url)
      // нові файли — заливаємо на сервер
      const newFiles = images.filter((img): img is ImageItem & { file: File } => !!img.file)

      let uploadedUrls: string[] = []
      if (newFiles.length > 0) {
         setIsUploadingImages(true)
         try {
            const uploaded = await Promise.all(
               newFiles.map(img => doUploadImage({ category: "product_models", file: img.file })),
            )
            uploadedUrls = uploaded.map(u => u.url)
         } catch {
            addToast("Не вдалося завантажити одне або кілька зображень", { duration: TOAST_DURATION, type: "error" })
            setIsUploadingImages(false)
            return
         }
         setIsUploadingImages(false)
      }

      doUpdateProductModel(
         {
            id: model.id,
            payload: {
               title: data.title,
               type: data.type,
               description: data.description?.trim() ? data.description : null,
               images: [...existingUrls, ...uploadedUrls],
            },
         },
         {
            onSuccess: () => {
               addToast("Успішно оновлено модель виробу!", { duration: TOAST_DURATION, type: "success" })
               onClose()
            },
         },
      )
   }

   const isSaving = isUploadingImages || isUpdating

   return (
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

                  <MultiImageUpload images={images} onChange={setImages} maxImages={MAX_IMAGES} disabled={isSaving} />
               </div>
            </Modal.Content>
            <footer className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
               <Button type="transparent" onClick={onClose} disabled={isSaving}>
                  <Button.Paragraph>Скасувати</Button.Paragraph>
               </Button>
               <Button type="accentFilled" isSubmit={true} disabled={isSaving}>
                  <Button.Paragraph>
                     {isUploadingImages ? "Завантаження фото..." : isUpdating ? "Збереження..." : "Зберегти"}
                  </Button.Paragraph>
               </Button>
            </footer>
         </form>
      </Modal>
   )
}
