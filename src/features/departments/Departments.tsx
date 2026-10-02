import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { DepartmentsTable } from "./DepartmentsTable"
import Button from "@/components/UI/Button"
import { MonitorCog } from "lucide-react"
import { useState } from "react"
import { AddDepartmentModal } from "./AddDepartmentModal"
import { Can } from "@/components/Auth/Can"

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
            <Can resource="department" action="create">
               <Button onClick={openModal} type="accent" className="h-min">
                  <Button.Icon Icon={MonitorCog} />
                  <Button.Paragraph>Додати відділ</Button.Paragraph>
               </Button>
            </Can>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <DepartmentsTable />
         </div>
         <Can resource="department" action="create">
            <AddDepartmentModal isOpen={isOpen} setIsOpen={setIsOpen} />
         </Can>
      </>
   )
}
