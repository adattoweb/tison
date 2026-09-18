import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { OperationTypesHeader } from "./OperationTypeHeader"
import { OperationTypesTable } from "./OperationTypeTable"
import Button from "@/components/UI/Button"
import { MonitorCog } from "lucide-react"
import { useState } from "react"
import { AddOperationTypesModal } from "./AddOperationTypeModal"

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
            <Button onClick={openModal} type="accent" className="h-min">
               <Button.Icon Icon={MonitorCog} />
               <Button.Paragraph>Додати тип операції</Button.Paragraph>
            </Button>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <OperationTypesHeader />
            <OperationTypesTable />
         </div>
         <AddOperationTypesModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </>
   )
}
