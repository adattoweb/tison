import { InstructionEditFormSchema, type InstructionEditFormInput } from "@/api/schemas/instruction"
import type {
   InstructionCheckpoints,
   InstructionDetails,
   InstructionListRead,
   InstructionSteps,
} from "@/api/types/instruction"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import Dropdown from "@/components/UI/Dropdown"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { Textarea } from "@/components/UI/Textarea"
import { TOAST_DURATION } from "@/constants/app"
import { useUpdateInstruction } from "@/hooks/api/instructions/useUpdateInstruction"
import { useDeleteInstruction } from "@/hooks/api/instructions/useDeleteInstruction"
import { useAllOperationTypes } from "@/hooks/api/operationTypes/useAllOperationTypes"
import { useUploadImage } from "@/hooks/api/media/useUploadImage"
import { titleClassName } from "@/utils/classNames"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { ClockIcon, EditIcon, NotebookPenIcon, PlusIcon, Trash2Icon, WrenchIcon, XIcon } from "lucide-react"
import { useState } from "react"
import { Controller, useFieldArray, useForm, type SubmitHandler } from "react-hook-form"
import { MultiImageUpload, type ImageItem } from "@/components/UI/MultiImageUpload"
import { ImageGalleryModal } from "@/components/UI/ImageGalleryModal"
import { ConfirmModal } from "@/components/Modal/ConfirmModal"
import { Can } from "@/components/Auth/Can"

const MAX_IMAGES = 10

interface InstructionProps {
   steps: InstructionSteps | undefined
}

function Instructions({ steps }: InstructionProps) {
   if (steps === undefined) return
   return (
      <div className="flex flex-col gap-3 flex-1">
         <h3 className="text-white font-medium text-base xl:text-lg">Інструкція виконання</h3>
         <div className="flex flex-col gap-2.5">
            {steps !== null ? (
               steps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                     <span className="text-(--second-color) shrink-0">{index + 1}.</span>
                     <span className="text-(--second-color)">{step}</span>
                  </div>
               ))
            ) : (
               <p className="text-(--second-color)">Інструкцій виконання немає</p>
            )}
         </div>
      </div>
   )
}

interface ParametersProps {
   details: InstructionDetails | undefined
}

function Parameters({ details }: ParametersProps) {
   if (details === undefined) return
   return (
      <div className="flex flex-col gap-3 flex-1">
         <h3 className="text-white font-medium text-base xl:text-lg">Параметри операції</h3>
         <div className="flex flex-col gap-2.5">
            {details ? (
               details.map((param, id) => (
                  <div key={id} className="flex gap-2">
                     <span className="text-(--second-color) shrink-0">{Object.keys(param)}</span>
                     <span className="text-white font-medium">{Object.values(param)}</span>
                  </div>
               ))
            ) : (
               <p className="text-(--second-color)">Параметрів операції немає</p>
            )}
         </div>
      </div>
   )
}

interface CheckpointsProps {
   checkpoints: InstructionCheckpoints | undefined
}

function Checkpoints({ checkpoints }: CheckpointsProps) {
   if (checkpoints === undefined) return
   return (
      <div className="flex flex-col gap-3">
         <h3 className="text-white font-medium text-base xl:text-lg">Контрольні точки</h3>
         <div className="flex gap-2 flex-wrap">
            {checkpoints ? (
               checkpoints.map(point => (
                  <span
                     key={point}
                     className="text-(--accent-color) bg-(--accent-trans-color) border border-(--accent-color) rounded-md px-3 py-1 text-sm font-medium"
                  >
                     {point}
                  </span>
               ))
            ) : (
               <p className="text-(--second-color)">Контрольних точок немає</p>
            )}
         </div>
      </div>
   )
}

interface StepImagesProps {
   images: string[] | undefined
}

function StepImages({ images }: StepImagesProps) {
   const [galleryIndex, setGalleryIndex] = useState<number | null>(null)

   if (!images || images.length === 0) return null

   return (
      <div className="flex flex-col gap-2">
         <h2 className="font-medium text-lg">Зображення</h2>
         <div className="flex flex-wrap gap-2">
            {images.map((src, index) => (
               <img
                  key={src + index}
                  src={src}
                  alt={`Зображення ${index + 1}`}
                  onClick={() => setGalleryIndex(index)}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border border-(--stroke-color) cursor-pointer hover:opacity-80 transition-opacity"
               />
            ))}
         </div>

         <ImageGalleryModal
            images={images}
            initialIndex={galleryIndex ?? 0}
            isOpen={galleryIndex !== null}
            onClose={() => setGalleryIndex(null)}
         />
      </div>
   )
}

