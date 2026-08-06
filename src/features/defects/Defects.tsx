import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { DefectsHeader } from "./DefectsHeader"
import { DefectsTable } from "./DefectsTable"
import Button from "@/components/UI/Button"
import { mockClick } from "@/utils/mockClick"
import { ImageUp } from "lucide-react"

export function Defects() {
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Архів дефектів</PageHeader>
               <PageDescription>Архів фото дефектів та інформація про виявлені невідповідності</PageDescription>
            </div>
            <Button onClick={mockClick} type="accent" className="h-min">
               <Button.Icon Icon={ImageUp} />
               <Button.Paragraph>Додати фото</Button.Paragraph>
            </Button>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <DefectsHeader />
            <DefectsTable />
         </div>
      </>
   )
}
