import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { DefectsHeader } from "./DefectsHeader"
import { DefectsTable } from "./DefectsTable"

export function Defects() {
   return (
      <>
         <div>
            <PageHeader>Архів дефектів</PageHeader>
            <PageDescription>Архів фото дефектів та інформація про виявлені невідповідності</PageDescription>
         </div>

         <div className="flex flex-col gap-(--components-gap)">
            <DefectsHeader />
            <DefectsTable />
         </div>
      </>
   )
}
