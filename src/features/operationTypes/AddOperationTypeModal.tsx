import { operationTypeSchema, type OperationTypeBaseInput } from "@/api/schemas/operationType"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { useCreateOperationType } from "@/hooks/api/operationTypes/useCreateOperationTypes"
import { zodResolver } from "@hookform/resolvers/zod"
import { HandCoins, NotebookPenIcon, PaletteIcon } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddOperationTypesModal({ isOpen, setIsOpen }: ModalProps) {
   const { mutate: doCreateOperationType, isPending } = useCreateOperationType()
   const { addToast } = useToast()

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<OperationTypeBaseInput>({
      resolver: zodResolver(operationTypeSchema),
      defaultValues: {
         name: "",
         description: "",
         points: 0,
         color: "",
      },
   })

   const onClose = () => {
      reset()
      setIsOpen(false)
   }

   const onSubmit: SubmitHandler<OperationTypeBaseInput> = data => {
      doCreateOperationType(data, {
         onSuccess: () => {
            addToast("Успішно створено відділ!", { duration: 3000, type: "success" })
            onClose()
         },
      })
   }
   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення типу операції</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="flex flex-col gap-4">
                  <div className="flex flex-col w-full gap-2">
                     <div className="w-full">
                        <Input
                           label="Назва"
                           Icon={NotebookPenIcon}
                           placeholder="Відділ пайки"
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
                           placeholder="0.00"
                           type="number"
                           hasError={!!errors.points}
                           {...register("points")}
                        />
                        <FieldError message={errors.points?.message} />
                     </div>
                     <div className="w-full">
                        <Input
                           label="Колір операції"
                           Icon={PaletteIcon}
                           placeholder="#fff"
                           hasError={!!errors.color}
                           type="color"
                           {...register("color")}
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
                  <Button.Paragraph>{isPending ? "Створення..." : "Створити"}</Button.Paragraph>
               </Button>
            </footer>
         </form>
      </Modal>
   )
}
