import { operationTypeSchema, type OperationTypeBaseInput } from "@/api/schemas/operationType"
import type { OperationTypeRead } from "@/api/types/operationType"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import { ColorInput } from "@/components/UI/ColorInput"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { useUpdateOperationType } from "@/hooks/api/operationTypes/useUpdateOperationTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import { HandCoins, NotebookPenIcon, PaletteIcon } from "lucide-react"
import { useEffect } from "react"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"

interface ModalProps {
   type: OperationTypeRead
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function UpdateOperationTypesModal({ type, isOpen, setIsOpen }: ModalProps) {
   const { mutate: doUpdate, isPending } = useUpdateOperationType()
   const { addToast } = useToast()

   const {
      register,
      handleSubmit,
      reset,
      control,
      formState: { errors },
   } = useForm<OperationTypeBaseInput>({
      resolver: zodResolver(operationTypeSchema),
   })

   const onClose = () => {
      setIsOpen(false)
   }

   useEffect(() => {
      if (!type) return
      reset({
         name: type.name,
         description: type.description,
         points: type.points,
         color: type.color,
      })
   }, [type, reset])

   const onSubmit: SubmitHandler<OperationTypeBaseInput> = data => {
      doUpdate(
         {
            id: type.id,
            payload: {
               name: data.name,
               description: data.description ?? null,
               points: data.points,
               color: data.color,
            },
         },
         {
            onSuccess: () => {
               addToast("Успішно відредаговано тип операції!", { duration: 3000, type: "success" })
               onClose()
            },
         },
      )
   }
   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Редагування типу операції</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="flex flex-col gap-4">
                  <div className="flex flex-col w-full gap-2">
                     <div className="w-full">
                        <Input
                           label="Назва"
                           Icon={NotebookPenIcon}
                           placeholder="Пайка"
                           hasError={!!errors.name}
                           {...register("name")}
                        />
                        <FieldError message={errors.name?.message} />
                     </div>
                     <div className="w-full">
                        <Input
                           label="Опис"
                           Icon={NotebookPenIcon}
                           placeholder="Опис"
                           hasError={!!errors.description}
                           {...register("description")}
                        />
                        <FieldError message={errors.description?.message} />
                     </div>
                     <div className="w-full">
                        <Input
                           label="Кількість балів"
                           Icon={HandCoins}
                           placeholder="0"
                           type="number"
                           hasError={!!errors.points}
                           {...register("points", { valueAsNumber: true })}
                        />
                        <FieldError message={errors.points?.message} />
                     </div>
                     <div className="w-full">
                        <Controller
                           name="color"
                           control={control}
                           render={({ field }) => (
                              <ColorInput
                                 label="Колір операції"
                                 Icon={PaletteIcon}
                                 value={field.value}
                                 onChange={field.onChange}
                                 onBlur={field.onBlur}
                                 name={field.name}
                                 ref={field.ref}
                                 hasError={!!errors.color}
                              />
                           )}
                        />
                        <FieldError message={errors.color?.message} />
                     </div>
                  </div>
               </div>
            </Modal.Content>
            <footer className="flex justify-end gap-4">
               <Button type="transparent" onClick={onClose}>
                  <Button.Paragraph>Скасувати</Button.Paragraph>
               </Button>
               <Button type="accentFilled" isSubmit={true}>
                  <Button.Paragraph>{isPending ? "Збереження" : "Зберегти"}</Button.Paragraph>
               </Button>
            </footer>
         </form>
      </Modal>
   )
}
