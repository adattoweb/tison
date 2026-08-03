import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { OperationsHeader } from "./OperationsHeader"
import { OperationsTable } from "./OperationsTable"

export function Operations() {
   return (
      <>
         <div>
            <PageHeader>Операції</PageHeader>
            <PageDescription>Список усіх операцій та їх поточний статус</PageDescription>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <OperationsHeader />
            <OperationsTable />
         </div>
      </>
   )
}
