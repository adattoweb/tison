import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import Button from "@/components/UI/Button"
import { FilePlus } from "lucide-react"
import { ModelList } from "./ModelList"
import { ProductModelsHeader } from "./ModelHeader"
import { AddModelModal } from "./AddModelModal"
import { useState } from "react"
import { Can } from "@/components/Auth/Can"

export function Models() {
   const [isAddModalOpen, setIsAddModalOpen] = useState(false)
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Моделі виробів</PageHeader>
               <PageDescription>Створення та редагування моделей та інструкцій до них</PageDescription>
            </div>
            <Can resource="product_model" action="create">
               <Button type="accent" className="h-min" onClick={() => setIsAddModalOpen(true)}>
                  <Button.Icon Icon={FilePlus} />
                  <Button.Paragraph>Додати нову модель</Button.Paragraph>
               </Button>
            </Can>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <Can resource="analytics" action="read">
               <ProductModelsHeader />
            </Can>
            <ModelList />
         </div>
         <Can resource="product_model" action="create">
            <AddModelModal isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} />
         </Can>
      </>
   )
}
