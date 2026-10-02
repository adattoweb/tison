import { z } from "zod"

export const WorkSessionCreateSchema = z.object({
   station_id: z.number("Обов'язкове поле").int(),
   operation_id: z.number("Обов'язкове поле").int(),
   note: z.string().max(512).optional(),
})

export const WorkSessionEndSchema = z.object({
   result: z.enum(["PAUSED", "COMPLETED", "CANCELLED"]),
   note: z.string().max(512).optional(),
})

export type WorkSessionCreateInput = z.infer<typeof WorkSessionCreateSchema>
export type WorkSessionEndInput = z.infer<typeof WorkSessionEndSchema>
