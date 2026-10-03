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

export interface UserIsActiveRead {
   is_active: boolean
}

export interface UserIsSuperUserRead {
   is_superuser: boolean
}

export interface MeRead {
   id: string
   email: string
   is_superuser: boolean
   role: string | null
   permissions: PermissionRead[]
}

export interface ForgotPasswordPayload {
   email: string
}

export interface ResetPasswordPayload {
   token: string
   password: string
}
