import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { ProductsHeader } from "./ProductsHeader"
import { ProductsTable } from "./ProductsTable"
import Button from "@/components/UI/Button"
import { PackagePlus } from "lucide-react"
import { AddProductModal } from "./AddProductModal"
import { useState } from "react"
import { Can } from "@/components/Auth/Can"

export function Products() {
   const [isProductModalOpen, setIsProductModalOpen] = useState(false)
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Виріб</PageHeader>
               <PageDescription>Список усіх виробів та їх поточний статус</PageDescription>
            </div>
            <Can resource="product" action="create">
               <Button onClick={() => setIsProductModalOpen(true)} type="accent" className="h-min">
                  <Button.Icon Icon={PackagePlus} />
                  <Button.Paragraph>Додати виріб</Button.Paragraph>
               </Button>
            </Can>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <Can resource="analytics" action="read">
               <ProductsHeader />
            </Can>
            <ProductsTable />
         </div>
         <Can resource="product" action="create">
            <AddProductModal isOpen={isProductModalOpen} setIsOpen={setIsProductModalOpen} />
         </Can>
      </>
   )
}
