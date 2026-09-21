import { z } from "zod"
import type { DefectStatusType } from "@/api/types/defect"

export const DefectBaseSchema = z.object({
   title: z.string().min(1, "Обов'язкове поле").max(255, "Максимум 255 символів"),
   description: z.string().max(2058, "Максимум 2058 символів"),
   images: z.array(z.url("Некоректне посилання")).nullable().optional(),
})

export const DefectCreateSchema = DefectBaseSchema.extend({
   operation_id: z.number({ error: "Оберіть операцію" }).int(),
})

export const DefectUpdateSchema = DefectBaseSchema.extend({
   end_at: z.iso.datetime({ offset: true, error: "Некоректна дата" }).nullable().optional(),
   status: z.custom<DefectStatusType>(v => v === "OPEN" || v === "CLOSE", "Оберіть статус"),
})

export type DefectCreateInput = z.infer<typeof DefectCreateSchema>
export type DefectUpdateInput = z.infer<typeof DefectUpdateSchema>
