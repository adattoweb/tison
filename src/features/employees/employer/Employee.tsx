import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { EmployeeHeader } from "./EmployeeHeader"
import { Info } from "./Info"
import { History } from "./History"
import { Chart } from "./Chart"
import DashboardAnalysis from "@/features/dashboard/DashboardAnalysis"
import { useLayoutMode, type LayoutMode } from "@/hooks/useLayoutMode"

const WIDE_AREAS = `
   "header header header header header header header header header header"
   "info info history history history history analysis analysis analysis analysis"
   "info info history history history history chart chart chart chart"
`

const MEDIUM_AREAS = `
   "header header header header header header header header header header"
   "info info info info info history history history history history"
   "info info info info info history history history history history"
   "analysis analysis analysis analysis analysis chart chart chart chart chart"
`

const STACKED_AREAS = `
   "header header header header header header header header header header"
   "info info info info info info info info info info"
   "analysis analysis analysis analysis analysis analysis analysis analysis analysis analysis"
   "history history history history history history history history history history"
   "chart chart chart chart chart chart chart chart chart chart"
`

const AREAS_BY_MODE: Record<LayoutMode, string> = {
   wide: WIDE_AREAS,
   medium: MEDIUM_AREAS,
   stacked: STACKED_AREAS,
}

export function Employee() {
   const mode = useLayoutMode()
   return (
      <div className="flex flex-col gap-(--components-gap)">
         <div>
            <PageHeader>Іван Савченко</PageHeader>
            <PageDescription>Оператор</PageDescription>
         </div>
         <div
            className="grid grid-cols-[repeat(10,1fr)] gap-(--components-gap) w-full"
            style={{
               gridTemplateAreas: AREAS_BY_MODE[mode],
            }}
         >
            <EmployeeHeader />
            <Info />
            <History />
            <Chart />
            <DashboardAnalysis />
         </div>
      </div>
   )
}
