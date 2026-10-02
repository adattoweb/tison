import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { OperationTypesHeader } from "./OperationTypeHeader"
import { OperationTypesTable } from "./OperationTypeTable"
import Button from "@/components/UI/Button"
import { MonitorCog } from "lucide-react"
import { useState } from "react"
import { AddOperationTypesModal } from "./AddOperationTypeModal"
import { Can } from "@/components/Auth/Can"

export function OperationTypes() {
   const [isOpen, setIsOpen] = useState(false)
   const openModal = () => setIsOpen(true)
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Типи операцій</PageHeader>
               <PageDescription>Створення та редагування типів операцій</PageDescription>
            </div>
            <Can resource="operation_type" action="create">
               <Button onClick={openModal} type="accent" className="h-min">
                  <Button.Icon Icon={MonitorCog} />
                  <Button.Paragraph>Додати тип операції</Button.Paragraph>
               </Button>
            </Can>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <Can resource="analytics" action="read">
               <OperationTypesHeader />
            </Can>
            <OperationTypesTable />
         </div>
         <Can resource="operation_type" action="create">
            <AddOperationTypesModal isOpen={isOpen} setIsOpen={setIsOpen} />
         </Can>
      </>
   )
}
