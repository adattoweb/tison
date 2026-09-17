import { z } from "zod"

export const DeparmtentBaseSchema = z.object({
   name: z.string().min(1, "Обов'язкове поле").max(255),
   description: z.string().max(512).nullable().optional(),
})

export type DepartmentBaseInput = z.infer<typeof DeparmtentBaseSchema>
