import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { OperationsHeader } from "./OperationsHeader"
import { OperationsTable } from "./OperationsTable"
import { Can } from "@/components/Auth/Can"

export function Operations() {
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Операції</PageHeader>
               <PageDescription>Список усіх операцій та їх поточний статус</PageDescription>
            </div>
            {/* <Button onClick={() => setIsOpen(true)} type="accent" className="h-min">
               <Button.Icon Icon={PackagePlus} />
               <Button.Paragraph>Додати операцію</Button.Paragraph>
            </Button> */}
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <Can resource="analytics" action="read">
               <OperationsHeader />
            </Can>
            <OperationsTable />
            {/* <AddOperationModal isOpen={isOpen} setIsOpen={setIsOpen} /> */}
         </div>
      </>
   )
}
