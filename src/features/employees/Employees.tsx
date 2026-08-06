import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { EmployeesHeader } from "./EmployeesHeader"
import { EmployeesTable } from "./EmployeesTable"
import Button from "@/components/UI/Button"
import { UserPlus } from "lucide-react"
import { mockClick } from "@/utils/mockClick"

export function Employees() {
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Працівники</PageHeader>
               <PageDescription>Управління персоналом та інформація про працівників</PageDescription>
            </div>
            <Button onClick={mockClick} type="accent" className="h-min">
               <Button.Icon Icon={UserPlus} />
               <Button.Paragraph>Додати працівника</Button.Paragraph>
            </Button>
         </div>
         <div className="flex flex-col gap-(--components-gap)">
            <EmployeesHeader />
            <EmployeesTable />
         </div>
      </>
   )
}
