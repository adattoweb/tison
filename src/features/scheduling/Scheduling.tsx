import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import Button from "@/components/UI/Button"
import { PlusIcon } from "lucide-react"
import { SchedulingHeader } from "./SchedulingHeader"
import { SchedulingTable } from "./SchedulingTable"
import { useState } from "react"
import { AddSchedulingModal } from "./AddSchedulingModal"

export function Scheduling() {
   const [isOpen, setIsOpen] = useState(false)
   const openModal = () => setIsOpen(true)
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Планування виробництва</PageHeader>
               <PageDescription>Створення та контроль виробничих планів</PageDescription>
            </div>
            <Button onClick={openModal} type="accent" className="h-min">
               <Button.Icon Icon={PlusIcon} />
               <Button.Paragraph>Створити план</Button.Paragraph>
            </Button>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <SchedulingHeader />
            <SchedulingTable />
         </div>
         <AddSchedulingModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </>
   )
}
