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
