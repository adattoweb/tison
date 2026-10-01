import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import Button from "@/components/UI/Button"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import CreateProductsModal from "./CreateProductsModal"

export function WorkPlace() {
   const [isOpen, setIsOpen] = useState(false)
   const openModal = () => setIsOpen(true)
   return (
      <>
         <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex flex-col">
               <PageHeader>Робоче місце</PageHeader>
               <PageDescription>Керування власними сессіями</PageDescription>
            </div>
            <Button onClick={openModal} type="accent" className="h-min">
               <Button.Icon Icon={PlusIcon} />
               <Button.Paragraph>Додати виріб</Button.Paragraph>
            </Button>
         </div>
         <div className="flex flex-col gap-(--components-gap)">
            <CreateProductsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
         </div>
      </>
   )
}
