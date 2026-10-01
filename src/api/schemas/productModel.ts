import { z } from "zod"

export const ProductModelBaseSchema = z.object({
   title: z.string().min(1, "Обов'язкове поле").max(255, "Максимум 255 символів"),
   type: z.string().min(1, "Обов'язкове поле").max(255, "Максимум 255 символів"),
   description: z.string().max(1024, "Максимум 1024 символи").nullable().optional(),
   is_detail: z.boolean(),
   // id моделей-деталей, з яких складається ця модель. Для деталі завжди []
   details_ids: z.array(z.number().int()),
   images: z.array(z.url("Некоректне посилання")).max(10, "Максимум 10 зображень"),
})

// refine додаємо ПІСЛЯ omit/pick: у Zod 4 .omit()/.pick() не працюють на схемах із refine
export const ProductModelFormSchema = ProductModelBaseSchema.omit({ images: true }).refine(
   d => !d.is_detail || d.details_ids.length === 0,
   { message: "Деталь не може мати дочірніх моделей", path: ["details_ids"] },
)

export const ProductModelEditSchema = ProductModelBaseSchema.pick({
   title: true,
   type: true,
   description: true,
   details_ids: true,
})

export type ProductModelBaseInput = z.infer<typeof ProductModelBaseSchema>
export type ProductModelEditInput = z.infer<typeof ProductModelEditSchema>
export type ProductModelFormInput = z.infer<typeof ProductModelFormSchema>
