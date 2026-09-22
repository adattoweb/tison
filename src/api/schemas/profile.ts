import { z } from "zod"
import { isValidPhoneNumber } from "libphonenumber-js"

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
      .refine(val => isValidPhoneNumber(val), {
         message: "Невірний номер телефону",
      }),
   salary: z.coerce.number().int("Ціле число").nonnegative("Не може бути відʼємним"),
   position: z.string().min(1, "Обов'язкове поле").max(32),
   shift_id: z.preprocess(val => (val === "" || val === undefined ? null : Number(val)), z.number().int().nullable()),
})

export const ProfileUpdateSchema = ProfileBaseSchema.pick({
   first_name: true,
   last_name: true,
   middle_name: true,
   telegram: true,
   phone: true,
})

export const ProfileAdminUpdateSchema = ProfileBaseSchema.pick({
   first_name: true,
   last_name: true,
   middle_name: true,
   telegram: true,
   phone: true,
   salary: true,
   position: true,
   shift_id: true,
}).extend({
   points: z.coerce.number().int("Ціле число").nonnegative("Не може бути відʼємним"),
   email: z.string().email("Невірний формат email").max(100, "Максимум 100 символів"),
})

export type ProfileUpdateFormInput = z.input<typeof ProfileUpdateSchema>
export type ProfileBaseInput = z.infer<typeof ProfileBaseSchema>
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>

export type ProfileAdminUpdateFormInput = z.input<typeof ProfileAdminUpdateSchema>
export type ProfileAdminUpdateInput = z.infer<typeof ProfileAdminUpdateSchema>
