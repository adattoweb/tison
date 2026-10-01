import { z } from "zod"

const optionalId = z.number().int().nullable().optional()

export const ProductUpdateSchema = z.object({
   order_id: optionalId,
   parent_id: optionalId,
})

export const makeProductUpdateSchema = (productId: number) =>
   ProductUpdateSchema.refine(d => d.parent_id !== productId, {
      message: "Виріб не може бути батьком самого себе",
      path: ["parent_id"],
   })

export const ProductCreateSchema = ProductUpdateSchema.extend({
   product_model_id: z.number({ error: "Оберіть модель виробу" }).int(),
   code: z.string().max(255),
})

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>
