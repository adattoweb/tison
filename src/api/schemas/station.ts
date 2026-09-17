import { z } from "zod"

export const stationCreateSchema = z.object({
   department_id: z.number("Оберіть дільницю"),
   responsible_id: z.uuid().nullable().optional(),
   description: z.string().max(512).nullable().optional(),
   start_at: z.string().nullable().optional(),
   end_at: z.string().nullable().optional(),
})

export type StationCreateForm = z.infer<typeof stationCreateSchema>
