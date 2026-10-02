import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { EmployeesHeader } from "./EmployeesHeader"
import { EmployeesTable } from "./EmployeesTable"
import Button from "@/components/UI/Button"
import { UserPlus } from "lucide-react"
import { AddEmployeeModal } from "./AddEmployeeModal"
import { useState } from "react"
import { Can } from "@/components/Auth/Can"

export function Employees() {
   const [isOpen, setIsOpen] = useState(false)
   const openModal = () => setIsOpen(true)
   return (
      <>
         <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex flex-col">
               <PageHeader>Працівники</PageHeader>
               <PageDescription>Управління персоналом та інформація про працівників</PageDescription>
            </div>
            <Can resource="user" action="create">
               <Button onClick={openModal} type="accent" className="h-min">
                  <Button.Icon Icon={UserPlus} />
                  <Button.Paragraph>Додати працівника</Button.Paragraph>
               </Button>
            </Can>
         </div>
         <div className="flex flex-col gap-(--components-gap)">
            <Can resource="analytics" action="read">
               <EmployeesHeader />
            </Can>
            <EmployeesTable />
         </div>
         <Can resource="user" action="create">
            <AddEmployeeModal isOpen={isOpen} setIsOpen={setIsOpen} />
         </Can>
      </>
   )
}