const cardClassName =
   "flex flex-col gap-(--components-gap) ibm-plex-sans border border-(--stroke-color) rounded-lg px-(--components-py) py-(--components-py) flex-1"

const fieldClassName =
   "w-full rounded-md border border-(--stroke-color) focus:border-(--stroke-light-color) bg-(--bg-trans-color) py-2 px-2.5 focus:outline-0"

interface ActiveStepProps {
   step: InstructionListRead | undefined
   onDeleted?: () => void
}

export function ActiveStep({ step, onDeleted }: ActiveStepProps) {
   const [editingStepId, setEditingStepId] = useState<number | null>(null)
   const isEditing = editingStepId === step?.id

   if (isEditing) {
      return (
         <ActiveStepForm
            key={step.id}
            step={step}
            onClose={() => setEditingStepId(null)}
            onDeleted={() => {
               setEditingStepId(null)
               onDeleted?.()
            }}
         />
      )
   }

   return (
      <div className={cardClassName}>
         <div className="flex justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
               {step !== undefined ? (
                  <>
                     <h2 className={titleClassName}>{step?.title}</h2>
                     <p className="text-(--second-color)">Тип операції: {step?.operation_type.name ?? null}</p>
                     <p className="text-(--second-color)">{step?.operation_type?.description ?? null}</p>
                     {step?.planned_time !== null && (
                        <p className="text-(--second-color)">Запланований час: {step?.planned_time ?? null} хв</p>
                     )}
                     {step.description && <p className="wrap-break-word whitespace-pre-line">{step.description}</p>}
                  </>
               ) : (
                  <h2 className={titleClassName}>Немає інструкцій</h2>
               )}
            </div>
            {step !== undefined && (
               <EditIcon
                  strokeWidth={1.5}
                  className="cursor-pointer shrink-0"
                  onClick={() => setEditingStepId(step?.id)}
               />
            )}
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <div className="flex flex-col xl:flex-row gap-(--components-gap)">
               <Parameters details={step?.details} />
               <Instructions steps={step?.steps} />
            </div>
         </div>
         <Checkpoints checkpoints={step?.checkpoints} />
         <StepImages images={step?.images} />
      </div>
   )
}

function toFormValues(step: InstructionListRead): Omit<InstructionEditFormInput, "images"> {
   return {
      title: step.title,
      description: step.description ?? "",
      operation_type_id: step.operation_type_id,
      planned_time: step.planned_time ?? null,
      // якщо в одному записі кілька ключів, розгортаємо їх в окремі рядки
      details: (step.details ?? []).flatMap(record =>
         Object.entries(record).map(([key, value]) => ({ key, value: String(value) })),
      ),
      steps: (step.steps ?? []).map(value => ({ value })),
      checkpoints: (step.checkpoints ?? []).map(value => ({ value })),
   }
}

// вже завантажені зображення кроку показуємо в MultiImageUpload як готові превʼю без file
function toImageItems(step: InstructionListRead): ImageItem[] {
   return (step.images ?? []).map(url => ({ url, file: undefined }))
}

function SectionHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
   return (
      <div className="flex items-center justify-between gap-2">
         <p className="text-base font-medium">{title}</p>
         <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-1 text-sm cursor-pointer text-(--second-color) hover:text-white transition-colors"
         >
            <PlusIcon className="size-4" />
            Додати
         </button>
      </div>
   )
}

function RemoveButton({ onClick }: { onClick: () => void }) {
   return (
      <button
         type="button"
         onClick={onClick}
         aria-label="Видалити"
         className="flex items-center justify-center size-11 shrink-0 cursor-pointer text-(--second-color) hover:text-red-400 transition-colors"
      >
         <XIcon className="size-5" />
      </button>
   )
}

interface ActiveStepFormProps {
   step: InstructionListRead
   onClose: () => void
   onDeleted: () => void
}

// схема форми без images: зображеннями керуємо окремим стейтом + MultiImageUpload
const ActiveStepFormSchema = InstructionEditFormSchema.omit({ images: true })
type ActiveStepFormInput = Omit<InstructionEditFormInput, "images">

