import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import Button from "@/components/UI/Button"
import { mockClick } from "@/utils/mockClick"
import { PlusIcon } from "lucide-react"
import { StorageTable } from "./StorageTable"
import { StorageHeader } from "./StorageHeader"

export function Storage() {
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Склад</PageHeader>
               <PageDescription>Зберігання та редагування матеріалів</PageDescription>
            </div>
            <Button onClick={mockClick} type="accent" className="h-min">
               <Button.Icon Icon={PlusIcon} />
               <Button.Paragraph>Додати матеріал</Button.Paragraph>
            </Button>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <StorageHeader />
            <StorageTable />
         </div>
      </>
   )
}
