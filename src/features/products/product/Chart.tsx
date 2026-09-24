import { useState } from "react"
import type { DateRange } from "@daypicker/react"
import type { WithClassName } from "@/types/common"
import { toISODate } from "@/utils/time"
import { useDefectsByProductModel } from "@/hooks/api/defectAnalytics/useDefectsByProductModel"
import { DateRangeFilter } from "@/components/UI/DateRangeFilter"
import { DefectsPieChart, type DefectSlice } from "@/components/Analytics/DefectsPieChart"

interface ChartProps extends WithClassName {
   productModelId: number
}

export function Chart({ className, productModelId }: ChartProps) {
   const [range, setRange] = useState<DateRange | undefined>(undefined)

   const dateFrom = range?.from ? toISODate(range.from) : undefined
   const dateTo = range?.to ? toISODate(range.to) : range?.from ? toISODate(range.from) : undefined

   const { data, isLoading, isError } = useDefectsByProductModel(productModelId, { dateFrom, dateTo })

   const slices: DefectSlice[] = (data ?? []).map(item => ({
      name: item.name,
      value: item.defects_count,
      fill: item.color,
   }))

   return (
      <DefectsPieChart
         className={className}
         title="Дефекти за виробів цього типу"
         data={slices}
         isLoading={isLoading}
         isError={isError}
         controls={<DateRangeFilter label="Період" value={range} onChange={setRange} />}
      />
   )
}
