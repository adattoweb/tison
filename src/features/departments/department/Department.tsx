import { useParams } from "react-router"
import PageHeader from "@/components/UI/PageHeader"
import PageDescription from "@/components/UI/PageDescription"
import { DepartmentHeader } from "./DepartmentHeader"
import Button from "@/components/UI/Button"
import { mockClick } from "@/utils/mockClick"
import { EditIcon, TrashIcon } from "lucide-react"
import { useDepartment } from "@/hooks/api/departments/useDepatment"
import { EditDepartmentModal } from "./EditDepartmentModal"
import { useState } from "react"

export function Department() {
   const { id } = useParams()
   const { data: department } = useDepartment(Number(id))
   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
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
               <Button onClick={mockClick} type="danger" className="h-min bg-(--accent-color) text-black">
                  <Button.Icon Icon={TrashIcon} className="" />
                  <Button.Paragraph>Видалити</Button.Paragraph>
               </Button>
            </div>
         </div>
         <div className="flex gap-(--components-gap) w-full">
            <DepartmentHeader />
            <EditDepartmentModal isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen} department={department} />
         </div>
      </div>
   )
}
