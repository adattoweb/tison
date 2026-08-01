import { useEffect, useState } from "react"
import PageDescription from "@/components/UI/PageDescription"
import PageHeader from "@/components/UI/PageHeader"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardStats } from "./DashboardStats"
import { DashboardChart } from "./DashboardChart"
import { DashboardPlanning } from "./DashboardPlanning"
import DashboardAnalysis from "./DashboardAnalysis"

const WIDE_BREAKPOINT = "(min-width: 1600px)" // 3xl
const MEDIUM_BREAKPOINT = "(min-width: 1024px)" // lg — поріг між "50/50" і "100%"

type LayoutMode = "wide" | "medium" | "stacked"

// >= 1600px: analysis(3/5) + stats(2/5) в один ряд, planning(3/5) + chart(2/5) в один ряд
const WIDE_AREAS = `
   "header header header header header header header header header header"
   "analysis analysis analysis analysis analysis analysis stats stats stats stats"
   "planning planning planning planning planning planning chart chart chart chart"
`

// 1024–1600px: 3-широкі блоки на всю ширину, stats/chart по 50/50 в один ряд
const MEDIUM_AREAS = `
   "header header header header header header header header header header"
   "analysis analysis analysis analysis analysis analysis analysis analysis analysis analysis"
   "planning planning planning planning planning planning planning planning planning planning"
   "stats stats stats stats stats chart chart chart chart chart"
`

// < 1024px: усе одне під одним, кожен блок займає 100% ширини
const STACKED_AREAS = `
   "header header header header header header header header header header"
   "analysis analysis analysis analysis analysis analysis analysis analysis analysis analysis"
   "planning planning planning planning planning planning planning planning planning planning"
   "stats stats stats stats stats stats stats stats stats stats"
   "chart chart chart chart chart chart chart chart chart chart"
`

function useLayoutMode(): LayoutMode {
   const getMode = (): LayoutMode => {
      if (window.matchMedia(WIDE_BREAKPOINT).matches) return "wide"
      if (window.matchMedia(MEDIUM_BREAKPOINT).matches) return "medium"
      return "stacked"
   }

   const [mode, setMode] = useState<LayoutMode>(getMode)

   useEffect(() => {
      const wideMql = window.matchMedia(WIDE_BREAKPOINT)
      const mediumMql = window.matchMedia(MEDIUM_BREAKPOINT)

      const handleChange = () => setMode(getMode())

      wideMql.addEventListener("change", handleChange)
      mediumMql.addEventListener("change", handleChange)

      return () => {
         wideMql.removeEventListener("change", handleChange)
         mediumMql.removeEventListener("change", handleChange)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   return mode
}

const AREAS_BY_MODE: Record<LayoutMode, string> = {
   wide: WIDE_AREAS,
   medium: MEDIUM_AREAS,
   stacked: STACKED_AREAS,
}

export function Dashboard() {
   const mode = useLayoutMode()

   return (
      <>
         <div>
            <PageHeader>Панель керування</PageHeader>
            <PageDescription>Керування та інформація про систему</PageDescription>
         </div>

         <div
            className="grid gap-(--components-gap) w-full"
            style={{
               display: "grid",
               gridTemplateColumns: "repeat(10, 1fr)",
               gridTemplateAreas: AREAS_BY_MODE[mode],
            }}
         >
            <DashboardHeader />
            <DashboardAnalysis />
            <DashboardStats />
            <DashboardChart />
            <DashboardPlanning style={{ gridArea: "planning" }} />
         </div>
      </>
   )
}
