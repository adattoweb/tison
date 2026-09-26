import { z } from "zod"

export const ProductModelBaseSchema = z.object({
   title: z.string().min(1, "Обов'язкове поле").max(255, "Максимум 255 символів"),
   type: z.string().min(1, "Обов'язкове поле").max(255, "Максимум 255 символів"),
   description: z.string().max(1024, "Максимум 1024 символи").nullable().optional(),
   images: z.array(z.url("Некоректне посилання")).max(10, "Максимум 10 зображень"),
})

export const ProductModelFormSchema = ProductModelBaseSchema.omit({ images: true })

export const ProductModelEditSchema = ProductModelBaseSchema.pick({
   title: true,
   type: true,
   description: true,
})

export type ProductModelBaseInput = z.infer<typeof ProductModelBaseSchema>
export type ProductModelEditInput = z.infer<typeof ProductModelEditSchema>
export type ProductModelFormInput = z.infer<typeof ProductModelFormSchema>
