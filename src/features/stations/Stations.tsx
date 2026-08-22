import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { StationsHeader } from "./StationsHeader"
import { StationsTable } from "./StationsTable"
import Button from "@/components/UI/Button"
import { MonitorCog } from "lucide-react"
import { useState } from "react"
import { AddStationModal } from "./AddStationModal"

export function Stations() {
   const [isOpen, setIsOpen] = useState(false)
   const openModal = () => setIsOpen(true)
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Робочі станції</PageHeader>
               <PageDescription>Моніторинг та управління робочими місцями</PageDescription>
            </div>
            <Button onClick={openModal} type="accent" className="h-min">
               <Button.Icon Icon={MonitorCog} />
               <Button.Paragraph>Додати станцію</Button.Paragraph>
            </Button>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <StationsHeader />
            <StationsTable />
         </div>
         <AddStationModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </>
   )
}
