import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import Button from "@/components/UI/Button"
import { PlusIcon } from "lucide-react"
import { OrdersTable } from "./OrdersTable"
import { useState } from "react"
import { AddOrderModal } from "./AddOrderModal"
import { DashboardHeader } from "../dashboard/DashboardHeader"
import { Can } from "@/components/Auth/Can"

export function Orders() {
   const [isOpen, setIsOpen] = useState(false)
   const openModal = () => setIsOpen(true)
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Планування виробництва</PageHeader>
               <PageDescription>Створення та контроль виробничих планів</PageDescription>
            </div>
            <Can resource="order" action="create">
               <Button onClick={openModal} type="accent" className="h-min">
                  <Button.Icon Icon={PlusIcon} />
                  <Button.Paragraph>Створити план</Button.Paragraph>
               </Button>
            </Can>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <Can resource="analytics" action="read">
               <DashboardHeader />
            </Can>
            <DashboardHeader />
            <OrdersTable />
         </div>
         <Can resource="order" action="create">
            <AddOrderModal isOpen={isOpen} setIsOpen={setIsOpen} />
         </Can>
      </>
   )
}
