import { z } from "zod"

export const operationTypeSchema = z.object({
   name: z.string({ error: "Введіть назву" }).min(1, "Введіть назву").max(255, "Максимум 255 символів"),
   description: z.string().max(512, "Максимум 512 символів").nullable().optional(),
   points: z.number({ error: "Введіть кількість балів" }).int("Бали мають бути цілим числом"),
   color: z
      .string({ error: "Оберіть колір" })
      .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Некоректний формат кольору (напр. #61D381)"),
})

export type OperationTypeForm = z.infer<typeof operationTypeSchema>
