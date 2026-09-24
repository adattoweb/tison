import type { ProductListRead } from "@/api/types/product"
import Table from "@/components/Table/Table"
import { useAllProductModels } from "@/hooks/api/productModels/useAllProductModels"
import { useStationWorkedProducts } from "@/hooks/api/stationAnalytics/useStationWorkedProducts"

const columns = ["Виріб", "Модель", "Замовлення", "Прогрес", "Статус"]
const tableClassNames = "min-w-275 grid-cols-[1.3fr_1.6fr_1.2fr_1.2fr_1fr]"

interface RecentProductsTableProps {
   stationId: number
   limit?: number
}

export function RecentProductsTable({ stationId, limit = 5 }: RecentProductsTableProps) {
   const { data, isLoading, isError } = useStationWorkedProducts(stationId, { limit })
   const { data: modelsData } = useAllProductModels({ page: 1, pageSize: 100, isActive: true })

   const products: ProductListRead[] = data ?? []
   const modelTitleById = new Map((modelsData?.items ?? []).map(model => [model.id, model.title]))

   return (
      <Table.Wrapper style={{ gridArea: "table" }}>
         <Table columns={columns} tableClassNames={tableClassNames} isFlexible={true}>
            {isLoading && <p className="min-w-275 px-4 py-6 text-center text-(--second-color)">Завантаження...</p>}

            {isError && <p className="min-w-275 px-4 py-6 text-center text-red-400">Не вдалося завантажити вироби</p>}

            {!isLoading && !isError && products.length === 0 && (
               <p className="min-w-275 px-4 py-6 text-center text-(--second-color)">Виробів ще не було</p>
            )}

            {!isLoading &&
               !isError &&
               products.map(product => (
                  <Table.Row key={product.id} to={`/products/${product.id}`}>
                     <Table.Text text={product.code} className="font-medium" />
                     <Table.Text
                        text={modelTitleById.get(product.product_model_id) ?? `#${product.product_model_id}`}
                     />
                     <Table.Text text={product.order_id ? `#${product.order_id}` : "Без замовлення"} />
                     <Table.Percent value={Math.round(product.progress)} goodThreshold={100} />
                     <Table.Status status={product.status} />
                  </Table.Row>
               ))}
         </Table>
      </Table.Wrapper>
   )
}
