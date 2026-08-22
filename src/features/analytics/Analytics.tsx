import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { AnalyticsHeader } from "./AnalyticsHeader"
import DashboardAnalysis from "../dashboard/DashboardAnalysis"
import { AnalyticsWorkload } from "./AnalyticsWorkload"
import { ProductDefects } from "./ProductDefects"
import { OperationsTime } from "./OperationsTime"
import { AnalyticsPrediction } from "./AnalyticsPrediction"
import { AnalyticsStagnation } from "./AnalyticsStagnation"
import { AnalyticsEfficiency } from "./AnalyticsEfficiency"
import { useLayoutMode, type LayoutMode } from "@/hooks/useLayoutMode"

const WIDE_AREAS = `
   "header header header header header header header header header header"
   "analysis analysis analysis analysis analysis analysis analysis efficiency efficiency efficiency"
   "defects defects defects optime optime optime optime workload workload workload"
   "stagnation stagnation stagnation prediction prediction prediction prediction prediction prediction prediction"
`

const MEDIUM_AREAS = `
   "header header header header header header header header header header"
   "analysis analysis analysis analysis analysis analysis analysis analysis analysis analysis"
   "efficiency efficiency efficiency efficiency efficiency workload workload workload workload workload"
   "defects defects defects defects defects optime optime optime optime optime"
   "stagnation stagnation stagnation stagnation stagnation stagnation stagnation stagnation stagnation stagnation"
   "prediction prediction prediction prediction prediction prediction prediction prediction prediction prediction"
`

const STACKED_AREAS = `
   "header header header header header header header header header header"
   "analysis analysis analysis analysis analysis analysis analysis analysis analysis analysis"
   "efficiency efficiency efficiency efficiency efficiency efficiency efficiency efficiency efficiency efficiency"
   "workload workload workload workload workload workload workload workload workload workload"
   "optime optime optime optime optime optime optime optime optime optime"
   "defects defects defects defects defects defects defects defects defects defects"
   "stagnation stagnation stagnation stagnation stagnation stagnation stagnation stagnation stagnation stagnation"
   "prediction prediction prediction prediction prediction prediction prediction prediction prediction prediction"
`

const AREAS_BY_MODE: Record<LayoutMode, string> = {
   wide: WIDE_AREAS,
   medium: MEDIUM_AREAS,
   stacked: STACKED_AREAS,
}

export function Analytics() {
   const mode = useLayoutMode()
   return (
      <>
         <div className="flex justify-between items-center">
            <div className="flex flex-col">
               <PageHeader>Аналітика</PageHeader>
               <PageDescription>Повний аналіз продуктивності, якості та ефективності виробництва</PageDescription>
            </div>
         </div>

         <div
            className="grid grid-cols-[repeat(10,1fr)] gap-(--components-gap)"
            style={{
               gridTemplateAreas: AREAS_BY_MODE[mode],
            }}
         >
            <AnalyticsHeader />
            <DashboardAnalysis />
            <AnalyticsWorkload />
            <ProductDefects />
            <OperationsTime />
            <AnalyticsPrediction />
            <AnalyticsStagnation />
            <AnalyticsEfficiency />
         </div>
      </>
   )
}
