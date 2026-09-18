import { useNavigate, useParams } from "react-router"
import PageHeader from "@/components/UI/PageHeader"
import PageDescription from "@/components/UI/PageDescription"
import { DepartmentHeader } from "./DepartmentHeader"
import Button from "@/components/UI/Button"
import { mockClick } from "@/utils/mockClick"
import { EditIcon, TrashIcon } from "lucide-react"
import { useDepartment } from "@/hooks/api/departments/useDepatment"
import { UpdateDepartmentModal } from "./UpdateDepartmentModal"
import { useState } from "react"
import { ConfirmModal } from "@/components/Modal/ConfirmModal"
import { useDeleteDepartment } from "@/hooks/api/departments/useDeleteDepartment"
import { ErrorPage } from "@/components/ErrorPage/ErrorPage"

export function Department() {
   const { id } = useParams()
   const { data: department } = useDepartment(Number(id))
   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
   const { mutate: doDelete } = useDeleteDepartment(Number(id))
   const navigate = useNavigate()
   function onDelete() {
      setIsConfirmModalOpen(false)
      navigate("/departments")
   }
   if (department === undefined) return <ErrorPage />
   return (
      <div className="flex flex-col gap-(--components-gap)">
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>{department?.name}</PageHeader>
               <PageDescription>{department?.description}</PageDescription>
            </div>
            <div className="flex gap-4">
               <Button onClick={() => setIsEditModalOpen(true)} type="accent" className="h-min">
                  <Button.Icon Icon={EditIcon} />
                  <Button.Paragraph>Редагувати</Button.Paragraph>
               </Button>
               <Button
                  onClick={() => setIsConfirmModalOpen(true)}
                  type="danger"
                  className="h-min bg-(--accent-color) text-black"
               >
                  <Button.Icon Icon={TrashIcon} className="" />
                  <Button.Paragraph>Видалити</Button.Paragraph>
               </Button>
            </div>
         </div>
         <div className="flex gap-(--components-gap) w-full">
            <DepartmentHeader />
            <UpdateDepartmentModal isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen} department={department} />
            <ConfirmModal
               title="Видалити департамент"
               description="Ви впевнені, що хочете видалити департамент?"
               isOpen={isConfirmModalOpen}
               onClose={onDelete}
               onConfirm={doDelete}
            />
         </div>
      </div>
   )
}
