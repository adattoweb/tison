import type { ProductListRead } from "@/api/types/product"
import { RelatedProductCard, type ModelOption } from "./RelatedProductCard"

interface ChildrenProductsProps {
   children: ProductListRead[]
   models: ModelOption[]
}

export function ChildrenProducts({ children, models }: ChildrenProductsProps) {
   return (
      <section
         style={{ gridArea: "children" }}
         className="flex min-w-0 flex-col gap-3 rounded-md border border-(--stroke-color) bg-(--bg-trans-color) p-4"
      >
         <h2 className="text-base font-medium text-white md:text-lg">
            Дочірні вироби <span className="text-[#D9D9D9]">({children.length})</span>
         </h2>
         {/* Багато дітей — список скролиться всередині блока */}
         <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
            {children.map(child => (
               <RelatedProductCard key={child.id} product={child} models={models} />
            ))}
         </div>
      </section>
   )
}
