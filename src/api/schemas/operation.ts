import { z } from "zod"
import { STATUS } from "@/constants/status"

const statusValues = Object.keys(STATUS) as [string, ...string[]]

export const operationCreateSchema = z.object({
   operation_type_id: z.number("Оберіть тип операції"),
   product_id: z.number("Оберіть продукт"),
   order: z.number("Вкажіть порядок").int("Порядок має бути цілим числом").min(0, "Порядок не може бути від'ємним"),
})

export type OperationCreateForm = z.infer<typeof operationCreateSchema>

const dateTimeSchema = z.string().min(1, "Оберіть дату і час").nullable().optional()

export const operationUpdateSchema = z
   .object({
      station_id: z.number("Оберіть станцію"),
      status: z.enum(statusValues, "Оберіть статус"),
      start_at: dateTimeSchema,
      end_at: dateTimeSchema,
   })
   .refine(data => !data.start_at || !data.end_at || data.end_at >= data.start_at, {
      message: "Час закінчення не може бути раніше часу початку",
      path: ["end_at"],
   })

export type OperationUpdateForm = z.infer<typeof operationUpdateSchema>
