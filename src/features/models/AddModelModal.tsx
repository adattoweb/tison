import { useState } from "react"
import { ProductModelFormSchema, type ProductModelFormInput } from "@/api/schemas/productModel"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { Textarea } from "@/components/UI/Textarea"
import { MultiImageUpload, type ImageItem } from "@/components/UI/MultiImageUpload"
import { TOAST_DURATION } from "@/constants/app"
import { useCreateProductModel } from "@/hooks/api/productModels/useCreateProductModel"
import { useUploadImage } from "@/hooks/api/media/useUploadImage"
import { zodResolver } from "@hookform/resolvers/zod"
import { NotebookPenIcon, ShapesIcon } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MAX_IMAGES = 10

export function AddModelModal({ isOpen, setIsOpen }: ModalProps) {
   const { mutate: doCreateProductModel, isPending: isCreating } = useCreateProductModel()
   const { mutateAsync: doUploadImage } = useUploadImage()
   const { addToast } = useToast()

   const [images, setImages] = useState<ImageItem[]>([])
   const [isUploadingImages, setIsUploadingImages] = useState(false)

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<ProductModelFormInput>({
      resolver: zodResolver(ProductModelFormSchema),
      defaultValues: {
         title: "",
         type: "",
         description: "",
      },
   })

   const onClose = () => {
      images.forEach(img => URL.revokeObjectURL(img.url))
      setImages([])
      reset()
      setIsOpen(false)
   }

   const onSubmit: SubmitHandler<ProductModelFormInput> = async data => {
      let uploadedUrls: string[] = []

      if (images.length > 0) {
         setIsUploadingImages(true)
         try {
            const uploaded = await Promise.all(
               images.map(img => doUploadImage({ category: "product_models", file: img.file! })),
            )
            uploadedUrls = uploaded.map(u => u.url)
         } catch {
            addToast("Не вдалося завантажити одне або кілька зображень", { duration: TOAST_DURATION, type: "error" })
            setIsUploadingImages(false)
            return
         }
         setIsUploadingImages(false)
      }

      doCreateProductModel(
         {
            title: data.title,
            type: data.type,
            // порожній опис відправляємо як null
            description: data.description?.trim() ? data.description : null,
            images: uploadedUrls,
         },
         {
            onSuccess: () => {
               addToast("Успішно створено модель виробу!", { duration: TOAST_DURATION, type: "success" })
               onClose()
            },
         },
      )
   }

   const isSaving = isUploadingImages || isCreating

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення моделі виробу</Modal.Header>
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
                     {isUploadingImages ? "Завантаження фото..." : isCreating ? "Створення..." : "Створити"}
                  </Button.Paragraph>
               </Button>
            </footer>
         </form>
      </Modal>
   )
}
