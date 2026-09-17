import { useParams } from "react-router"
import PageHeader from "@/components/UI/PageHeader"
import PageDescription from "@/components/UI/PageDescription"
import { useLayoutMode } from "@/hooks/ui/useLayoutMode"
import { DepartmentHeader } from "./DepartmentHeader"
import Button from "@/components/UI/Button"
import { mockClick } from "@/utils/mockClick"
import { EditIcon, EllipsisIcon } from "lucide-react"

export function Department() {
   const mode = useLayoutMode()
   const { id } = useParams()
   return (
      <div className="flex flex-col gap-(--components-gap)">
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Name</PageHeader>
               <PageDescription>Паяльна станція</PageDescription>
            </div>
            <div className="flex gap-4">
               <Button onClick={mockClick} type="accent" className="h-min">
                  <Button.Icon Icon={EditIcon} />
                  <Button.Paragraph>Редагувати</Button.Paragraph>
               </Button>
               <Button onClick={mockClick} type="accent" className="h-min bg-(--accent-color) text-black">
                  <Button.Icon Icon={EllipsisIcon} className="rotate-90 stroke-black!" />
                  <Button.Paragraph>Дії</Button.Paragraph>
               </Button>
            </div>
         </div>
         <div
            className="grid grid-cols-[repeat(10,1fr)] gap-(--components-gap) w-full"
            style={{
               gridTemplateAreas: AREAS_BY_MODE[mode],
            }}
         >
            <DepartmentHeader />
         </div>
      </div>
   )
}
