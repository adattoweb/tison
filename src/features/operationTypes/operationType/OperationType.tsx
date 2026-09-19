import { useNavigate, useParams } from "react-router"
import PageHeader from "@/components/UI/PageHeader"
import PageDescription from "@/components/UI/PageDescription"
import { OperationTypeHeader } from "./OperationTypeHeader"
import Button from "@/components/UI/Button"
import { EditIcon, TrashIcon } from "lucide-react"
import { useOperationType } from "@/hooks/api/operationTypes/useOperationType"
import { useState } from "react"
import { UpdateOperationTypesModal } from "./UpdateOperationTypeModal"
import { ConfirmModal } from "@/components/Modal/ConfirmModal"
import { ErrorPage } from "@/components/ErrorPage/ErrorPage"
import { useDeleteOperationType } from "@/hooks/api/operationTypes/useDeleteOperationTypes"
import { operationTypes } from "@/routes/operationTypes"

export function OperationType() {
   const { id } = useParams()
   const { data: type } = useOperationType(Number(id))
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

   const { mutate: doDelete } = useDeleteOperationType(Number(id))
   const navigate = useNavigate()

   const onClose = () => setIsConfirmModalOpen(false)
   const onDelete = () => {
      navigate(`/${operationTypes.path}`)
      doDelete()
   }
   if (type === undefined) return <ErrorPage />
   return (
      <div className="flex flex-col gap-(--components-gap)">
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>{type?.name}</PageHeader>
               <PageDescription>{type?.description}</PageDescription>
            </div>
            <div className="flex gap-4">
               <Button onClick={() => setIsUpdateModalOpen(true)} type="accent" className="h-min">
                  <Button.Icon Icon={EditIcon} />
                  <Button.Paragraph>Редагувати</Button.Paragraph>
               </Button>
               <Button
                  onClick={() => setIsConfirmModalOpen(true)}
                  type="danger"
                  className="h-min bg-(--accent-color) text-black"
               >
                  <Button.Icon Icon={TrashIcon} />
                  <Button.Paragraph>Видалити</Button.Paragraph>
               </Button>
            </div>
         </div>
         <div className="flex gap-(--components-gap) w-full">
            <OperationTypeHeader />
            <UpdateOperationTypesModal type={type} isOpen={isUpdateModalOpen} setIsOpen={setIsUpdateModalOpen} />
            <ConfirmModal
               title="Видалення типу операцій"
               description="Ви впевнені, що хочете видалити тип операції?"
               isOpen={isConfirmModalOpen}
               onClose={onClose}
               onConfirm={onDelete}
            />
         </div>
      </div>
   )
}
