import { useParams } from "react-router"
import PageHeader from "@/components/UI/PageHeader"
import PageDescription from "@/components/UI/PageDescription"
import { DepartmentHeader } from "./DepartmentHeader"
import Button from "@/components/UI/Button"
import { mockClick } from "@/utils/mockClick"
import { EditIcon, EllipsisIcon } from "lucide-react"
import { useDepartment } from "@/hooks/api/departments/useDepatment"

export function Department() {
   const { id } = useParams()
   const { data } = useDepartment(Number(id))
   console.log(data)
   return (
      <div className="flex flex-col gap-(--components-gap)">
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>{data?.name}</PageHeader>
               <PageDescription>{data?.description}</PageDescription>
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
         <div className="flex gap-(--components-gap) w-full">
            <DepartmentHeader />
         </div>
      </div>
   )
}
