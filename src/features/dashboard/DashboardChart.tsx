import { useMemo, useState } from "react"
import Dropdown from "@/components/UI/Dropdown"
import type { WithClassName } from "@/types/common"
import { useDefectsByOperationType } from "@/hooks/api/defectAnalytics/useDefectsByOperationType"
import { toISODate } from "@/utils/time"
import { DefectsPieChart, type DefectSlice } from "@/components/Analytics/DefectsPieChart"

const DAYS_OPTIONS = [1, 7, 14, 30] as const

export function DashboardChart({ className }: WithClassName) {
   const [days, setDays] = useState<number>(DAYS_OPTIONS[1])

   // dateTo — сьогодні, dateFrom — days-1 днів тому включно з сьогодні
   const { dateFrom, dateTo } = useMemo(() => {
      const today = new Date()
      const from = new Date(today)
      from.setDate(from.getDate() - (days - 1))
      return { dateFrom: toISODate(from), dateTo: toISODate(today) }
   }, [days])

   const { data, isLoading, isError } = useDefectsByOperationType({ dateFrom, dateTo })

   const slices: DefectSlice[] = (data ?? []).map(item => ({
      name: item.name,
      value: item.defects_count,
      fill: item.color,
   }))

   return (
      <DefectsPieChart
         className={className}
         title="Дефекти за типом операції"
         data={slices}
         isLoading={isLoading}
         isError={isError}
         emptyMessage="Дефектів за цей період немає"
         controls={
            <Dropdown>
               <Dropdown.Button>
                  <span className="font-normal text-white whitespace-nowrap">{days} днів</span>
                  <Dropdown.Chevron />
               </Dropdown.Button>

               <Dropdown.Content>
                  {DAYS_OPTIONS.map(option => (
                     <Dropdown.Item key={option} onClick={() => setDays(option)}>
                        {option} днів
                     </Dropdown.Item>
                  ))}
               </Dropdown.Content>
            </Dropdown>
         }
      />
   )
}
