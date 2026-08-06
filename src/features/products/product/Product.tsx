import { useParams } from "react-router"
import { mockProducts } from "../products"
import PageHeader from "@/components/UI/PageHeader"
import { ErrorPage } from "@/components/ErrorPage/ErrorPage"
import PageDescription from "@/components/UI/PageDescription"
import { ProductHeader } from "./ProductHeader"
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

export function Product() {
   const mode = useLayoutMode()
   const { id } = useParams()
   const product = mockProducts.find(el => el.id === Number(id))
   if (product === undefined) return <ErrorPage />
   return (
      <div className="flex flex-col gap-(--components-gap)">
         <div>
            <PageHeader>{product.code}</PageHeader>
            <PageDescription>{product.model}</PageDescription>
         </div>
         <div
            className="grid grid-cols-[repeat(10,1fr)] gap-(--components-gap) w-full"
            style={{
               gridTemplateAreas: AREAS_BY_MODE[mode],
            }}
         >
            <ProductHeader />
            <Info product={product} />
            <History />
            <Chart />
            {/* <Prediction /> */}
            <DashboardAnalysis />
         </div>
      </div>
   )
}
