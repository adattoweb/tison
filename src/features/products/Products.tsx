import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { ProductsHeader } from "./ProductsHeader"
import { ProductsTable } from "./ProductsTable"

export function Products() {
   return (
      <>
         <div>
            <PageHeader>Вироби</PageHeader>
            <PageDescription>Список усіх виробів та їх поточний статус</PageDescription>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <ProductsHeader />
            <ProductsTable />
         </div>
      </>
   )
}
