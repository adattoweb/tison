import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { DefectsHeader } from "./DefectsHeader"
import { DefectsTable } from "./DefectsTable"
import Button from "@/components/UI/Button"
import { ImageUp } from "lucide-react"
import { useState } from "react"
import { AddDefectModal } from "./AddDefectModal"
import { Can } from "@/components/Auth/Can"

export function Defects() {
   const [isAddModalOpen, setIsAddModalOpen] = useState(false)
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Архів дефектів</PageHeader>
               <PageDescription>Архів фото дефектів та інформація про виявлені невідповідності</PageDescription>
            </div>
            <Can resource="defect" action="create">
               <Button onClick={() => setIsAddModalOpen(true)} type="accent" className="h-min">
                  <Button.Icon Icon={ImageUp} />
                  <Button.Paragraph>Додати дефект</Button.Paragraph>
               </Button>
            </Can>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <Can resource="analytics" action="read">
               <DefectsHeader />
            </Can>
            <DefectsTable />
         </div>
         <Can resource="defect" action="create">
            <AddDefectModal isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} />
         </Can>
      </>
   )
}
