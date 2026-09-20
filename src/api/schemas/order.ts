import { z } from "zod"
import type { StatusType } from "@/types/status"

const isoDate = (message: string) => z.iso.datetime({ offset: true, error: message })

export const OrderBaseSchema = z.object({
   product_model_id: z.number({ error: "Оберіть виріб" }).int(),
   plan: z.number({ error: "Введіть план" }).int("Введіть ціле число"),
   fact: z.number({ error: "Введіть факт" }).int("Введіть ціле число"),
   planned_start_at: isoDate("Вкажіть дату початку"),
   planned_end_at: isoDate("Вкажіть дату завершення"),
})

export const OrderCreateSchema = OrderBaseSchema.refine(d => d.fact <= d.plan, {
   message: "Факт не може перевищувати план",
   path: ["fact"],
}).refine(d => new Date(d.planned_end_at) >= new Date(d.planned_start_at), {
   message: "Кінець не може бути раніше за початок",
   path: ["planned_end_at"],
})

export const OrderUpdateSchema = OrderBaseSchema.extend({
   start_at: isoDate("Некоректна дата").nullable(),
   end_at: isoDate("Некоректна дата").nullable(),
   status: z.custom<StatusType>(v => typeof v === "string" && v.length > 0, "Оберіть статус"),
})

export type OrderBaseInput = z.infer<typeof OrderBaseSchema>
export type OrderCreateInput = z.infer<typeof OrderCreateSchema>
export type OrderUpdateInput = z.infer<typeof OrderUpdateSchema>
