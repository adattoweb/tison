import { DeparmtentBaseSchema, type DepartmentBaseInput } from "@/api/schemas/department"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { useCreateDepartment } from "@/hooks/api/departments/useCreateDepartment"
import { zodResolver } from "@hookform/resolvers/zod"
import { NotebookPenIcon } from "lucide-react"
import { useForm, type SubmitHandler } from "react-hook-form"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddDepartmentModal({ isOpen, setIsOpen }: ModalProps) {
   const { mutate: doCreateDepartment, isPending } = useCreateDepartment()
   const { addToast } = useToast()

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<DepartmentBaseInput>({
      resolver: zodResolver(DeparmtentBaseSchema),
      defaultValues: {
         name: "",
         description: "",
      },
   })

   const onClose = () => {
      reset()
      setIsOpen(false)
   }

   const onSubmit: SubmitHandler<DepartmentBaseInput> = data => {
      doCreateDepartment(data, {
         onSuccess: () => {
            addToast("Успішно створено відділ!", { duration: 3000, type: "success" })
            onClose()
         },
      })
   }
   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Створення департаменту</Modal.Header>
         <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Content>
               <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row w-full gap-2">
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
