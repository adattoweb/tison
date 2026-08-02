import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { EmployeesHeader } from "./EmployeesHeader"
import { EmployeesTable } from "./EmployeesTable"

export function Employees() {
   return (
      <>
         <div>
            <PageHeader>Працівники</PageHeader>
            <PageDescription>Управління персоналом та інформація про працівників</PageDescription>
         </div>
         <div className="flex flex-col gap-(--components-gap)">
            <EmployeesHeader />
            <EmployeesTable />
         </div>
      </>
   )
}
