import type { ProductListRead } from "@/api/types/product"
import { Link } from "react-router"

export interface ModelOption {
   id: number
   title: string
}

interface RelatedProductCardProps {
   product: ProductListRead
   models: ModelOption[]
}

/** Клікабельна картка виробу: код, модель, статус, прогрес і крок */
export function RelatedProductCard({ product, models }: RelatedProductCardProps) {
   const modelTitle =
      models.find(m => m.id === product.product_model_id)?.title ?? `Модель #${product.product_model_id}`
   const progress = Math.min(100, Math.max(0, product.progress))

   return (
      <Link
         to={`/products/${product.id}`}
         className="flex flex-col gap-2 rounded-md border border-(--stroke-color) bg-(--bg-trans-color) px-3 py-2 transition-colors hover:bg-(--bg-trans-hover-color)"
      >
         <div className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate text-sm font-medium text-white md:text-base">{product.code}</span>
            <span className="shrink-0 text-xs text-[#D9D9D9] md:text-sm">{product.status}</span>
         </div>

         <div className="flex items-baseline justify-between gap-3 text-xs text-[#D9D9D9] md:text-sm">
            <span className="min-w-0 truncate">{modelTitle}</span>
            <span className="shrink-0">
               Крок {product.current_step ?? "—"} з {product.steps}
            </span>
         </div>

         <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
               <div className="h-full rounded-full bg-white/80" style={{ width: `${progress}%` }} />
            </div>
            <span className="w-9 shrink-0 text-right text-xs text-[#D9D9D9]">{Math.round(progress)}%</span>
         </div>
      </Link>
   )
}
