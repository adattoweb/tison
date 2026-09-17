import { z } from "zod"

export const ProfileBaseSchema = z.object({
   first_name: z.string().min(1, "Обов'язкове поле").max(32),
   last_name: z.string().min(1, "Обов'язкове поле").max(32),
   middle_name: z.string().min(1, "Обов'язкове поле").max(32),
   telegram: z.preprocess(
      val => (val === "" ? undefined : val),
      z
         .string()
         .regex(/^@?[A-Za-z0-9_]{5,32}$/, "Невірний формат telegram")
         .optional(),
   ),
   phone: z
      .string()
      .min(1, "Обов'язкове поле")
      .regex(/^\+?[0-9]{9,15}$/, "Невірний формат телефону"),
   salary: z.coerce.number().int("Ціле число").nonnegative("Не може бути відʼємним"),
   position: z.string().min(1, "Обов'язкове поле").max(32),
   shift_id: z.preprocess(
      val => (val === "" || val === undefined ? undefined : Number(val)),
      z.number().int().optional(),
   ),
})

export type ProfileBaseInput = z.infer<typeof ProfileBaseSchema>
