import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { ProductsHeader } from "./ProductsHeader"
import { ProductsTable } from "./ProductsTable"
import Button from "@/components/UI/Button"
import { PackagePlus } from "lucide-react"
import { mockClick } from "@/utils/mockClick"

export function Products() {
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Виріб</PageHeader>
               <PageDescription>Список усіх виробів та їх поточний статус</PageDescription>
            </div>
            <Button onClick={mockClick} type="accent" className="h-min">
               <Button.Icon Icon={PackagePlus} />
               <Button.Paragraph>Додати виріб</Button.Paragraph>
            </Button>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <ProductsHeader />
            <ProductsTable />
         </div>
      </>
   )
}
