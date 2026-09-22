import { ProductModelFormSchema, type ProductModelFormInput } from "@/api/schemas/productModel"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { Textarea } from "@/components/UI/Textarea"
import { TOAST_DURATION } from "@/constants/app"
import { useCreateProductModel } from "@/hooks/api/productModels/useCreateProductModel"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { NotebookPenIcon, PlusIcon, ShapesIcon, XIcon } from "lucide-react"
import { useFieldArray, useForm, type SubmitHandler } from "react-hook-form"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MAX_IMAGES = 10

export function AddModelModal({ isOpen, setIsOpen }: ModalProps) {
   const { mutate: doCreateProductModel, isPending } = useCreateProductModel()
   const { addToast } = useToast()

   const {
      register,
      handleSubmit,
      reset,
      control,
      formState: { errors },
   } = useForm<ProductModelFormInput>({
      resolver: zodResolver(ProductModelFormSchema),
      defaultValues: {
         title: "",
         type: "",
         description: "",
         images: [],
      },
   })

   const images = useFieldArray({ control, name: "images" })

   const onClose = () => {
      reset()
      setIsOpen(false)
   }

   const onSubmit: SubmitHandler<ProductModelFormInput> = data => {
      doCreateProductModel(
         {
            title: data.title,
            type: data.type,
            // порожній опис відправляємо як null
            description: data.description?.trim() ? data.description : null,
            images: data.images.map(image => image.value),
         },
         {
            onSuccess: () => {
               addToast("Успішно створено модель виробу!", { duration: TOAST_DURATION, type: "success" })
               onClose()
            },
         },
      )
   }

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

                  <div className="flex flex-col gap-2 w-full">
                     <div className="flex items-center justify-between gap-2">
                        <p className="text-base font-medium">
                           Зображення{" "}
                           <span className="text-sm font-normal text-(--second-color)">
                              ({images.fields.length}/{MAX_IMAGES})
                           </span>
                        </p>
                        <button
                           type="button"
                           disabled={images.fields.length >= MAX_IMAGES}
                           onClick={() => images.append({ value: "" })}
                           className="flex items-center gap-1 text-sm cursor-pointer text-(--second-color) hover:text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-(--second-color)"
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
                                    placeholder="https://example.com/image.jpg"
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
