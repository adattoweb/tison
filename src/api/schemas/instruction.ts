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
export const InstructionEditFormSchema = InstructionBaseSchema.extend({
   details: z.array(
      z.object({
         key: z.string().trim().min(1, "Введіть назву"),
         value: z.string().trim().min(1, "Введіть значення"),
      }),
   ),
   steps: z.array(z.object({ value: z.string().trim().min(1, "Введіть текст") })),
   checkpoints: z.array(z.object({ value: z.string().trim().min(1, "Введіть текст") })),
})

export type InstructionEditFormInput = z.infer<typeof InstructionEditFormSchema>
export type InstructionBaseInput = z.infer<typeof InstructionBaseSchema>
export type InstructionCreateInput = z.infer<typeof InstructionCreateSchema>
export type InstructionUpdateInput = z.infer<typeof InstructionUpdateSchema>
