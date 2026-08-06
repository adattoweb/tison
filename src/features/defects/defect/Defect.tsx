import { useParams } from "react-router"
import PageHeader from "@/components/UI/PageHeader"
import { ErrorPage } from "@/components/ErrorPage/ErrorPage"
import PageDescription from "@/components/UI/PageDescription"
import { useLayoutMode, type LayoutMode } from "@/hooks/useLayoutMode"
import Button from "@/components/UI/Button"
import { mockClick } from "@/utils/mockClick"
import { EditIcon, EllipsisIcon } from "lucide-react"
import { mockDefects } from "../defects"
import { DefectHeader } from "./DefectHeader"
import { Info } from "./Info"
import { DefectStats } from "./DefectStats"
import { DefectAnalysis } from "./DefectAnalysis"
import { DefectOperation } from "./DefectOperation"
import { DefectResponsible } from "./DefectResponsible"
import { History } from "./History"

const WIDE_AREAS = `
   "header header header header header header header header header header"
   "info info info responsible responsible operation operation history history history"
   "info info info analysis analysis stats stats history history history"
`

const MEDIUM_AREAS = `
   "header header header header header header header header header header"
   "info info info info info info info info info info"
   "info info info info info info info info info info"
   "analysis analysis analysis analysis analysis stats stats stats stats stats"
   "operation operation operation operation operation responsible responsible responsible responsible responsible"
   "history history history history history history history history history history"
`

const STACKED_AREAS = `
   "header header header header header header header header header header"
   "info info info info info info info info info info"
   "analysis analysis analysis analysis analysis analysis analysis analysis analysis analysis"
   "stats stats stats stats stats stats stats stats stats stats"
   "responsible responsible responsible responsible responsible responsible responsible responsible responsible responsible"
   "operation operation operation operation operation operation operation operation operation operation"
   "history history history history history history history history history history"
`

const AREAS_BY_MODE: Record<LayoutMode, string> = {
   wide: WIDE_AREAS,
   medium: MEDIUM_AREAS,
   stacked: STACKED_AREAS,
}

export function Defect() {
   const mode = useLayoutMode()
   const { id } = useParams()
   const defect = mockDefects.find(el => el.id === Number(id))
   if (defect === undefined) return <ErrorPage />
   return (
      <div className="flex flex-col gap-(--components-gap)">
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>{defect.code}</PageHeader>
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
            <DefectHeader />
            <Info defect={defect} />
            <DefectStats />
            <DefectAnalysis />
            <DefectOperation />
            <DefectResponsible />
            <History />
         </div>
      </div>
   )
}
