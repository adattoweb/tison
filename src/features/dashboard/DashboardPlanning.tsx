import Table from "@/components/Table/Table"
import type { StatusType } from "@/types/status"
import type { ProductModelSummary } from "@/api/types/productionAnalytics"
import { useProductionSummary } from "@/hooks/api/productionAnalytics/useProductionSummary"

const columns = ["Виріб", "План", "Залишилось", "Завершено", "Прогрес", "Статус"]

const tableClassNames = "grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] 4xl:grid-cols-[2fr_1fr_1fr_1fr_2fr_1fr]"

function deriveStatus(item: ProductModelSummary): StatusType {
   if (item.remaining <= 0) return "DONE"
   if (item.fact === 0) return "IDLE"
   return "ACTIVE"
}

export function DashboardPlanning() {
   const { data, isLoading, isError } = useProductionSummary()

   const items = data?.today.by_model ?? []

   return (
      <Table columns={columns} tableClassNames={tableClassNames} style={{ gridArea: "planning" }}>
         {isLoading && <p className="py-8 text-center text-(--second-color)">Завантаження...</p>}

         {isError && <p className="py-8 text-center text-red-400">Не вдалося завантажити дані</p>}

         {!isLoading && !isError && items.length === 0 && (
            <p className="py-8 text-center text-(--second-color)">На сьогодні планів немає</p>
         )}

         {!isLoading &&
            !isError &&
            items.map(item => {
               const progress = item.planned > 0 ? Math.round((item.fact / item.planned) * 100) : 0

               return (
                  <Table.Row key={item.product_model_id} to={`/models/${item.product_model_id}`}>
                     <Table.Name name={item.product_model_title} model="" />
                     <Table.StatItem value={item.planned} />
                     <Table.StatItem value={item.remaining} />
                     <Table.StatItem value={item.fact} />
                     <Table.Progress value={progress} />
                     <Table.Status status={deriveStatus(item)} />
                  </Table.Row>
               )
            })}
      </Table>
   )
}
