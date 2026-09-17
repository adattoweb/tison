import { z } from "zod"

export const UserRouterCreateSchema = z.object({
   email: z.email("Невірний формат email").min(1, "Обов'язкове поле"),
   role_id: z.coerce.number({ message: "Оберіть роль" }).int().positive("Оберіть роль"),
})

export type UserRouterCreateInput = z.infer<typeof UserRouterCreateSchema>
