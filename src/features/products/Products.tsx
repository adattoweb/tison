import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { ProductsHeader } from "./ProductsHeader"

export function Products() {
   return (
      <>
         <div>
            <PageHeader>Панель керування</PageHeader>
            <PageDescription>Керування та інформація про систему</PageDescription>
         </div>

         <div className="grid gap-(--components-gap) w-full">
            <ProductsHeader />
         </div>
      </>
   )
}
