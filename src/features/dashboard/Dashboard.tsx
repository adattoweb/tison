import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardStats } from "./DashboardStats"
import { DashboardChart } from "./DashboardChart"
import { DashboardPlanning } from "./DashboardPlanning"

export function Dashboard() {
   return (
      <>
         <div className="">
            <PageHeader>Панель керування</PageHeader>
            <PageDescription>Керування та інформація про систему</PageDescription>
         </div>
         <DashboardHeader />
         <DashboardStats />
         <DashboardChart />
         <DashboardPlanning />
      </>
   )
}
