import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardStats } from "./DashboardStats"
import { DashboardChart } from "./DashboardChart"
import { DashboardPlanning } from "./DashboardPlanning"
import DashboardAnalysis from "./DashboardAnalysis"

const areas = `
   "header header header header header"
   "analysis analysis analysis stats stats"
   "analysis analysis analysis stats stats"
   "planning planning planning chart chart"
   "planning planning planning chart chart"
`

export function Dashboard() {
   return (
      <>
         <div>
            <PageHeader>Панель керування</PageHeader>
            <PageDescription>Керування та інформація про систему</PageDescription>
         </div>
         <div
            className="grid gap-(--components-gap) w-full"
            style={{ gridTemplateAreas: areas, display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}
         >
            <DashboardHeader />
            <DashboardAnalysis />
            <DashboardStats />
            <DashboardChart />
            <DashboardPlanning />
         </div>
      </>
   )
}
