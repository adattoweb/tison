import { z } from "zod"

const timeSchema = z
   .string({ error: "Оберіть час" }) // спрацьовує, коли значення undefined (тип не збігається)
   .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Некоректний формат часу")

export const stationCreateSchema = z
   .object({
      department_id: z.number("Оберіть дільницю"),
      responsible_id: z.uuid().nullable().optional(),
      description: z.string().max(512).nullable().optional(),
      start_at: timeSchema,
      end_at: timeSchema,
   })
   .refine(data => data.end_at > data.start_at, {
      message: "Час закінчення не може бути раніше часу початку",
      path: ["end_at"],
   })

export type StationCreateForm = z.infer<typeof stationCreateSchema>