function ActiveStepForm({ step, onClose, onDeleted }: ActiveStepFormProps) {
   const { mutate: doUpdateInstruction, isPending } = useUpdateInstruction()
   const { mutateAsync: doDeleteInstruction, isPending: isDeleting } = useDeleteInstruction()
   const { data: operationTypesData } = useAllOperationTypes({ page: 1, pageSize: 100, is_active: true })
   const { mutateAsync: doUploadImage } = useUploadImage()
   const { addToast } = useToast()

   const [images, setImages] = useState<ImageItem[]>(() => toImageItems(step))
   const [isUploadingImages, setIsUploadingImages] = useState(false)
   const [isConfirmOpen, setIsConfirmOpen] = useState(false)

   const operationTypes = operationTypesData?.items ?? []

   const {
      register,
      handleSubmit,
      control,
      formState: { errors },
   } = useForm<ActiveStepFormInput>({
      resolver: zodResolver(ActiveStepFormSchema),
      defaultValues: toFormValues(step),
   })

   const details = useFieldArray({ control, name: "details" })
   const steps = useFieldArray({ control, name: "steps" })
   const checkpoints = useFieldArray({ control, name: "checkpoints" })

   const handleClose = () => {
      // прибираємо object URL-и, створені для превʼю ще не завантажених файлів
      images.forEach(img => {
         if (img.file) URL.revokeObjectURL(img.url)
      })
      onClose()
   }

   // ConfirmModal сам викликає onClose одразу після onConfirm, тому тут лише видалення
   const handleDelete = async () => {
      try {
         await doDeleteInstruction(step.id)
         addToast("Інструкцію видалено", { duration: TOAST_DURATION, type: "success" })
         onDeleted()
      } catch {
         addToast("Не вдалося видалити інструкцію", { duration: TOAST_DURATION, type: "error" })
      }
   }

   const onSubmit: SubmitHandler<ActiveStepFormInput> = async data => {
      let finalImageUrls: string[] = []

      if (images.length > 0) {
         setIsUploadingImages(true)
         try {
            finalImageUrls = await Promise.all(
               images.map(async img => {
                  // вже завантажене зображення — просто лишаємо його url
                  if (!img.file) return img.url
                  const uploaded = await doUploadImage({ category: "instructions", file: img.file })
                  return uploaded.url
               }),
            )
         } catch {
            addToast("Не вдалося завантажити одне або кілька зображень", { duration: TOAST_DURATION, type: "error" })
            setIsUploadingImages(false)
            return
         }
         setIsUploadingImages(false)
      }

      doUpdateInstruction(
         {
            id: step.id,
            payload: {
               title: data.title,
               description: data.description,
               operation_type_id: data.operation_type_id,
               planned_time: data.planned_time,
               order: step.order, // порядок не редагуємо, беремо поточний
               images: finalImageUrls,
               details: data.details.map(d => ({ [d.key]: d.value })),
               steps: data.steps.map(s => s.value),
               checkpoints: data.checkpoints.map(c => c.value),
            },
         },
         {
            onSuccess: () => {
               addToast("Успішно оновлено інструкцію!", { duration: TOAST_DURATION, type: "success" })
               onClose()
            },
            onError: () => {
               addToast("Не вдалося оновити інструкцію", { duration: TOAST_DURATION, type: "error" })
            },
         },
      )
   }

   const isSaving = isUploadingImages || isPending || isDeleting

   return (
      <>
         <form onSubmit={handleSubmit(onSubmit)} className={cardClassName}>
            {/* Основне */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-(--components-gap) gap-y-2">
               <div className="md:col-span-2">
                  <Input
                     label="Назва"
                     Icon={NotebookPenIcon}
                     placeholder="Нанесення паяльної пасти"
                     hasError={!!errors.title}
                     {...register("title")}
                  />
                  <FieldError message={errors.title?.message} />
               </div>

               <div>
                  <Controller
                     name="operation_type_id"
                     control={control}
                     render={({ field }) => {
                        // якщо поточний тип став неактивним, його немає в списку, тому беремо зі step
                        const selected =
                           operationTypes.find(t => t.id === field.value) ??
                           (field.value === step.operation_type_id ? step.operation_type : undefined)

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
                                             <span className="truncate">{selected.name}</span>
                                          </span>
                                       ) : (
                                          <span className="opacity-60 truncate">Оберіть тип операції</span>
                                       )}
                                    </span>
                                    <Dropdown.Chevron />
                                 </Dropdown.Button>
                                 <Dropdown.Content>
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

               <div>
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

               <div className="md:col-span-2">
                  <Textarea
                     label="Опис"
                     Icon={NotebookPenIcon}
                     placeholder="Опис"
                     hasError={!!errors.description}
                     {...register("description")}
                  />
                  <FieldError message={errors.description?.message} />
               </div>

               <div className="md:col-span-2">
                  <MultiImageUpload images={images} onChange={setImages} maxImages={MAX_IMAGES} disabled={isSaving} />
               </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-(--components-gap)">
               {/* Параметри: власні назви й значення */}
               <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <SectionHeader title="Параметри" onAdd={() => details.append({ key: "", value: "" })} />
                  {details.fields.length === 0 && <p className="text-sm text-(--second-color)">Параметрів немає</p>}
                  {details.fields.map((field, index) => {
                     const rowErrors = errors.details?.[index]
                     return (
                        <div key={field.id} className="flex flex-col gap-1">
                           <div className="flex items-start gap-2">
                              <div className="flex flex-col sm:flex-row gap-2 flex-1 min-w-0">
                                 <div className="flex-1 min-w-0">
                                    <input
                                       placeholder="Назва (напр. Температура)"
                                       className={clsx(fieldClassName, "h-11", rowErrors?.key && "border-red-400!")}
                                       {...register(`details.${index}.key`)}
                                    />
                                    <FieldError message={rowErrors?.key?.message} />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <input
                                       placeholder="Значення (напр. 250 °C)"
                                       className={clsx(fieldClassName, "h-11", rowErrors?.value && "border-red-400!")}
                                       {...register(`details.${index}.value`)}
                                    />
                                    <FieldError message={rowErrors?.value?.message} />
                                 </div>
                              </div>
                              <RemoveButton onClick={() => details.remove(index)} />
                           </div>
                        </div>
                     )
                  })}
               </div>

               {/* Кроки */}
               <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <SectionHeader title="Кроки" onAdd={() => steps.append({ value: "" })} />
                  {steps.fields.length === 0 && <p className="text-sm text-(--second-color)">Кроків немає</p>}
                  {steps.fields.map((field, index) => (
                     <div key={field.id} className="flex items-start gap-2">
                        <span className="flex items-center justify-center h-11 w-6 shrink-0 text-(--second-color)">
                           {index + 1}.
                        </span>
                        <div className="flex-1 min-w-0">
                           <textarea
                              rows={2}
                              placeholder="Опишіть крок"
                              className={clsx(
                                 fieldClassName,
                                 "resize-none",
                                 errors.steps?.[index]?.value && "border-red-400!",
                              )}
                              {...register(`steps.${index}.value`)}
                           />
                           <FieldError message={errors.steps?.[index]?.value?.message} />
                        </div>
                        <RemoveButton onClick={() => steps.remove(index)} />
                     </div>
                  ))}
               </div>
            </div>

            {/* Контрольні точки */}
            <div className="flex flex-col gap-2">
               <SectionHeader title="Контрольні точки" onAdd={() => checkpoints.append({ value: "" })} />
               {checkpoints.fields.length === 0 && <p className="text-sm text-(--second-color)">Точок немає</p>}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-(--components-gap) gap-y-2">
                  {checkpoints.fields.map((field, index) => (
                     <div key={field.id} className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                           <input
                              placeholder="Напр. Якість пайки"
                              className={clsx(
                                 fieldClassName,
                                 "h-11",
                                 errors.checkpoints?.[index]?.value && "border-red-400!",
                              )}
                              {...register(`checkpoints.${index}.value`)}
                           />
                           <FieldError message={errors.checkpoints?.[index]?.value?.message} />
                        </div>
                        <RemoveButton onClick={() => checkpoints.remove(index)} />
                     </div>
                  ))}
               </div>
            </div>

            <footer className="flex flex-col-reverse sm:flex-row sm:items-center gap-2 sm:gap-4">
               <Can resource="instruction" action="delete">
                  <Button
                     type="danger"
                     disabled={isSaving}
                     onClick={() => setIsConfirmOpen(true)}
                     className="flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed sm:mr-auto"
                  >
                     <Trash2Icon className="size-4" strokeWidth={1.5} />
                     Видалити інструкцію
                  </Button>
               </Can>
               <Button type="transparent" onClick={handleClose}>
                  <Button.Paragraph>Скасувати</Button.Paragraph>
               </Button>
               <Button type="accentFilled" isSubmit={true} disabled={isSaving}>
                  <Button.Paragraph>{isSaving ? "Збереження..." : "Зберегти"}</Button.Paragraph>
               </Button>
            </footer>
         </form>

         {/* Модалка поза формою, щоб клік у ній не спричинив submit */}
         <Can resource="instruction" action="delete">
            <ConfirmModal
               isOpen={isConfirmOpen}
               onClose={() => setIsConfirmOpen(false)}
               onConfirm={handleDelete}
               title="Видалити інструкцію?"
               description={`Крок «${step.title}» буде видалено без можливості відновлення.`}
               confirmLabel="Видалити"
               cancelLabel="Скасувати"
            />
         </Can>
      </>
   )
}
