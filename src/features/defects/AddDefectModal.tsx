import { DefectCreateSchema, type DefectCreateInput } from "@/api/schemas/defect"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { MultiImageUpload, type ImageItem } from "@/components/UI/MultiImageUpload"
import { SelectField, type SelectOption } from "@/components/UI/SelectField"
import { Textarea } from "@/components/UI/Textarea"
import { TOAST_DURATION } from "@/constants/app"
import { useCreateDefect } from "@/hooks/api/defects/useCreateDefect"
import { useUploadImage } from "@/hooks/api/media/useUploadImage"
import { useAllOperations } from "@/hooks/api/operations/useAllOperations"
import type { StatusType } from "@/types/status"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlignLeftIcon, NotebookPenIcon } from "lucide-react"
import { useState } from "react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
   operationId?: number
}

const ACTIVE_STATUS = "ACTIVE" as StatusType

const MAX_IMAGES = 10

export function AddDefectModal({ isOpen, setIsOpen, operationId }: ModalProps) {
   const { mutate: doCreateDefect, isPending } = useCreateDefect()
   // Бекенд дозволяє створити дефект лише для операції зі статусом "активна"
   const { data: operationsData } = useAllOperations({ page: 1, pageSize: 100, status: ACTIVE_STATUS })
   const { addToast } = useToast()

   const {
      register,
      handleSubmit,
      reset,
      control,
      formState: { errors },
   } = useForm<DefectCreateInput>({
      resolver: zodResolver(DefectCreateSchema),
      defaultValues: {
         title: "",
         description: "",
         operation_id: operationId,
         images: [],
      },
   })

   const [images, setImages] = useState<ImageItem[]>([])
   const [isUploadingImages, setIsUploadingImages] = useState(false)
   const { mutateAsync: doUploadImage } = useUploadImage()

   const operationOptions: SelectOption[] = (operationsData?.items ?? []).map(operation => ({
      value: operation.id,
      label: [operation.code, operation.operation_type?.name, operation.product?.code].filter(Boolean).join(" · "),
   }))

   const onClose = () => {
      reset()
      setIsOpen(false)
   }

   const onSubmit: SubmitHandler<DefectCreateInput> = async data => {
      let uploadedUrls: string[] = []

      if (images.length > 0) {
         setIsUploadingImages(true)
         try {
            const uploaded = await Promise.all(
               images.map(img => doUploadImage({ category: "defects", file: img.file! })),
            )
            uploadedUrls = uploaded.map(u => u.url)
         } catch {
            addToast("Не вдалося завантажити одне або кілька зображень", { duration: TOAST_DURATION, type: "error" })
            setIsUploadingImages(false)
            return
         }
         setIsUploadingImages(false)
      }
      doCreateDefect(
         {
            title: data.title,
            description: data.description,
            operation_id: data.operation_id,
            images: uploadedUrls,
         },
         {
            onSuccess: () => {
               addToast("Успішно створено дефект!", { duration: TOAST_DURATION, type: "success" })
               onClose()
            },
         },
      )
   }

   const isSaving = isUploadingImages || isPending

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення дефекту</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="flex flex-col w-full gap-2">
                  <div className="w-full">
                     <Controller
                        name="operation_id"
                        control={control}
                        render={({ field }) => (
                           <SelectField
                              label="Операція"
                              placeholder="Оберіть операцію"
                              value={field.value}
                              options={operationOptions}
                              emptyListLabel="Активних операцій немає"
                              hasError={!!errors.operation_id}
                              onChange={field.onChange}
                           />
                        )}
                     />
                     <FieldError message={errors.operation_id?.message} />
                  </div>

                  <div className="w-full">
                     <Input
                        label="Назва"
                        Icon={NotebookPenIcon}
                        placeholder="Холодна пайка"
                        hasError={!!errors.title}
                        {...register("title")}
                     />
                     <FieldError message={errors.title?.message} />
                  </div>

                  <div className="w-full">
                     <Textarea
                        label="Опис"
                        Icon={AlignLeftIcon}
                        placeholder="Опишіть дефект"
                        rows={4}
                        hasError={!!errors.description}
                        {...register("description")}
                     />
                     <FieldError message={errors.description?.message} />
                  </div>

                  <MultiImageUpload images={images} onChange={setImages} maxImages={MAX_IMAGES} disabled={isSaving} />
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
