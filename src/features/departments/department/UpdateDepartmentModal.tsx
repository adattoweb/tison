import { DeparmtentBaseSchema, type DepartmentBaseInput } from "@/api/schemas/department"
import type { DepartmentRead } from "@/api/types/department"
import Modal from "@/components/Modal/Modal"
import { useToast } from "@/components/Toast/useToast"
import Button from "@/components/UI/Button"
import { FieldError } from "@/components/UI/FieldError"
import { Input } from "@/components/UI/Input"
import { useUpdateDepartment } from "@/hooks/api/departments/useUpdateDepartment"
import { zodResolver } from "@hookform/resolvers/zod"
import { NotebookPenIcon } from "lucide-react"
import { useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"

interface ModalProps {
   isOpen: boolean
   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
   department: DepartmentRead | undefined
}

export function UpdateDepartmentModal({ department, isOpen, setIsOpen }: ModalProps) {
   const { mutate: doUpdate, isPending } = useUpdateDepartment()
   const { addToast } = useToast()

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<DepartmentBaseInput>({
      resolver: zodResolver(DeparmtentBaseSchema),
      defaultValues: {
         name: undefined,
         description: undefined,
      },
   })

   const onClose = () => {
      setIsOpen(false)
   }

   useEffect(() => {
      if (!department) return
      reset({
         name: department.name,
         description: department.description,
      })
   }, [department, reset])

   const onSubmit: SubmitHandler<DepartmentBaseInput> = data => {
      if (!department) return
      doUpdate(
         {
            id: department.id,
            payload: {
               name: data.name,
               description: data.description ?? null,
            },
         },
         {
            onSuccess: () => {
               addToast("Успішно відредаговано відділ!", { duration: 3000, type: "success" })
               onClose()
            },
         },
      )
   }
   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <Modal.Header>Редагування департаменту</Modal.Header>
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
                  <Button.Paragraph>{isPending ? "Збереження..." : "Зберегти"}</Button.Paragraph>
               </Button>
            </footer>
         </form>
      </Modal>
   )
}
