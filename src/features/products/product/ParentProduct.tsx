import type { ProductListRead } from "@/api/types/product"
import { RelatedProductCard, type ModelOption } from "./RelatedProductCard"

interface ParentProductProps {
   parent: ProductListRead
   models: ModelOption[]
}

export function ParentProduct({ parent, models }: ParentProductProps) {
   return (
      <section
         style={{ gridArea: "parent" }}
         className="flex min-w-0 flex-col gap-3 rounded-md border border-(--stroke-color) bg-(--bg-trans-color) p-4"
      >
         <h2 className="text-base font-medium text-white md:text-lg">Батьківський виріб</h2>
         <RelatedProductCard product={parent} models={models} />
      </section>
   )
}
