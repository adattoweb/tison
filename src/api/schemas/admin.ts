// api/schemas/admin.ts
import { z } from "zod"
import { UserRouterCreateSchema } from "./user"
import { ProfileBaseSchema } from "./profile"

export const AdminUserCreateSchema = z.object({
   user: UserRouterCreateSchema,
   profile: ProfileBaseSchema,
})

export type AdminUserCreateFormInput = z.input<typeof AdminUserCreateSchema>
export type AdminUserCreateInput = z.output<typeof AdminUserCreateSchema>
