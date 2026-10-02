import { useProduct } from "@/hooks/api/products/useProduct"
import { useAllProductModels } from "@/hooks/api/productModels/useAllProductModels"
import { Block, Placeholder } from "./Block"
import type { WorkSessionRead } from "@/api/types/workSession"

interface CurrentProductProps {
   area: string
   session: WorkSessionRead | null | undefined
}

function Row({ label, value }: { label: string; value: string }) {
   return (
      <div className="flex items-baseline justify-between gap-4 text-sm md:text-base">
         <span className="text-[#D9D9D9]">{label}</span>
         <span className="truncate text-right text-white">{value}</span>
      </div>
   )
}

function ProductInfo({ session }: { session: WorkSessionRead }) {
   const productId = session.operation.product_id
   const { data: product, isLoading } = useProduct(productId)
   const { data: modelsData } = useAllProductModels({ page: 1, pageSize: 100, is_active: true })

   if (isLoading || !product) return <Placeholder>Завантаження...</Placeholder>

   const model = modelsData?.items.find(m => m.id === product.product_model_id)
   const progress = Math.min(100, Math.max(0, product.progress))
   const operationType = session.operation.operation_type?.name

   return (
      <>
         <div>
            <p className="truncate text-xl font-semibold text-white md:text-2xl">{product.code}</p>
            <p className="truncate text-sm text-[#D9D9D9] md:text-base">
               {model?.title ?? `Модель #${product.product_model_id}`}
            </p>
         </div>

         <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between text-sm md:text-base">
               <span className="text-[#D9D9D9]">Прогрес</span>
               <span className="text-white">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
               <div className="h-full rounded-full bg-white/80 transition-[width]" style={{ width: `${progress}%` }} />
            </div>
         </div>

         <div className="flex flex-col gap-1.5 border-t border-(--stroke-color) pt-3">
            <Row
               label="Крок"
               value={
                  product.current_step !== null ? `${product.current_step} з ${product.steps}` : `— з ${product.steps}`
               }
            />
            <Row label="Поточна операція" value={[session.operation.code, operationType].filter(Boolean).join(" · ")} />
            <Row label="Замовлення" value={product.order_id ? `№${product.order_id}` : "—"} />
         </div>
      </>
   )
}

export function CurrentProduct({ area, session }: CurrentProductProps) {
   return (
      <Block area={area} title="Поточний виріб">
         {session ? (
            <ProductInfo session={session} />
         ) : (
            <Placeholder>Виріб з'явиться, коли почнеться сесія</Placeholder>
         )}
      </Block>
   )
}
