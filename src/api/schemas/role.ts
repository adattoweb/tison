import { z } from "zod"

export const RoleSchema = z.object({
   name: z.string().min(1, "Обов'язкове поле").max(64, "Максимум 64 символи"),
})

export type RoleFormInput = z.infer<typeof RoleSchema>
