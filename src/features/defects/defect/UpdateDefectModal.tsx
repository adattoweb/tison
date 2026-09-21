import { DefectUpdateFormSchema, type DefectUpdateFormInput } from "@/api/schemas/defect"
import type { DefectRead } from "@/api/types/defect"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import Dropdown from "@/components/UI/Dropdown"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { Textarea } from "@/components/UI/Textarea"
import { DEFECT_STATUS } from "@/constants/status"
import { useUpdateDefect } from "@/hooks/api/defects/useUpdateDefect"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { AlignLeftIcon, NotebookPenIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react"
import { Controller, useFieldArray, useForm, type SubmitHandler } from "react-hook-form"

interface UpdateDefectModalProps {
   isOpen: boolean
   defect: DefectRead
   onClose: () => void
   /** Якщо не передано, кнопка "Видалити" не показується */
   onDelete?: () => void
}

const STATUS_KEYS = Object.keys(DEFECT_STATUS) as (keyof typeof DEFECT_STATUS)[]

export function UpdateDefectModal({ isOpen, defect, onClose, onDelete }: UpdateDefectModalProps) {
   const { mutate: doUpdateDefect, isPending } = useUpdateDefect()
   const { addToast } = useToast()

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
         images: (defect.images ?? []).map(value => ({ value })),
      },
   })

   const images = useFieldArray({ control, name: "images" })

   const onSubmit: SubmitHandler<DefectUpdateFormInput> = data => {
      doUpdateDefect(
         {
            id: defect.id,
            payload: {
               title: data.title,
               description: data.description,
               status: data.status,
               images: data.images.map(image => image.value),
               // дату закриття виводимо зі статусу: закритий зберігає стару дату (або отримує поточну), відкритий її скидає
               end_at: data.status === "CLOSE" ? (defect.end_at ?? new Date().toISOString()) : null,
            },
         },
         {
            onSuccess: () => {
               addToast("Успішно оновлено дефект!", { duration: 3000, type: "success" })
               onClose()
            },
         },
      )
   }

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

                  <div className="flex flex-col gap-2 w-full">
                     <div className="flex items-center justify-between gap-2">
                        <p className="text-base font-medium">
                           Зображення{" "}
                           <span className="text-sm font-normal text-(--second-color)">({images.fields.length})</span>
                        </p>
                        <button
                           type="button"
                           onClick={() => images.append({ value: "" })}
                           className="flex items-center gap-1 text-sm cursor-pointer text-(--second-color) hover:text-white transition-colors"
                        >
                           <PlusIcon className="size-4" />
                           Додати
                        </button>
                     </div>

                     {images.fields.length === 0 && <p className="text-sm text-(--second-color)">Зображень немає</p>}

                     {images.fields.map((field, index) => {
                        const error = errors.images?.[index]?.value
                        return (
                           <div key={field.id} className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                 <input
                                    type="url"
                                    placeholder="https://example.com/defect.jpg"
                                    className={clsx(
                                       "w-full h-11 rounded-md border border-(--stroke-color) focus:border-(--stroke-light-color) bg-(--bg-trans-color) py-2 px-2.5 focus:outline-0",
                                       error && "border-red-400!",
                                    )}
                                    {...register(`images.${index}.value`)}
                                 />
                                 <FieldError message={error?.message} />
                              </div>
                              <button
                                 type="button"
                                 onClick={() => images.remove(index)}
                                 aria-label="Видалити"
                                 className="flex items-center justify-center size-11 shrink-0 cursor-pointer text-(--second-color) hover:text-red-400 transition-colors"
                              >
                                 <XIcon className="size-5" />
                              </button>
                           </div>
                        )
                     })}
                  </div>
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
