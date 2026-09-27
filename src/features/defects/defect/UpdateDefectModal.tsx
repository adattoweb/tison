import { DefectUpdateFormSchema, type DefectUpdateFormInput } from "@/api/schemas/defect"
import type { DefectRead } from "@/api/types/defect"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import Dropdown from "@/components/UI/Dropdown"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { MultiImageUpload, type ImageItem } from "@/components/UI/MultiImageUpload"
import { Textarea } from "@/components/UI/Textarea"
import { TOAST_DURATION } from "@/constants/app"
import { DEFECT_STATUS } from "@/constants/status"
import { useUpdateDefect } from "@/hooks/api/defects/useUpdateDefect"
import { useUploadImage } from "@/hooks/api/media/useUploadImage"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { AlignLeftIcon, NotebookPenIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"

interface UpdateDefectModalProps {
   isOpen: boolean
   defect: DefectRead
   onClose: () => void
   /** Якщо не передано, кнопка "Видалити" не показується */
   onDelete?: () => void
}

const STATUS_KEYS = Object.keys(DEFECT_STATUS) as (keyof typeof DEFECT_STATUS)[]
const MAX_IMAGES = 10

export function UpdateDefectModal({ isOpen, defect, onClose, onDelete }: UpdateDefectModalProps) {
   const { mutate: doUpdateDefect, isPending } = useUpdateDefect()
   const { addToast } = useToast()
   const [images, setImages] = useState<ImageItem[]>(
      (defect.images ?? []).map(url => ({ id: crypto.randomUUID(), url })),
   )
   const [isUploadingImages, setIsUploadingImages] = useState(false)
   const { mutateAsync: doUploadImage } = useUploadImage()
   console.log(defect)

   const {
      register,
      handleSubmit,
      control,
      formState: { errors },
   } = useForm<DefectUpdateFormInput>({
      resolver: zodResolver(DefectUpdateFormSchema),
      defaultValues: {
         title: defect.title,
         description: defect.description,
         status: defect.status,
      },
   })
   const onSubmit: SubmitHandler<DefectUpdateFormInput> = async data => {
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
      doUpdateDefect(
         {
            id: defect.id,
            payload: {
               title: data.title,
               description: data.description,
               status: data.status,
               images: [...existingUrls, ...uploadedUrls],
               end_at: data.status === "CLOSE" ? (defect.end_at ?? new Date().toISOString()) : null,
            },
         },
         {
            onSuccess: () => {
               addToast("Успішно оновлено дефект!", { duration: TOAST_DURATION, type: "success" })
               onClose()
            },
         },
      )
   }

   const isSaving = isUploadingImages || isPending

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Редагування дефекту {defect.code}</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="flex flex-col w-full gap-2">
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

                  <div className="w-full">
                     <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                           <div className="flex flex-col gap-1.5 w-full">
                              <Modal.Label>Статус</Modal.Label>
                              <Dropdown className="w-full!">
                                 <Dropdown.Button className={clsx("w-full h-11", errors.status && "border-red-400!")}>
                                    <span className={clsx("truncate", DEFECT_STATUS[field.value]?.className)}>
                                       {DEFECT_STATUS[field.value]?.label ?? field.value}
                                    </span>
                                    <Dropdown.Chevron />
                                 </Dropdown.Button>
                                 <Dropdown.Content className="z-100!">
                                    {STATUS_KEYS.map(key => (
                                       <Dropdown.Item key={key} onClick={() => field.onChange(key)}>
                                          {DEFECT_STATUS[key].label}
                                       </Dropdown.Item>
                                    ))}
                                 </Dropdown.Content>
                              </Dropdown>
                           </div>
                        )}
                     />
                     <FieldError message={errors.status?.message} />
                  </div>

                  <MultiImageUpload images={images} onChange={setImages} maxImages={MAX_IMAGES} disabled={isSaving} />
               </div>
            </Modal.Content>

            <footer className="flex flex-col-reverse sm:flex-row sm:items-center gap-2 sm:gap-4">
               {onDelete && (
                  <button
                     type="button"
                     onClick={onDelete}
                     className="flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-[#E06767] transition-colors hover:bg-[#E06767]/10 cursor-pointer sm:mr-auto"
                  >
                     <Trash2Icon size={16} strokeWidth={1.5} />
                     Видалити
                  </button>
               )}
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
