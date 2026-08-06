import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import Button from "@/components/UI/Button"
import { mockClick } from "@/utils/mockClick"
import { PackagePlus } from "lucide-react"
import { AnalyticsHeader } from "./AnalyticsHeader"

export function Analytics() {
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Аналітика</PageHeader>
               <PageDescription>Повний аналіз продуктивності, якості та ефективності виробництва</PageDescription>
            </div>
            <Button onClick={mockClick} type="accent" className="h-min">
               <Button.Icon Icon={PackagePlus} />
               <Button.Paragraph>Додати операцію</Button.Paragraph>
            </Button>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <AnalyticsHeader />
         </div>
      </>
   )
}
