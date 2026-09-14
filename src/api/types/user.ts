export interface UserRead {
   id: string
   email: string
   is_active: boolean
   is_superuser: boolean
   is_verified: boolean
}

export interface UserCreate {
   email: string
   role_id: number
}
