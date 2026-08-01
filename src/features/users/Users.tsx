import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { UsersHeader } from "./UsersHeader"
import { EmployeesTable } from "./EmployeesTable"

export function Users() {
   return (
      <>
         <div>
            <PageHeader>Працівники</PageHeader>
            <PageDescription>Управління персоналом та інформація про працівників</PageDescription>
         </div>
         <div className="flex flex-col gap-(--components-gap)">
            <UsersHeader />
            <EmployeesTable />
         </div>
      </>
   )
}
