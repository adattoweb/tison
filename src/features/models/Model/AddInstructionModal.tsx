import { InstructionCreateSchema, type InstructionCreateInput } from "@/api/schemas/instruction"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import Dropdown from "@/components/UI/Dropdown"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { Textarea } from "@/components/UI/Textarea"
import { useAllOperationTypes } from "@/hooks/api/operationTypes/useAllOperationTypes"
import { useCreateInstruction } from "@/hooks/api/instructions/useCreateInstruction"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { ClockIcon, NotebookPenIcon, WrenchIcon } from "lucide-react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { TOAST_DURATION } from "@/constants/app"
import { MultiImageUpload, type ImageItem } from "@/components/UI/MultiImageUpload"
import { useState } from "react"
import { useUploadImage } from "@/hooks/api/media/useUploadImage"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
   modelId: number
}

const MAX_IMAGES = 10

// images завантажуються окремо (через MultiImageUpload + useUploadImage) і підставляються
// в payload вручну, тому виключаємо це поле зі схеми валідації самої форми
const AddInstructionFormSchema = InstructionCreateSchema.omit({ images: true })
type AddInstructionFormInput = Omit<InstructionCreateInput, "images">

export function AddInstructionModal({ isOpen, setIsOpen, modelId }: ModalProps) {
   const { mutate: doCreateInstruction, isPending } = useCreateInstruction()
   const { data: operationTypesData } = useAllOperationTypes({ page: 1, pageSize: 100, is_active: true })
   const { mutateAsync: doUploadImage } = useUploadImage()
   const { addToast } = useToast()

   const [images, setImages] = useState<ImageItem[]>([])
   const [isUploadingImages, setIsUploadingImages] = useState(false)

   const operationTypes = operationTypesData?.items ?? []

   const {
      register,
      handleSubmit,
      reset,
      control,
      formState: { errors },
   } = useForm<AddInstructionFormInput>({
      resolver: zodResolver(AddInstructionFormSchema),
      defaultValues: {
         title: "",
         description: "",
         operation_type_id: undefined,
         planned_time: null,
         product_model_id: modelId,
      },
   })

   const onClose = () => {
      images.forEach(img => URL.revokeObjectURL(img.url))
      setImages([])
      reset()
      setIsOpen(false)
   }

   const onSubmit: SubmitHandler<AddInstructionFormInput> = async data => {
      let uploadedUrls: string[] = []

      if (images.length > 0) {
         setIsUploadingImages(true)
         try {
            const uploaded = await Promise.all(
               images.map(img => doUploadImage({ category: "instructions", file: img.file! })),
            )
            uploadedUrls = uploaded.map(u => u.url)
         } catch {
            addToast("Не вдалося завантажити одне або кілька зображень", { duration: TOAST_DURATION, type: "error" })
            setIsUploadingImages(false)
            return
         }
         setIsUploadingImages(false)
      }

      doCreateInstruction(
         {
            title: data.title,
            description: data.description.trim(),
            operation_type_id: data.operation_type_id,
            product_model_id: data.product_model_id,
            planned_time: data.planned_time,
            images: uploadedUrls,
         },
         {
            onSuccess: () => {
               addToast("Успішно створено інструкцію!", { duration: TOAST_DURATION, type: "success" })
               onClose()
            },
            onError: () => {
               addToast("Не вдалося створити інструкцію", { duration: TOAST_DURATION, type: "error" })
            },
         },
      )
   }

   const isSaving = isUploadingImages || isPending

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення інструкції</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="flex flex-col gap-4">
                  <div className="flex flex-col w-full gap-2">
                     <div className="w-full">
                        <Input
                           label="Назва"
                           Icon={NotebookPenIcon}
                           placeholder="Нанесення паяльної пасти"
                           hasError={!!errors.title}
                           {...register("title")}
                        />
                        <FieldError message={errors.title?.message} />
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
                     <div className="w-full">
                        <Controller
                           name="operation_type_id"
                           control={control}
                           render={({ field }) => {
                              const selected = operationTypes.find(t => t.id === field.value)

                              return (
                                 <div className="flex flex-col gap-1.5 w-full">
                                    <p className="text-base font-medium">Тип операції</p>
                                    <Dropdown className="w-full!">
                                       <Dropdown.Button
                                          className={clsx("w-full h-11", errors.operation_type_id && "border-red-400!")}
                                       >
                                          <span className="flex items-center gap-2 min-w-0">
                                             <WrenchIcon className="size-5 stroke-white shrink-0" strokeWidth={2} />
                                             {selected ? (
                                                <span className="flex items-center gap-2 truncate">
                                                   <span
                                                      className="size-3 rounded-full shrink-0"
                                                      style={{ backgroundColor: selected.color }}
                                                   />
                                                   <span>{selected.name}</span>
                                                </span>
                                             ) : (
                                                <span className="opacity-60 truncate">Оберіть тип операції</span>
                                             )}
                                          </span>
                                          <Dropdown.Chevron />
                                       </Dropdown.Button>
                                       <Dropdown.Content className="z-100!">
                                          {operationTypes.length === 0 && (
                                             <p className="px-3 md:px-4 py-2 opacity-60">Немає типів операцій</p>
                                          )}
                                          {operationTypes.map(type => (
                                             <Dropdown.Item key={type.id} onClick={() => field.onChange(type.id)}>
                                                <span className="flex items-center gap-2">
                                                   <span
                                                      className="size-3 rounded-full shrink-0"
                                                      style={{ backgroundColor: type.color }}
                                                   />
                                                   {type.name}
                                                </span>
                                             </Dropdown.Item>
                                          ))}
                                       </Dropdown.Content>
                                    </Dropdown>
                                 </div>
                              )
                           }}
                        />
                        <FieldError message={errors.operation_type_id?.message} />
                     </div>
                     <div className="w-full">
                        <Input
                           label="Запланований час (хв)"
                           Icon={ClockIcon}
                           placeholder="0"
                           type="number"
                           hasError={!!errors.planned_time}
                           {...register("planned_time", {
                              setValueAs: v => (v === "" || v == null ? null : Number(v)),
                           })}
                        />
                        <FieldError message={errors.planned_time?.message} />
                     </div>
                     <MultiImageUpload
                        images={images}
                        onChange={setImages}
                        maxImages={MAX_IMAGES}
                        disabled={isSaving}
                     />
                  </div>
               </div>
            </Modal.Content>
            <footer className="flex justify-end gap-4">
               <Button type="transparent" onClick={onClose}>
                  <Button.Paragraph>Скасувати</Button.Paragraph>
               </Button>
               <Button type="accentFilled" isSubmit={true} disabled={isSaving}>
                  <Button.Paragraph>{isSaving ? "Створення..." : "Створити"}</Button.Paragraph>
               </Button>
            </footer>
         </form>
      </Modal>
   )
}
