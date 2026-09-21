import type { PermissionRead } from "./permission"

// Юзери, логіни - все тут
export interface LoginCredentials {
   email: string
   password: string
}

export interface UserRead {
   id: string
   email: string
   is_active: boolean
   is_superuser: boolean
   is_verified: boolean
}

export interface MeRead {
   id: string
   email: string
   is_superuser: boolean
   role: string | null
   permissions: PermissionRead[]
}
