import { z } from "zod"

export const InstructionBaseSchema = z.object({
   title: z.string().min(1, "Обов'язкове поле").max(255, "Максимум 255 символів"),
   description: z.string().max(1024, "Максимум 1024 символи"),
   operation_type_id: z.number({ error: "Оберіть тип операції" }).int(),
   planned_time: z.number().int("Введіть ціле число").min(0, "Не може бути від'ємним").nullable().optional(),
})

export const InstructionCreateSchema = InstructionBaseSchema.extend({
   product_model_id: z.number({ error: "Оберіть модель" }).int(),
})

export const InstructionUpdateSchema = InstructionBaseSchema.extend({
   order: z.number({ error: "Введіть порядок" }).int(),
   details: z
      .array(z.record(z.string(), z.union([z.string(), z.number()])))
      .nullable()
      .optional(),
   steps: z.array(z.string()).nullable().optional(),
   checkpoints: z.array(z.string()).nullable().optional(),
})

export type InstructionBaseInput = z.infer<typeof InstructionBaseSchema>
export type InstructionCreateInput = z.infer<typeof InstructionCreateSchema>
export type InstructionUpdateInput = z.infer<typeof InstructionUpdateSchema>
