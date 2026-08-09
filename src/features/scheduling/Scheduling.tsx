import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import Button from "@/components/UI/Button"
import { mockClick } from "@/utils/mockClick"
import { useLayoutMode, type LayoutMode } from "@/hooks/useLayoutMode"
import { PlusIcon } from "lucide-react"
import { SchedulingHeader } from "./SchedulingHeader"

const WIDE_AREAS = `
   "header header header header header header header header header header"
`

const MEDIUM_AREAS = `
   "header header header header header header header header header header"
`

const STACKED_AREAS = `
   "header header header header header header header header header header"
`

const AREAS_BY_MODE: Record<LayoutMode, string> = {
   wide: WIDE_AREAS,
   medium: MEDIUM_AREAS,
   stacked: STACKED_AREAS,
}

export function Scheduling() {
   const mode = useLayoutMode()
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Планування виробництва</PageHeader>
               <PageDescription>Створення та контроль виробничих планів</PageDescription>
            </div>
            <Button onClick={mockClick} type="accent" className="h-min">
               <Button.Icon Icon={PlusIcon} />
               <Button.Paragraph>Створити план</Button.Paragraph>
            </Button>
         </div>

         <div
            className="flex flex-col gap-(--components-gap)"
            // style={{
            //    gridTemplateAreas: AREAS_BY_MODE[mode], grid grid-cols-[repeat(10,1fr)]
            // }}
         >
            <SchedulingHeader />
         </div>
      </>
   )
}
