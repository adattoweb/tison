// api/schemas/product.ts
import { z } from "zod"

const optionalId = z.number().int().nullable().optional()

export const ProductUpdateSchema = z.object({
   order_id: optionalId,
   parent_id: optionalId,
})

export const ProductCreateSchema = ProductUpdateSchema.extend({
   product_model_id: z.number({ error: "Оберіть модель виробу" }).int(),
})

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>
