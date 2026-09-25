import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { DepartmentsTable } from "./DepartmentsTable"
import Button from "@/components/UI/Button"
import { MonitorCog } from "lucide-react"
import { useState } from "react"
import { AddDepartmentModal } from "./AddDepartmentModal"

export function Departments() {
   const [isOpen, setIsOpen] = useState(false)
   const openModal = () => setIsOpen(true)
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Департаменти</PageHeader>
               <PageDescription>Моніторинг та управління відділами системи</PageDescription>
            </div>
            <Button onClick={openModal} type="accent" className="h-min">
               <Button.Icon Icon={MonitorCog} />
               <Button.Paragraph>Додати відділ</Button.Paragraph>
            </Button>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <DepartmentsTable />
         </div>
         <AddDepartmentModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </>
   )
}
