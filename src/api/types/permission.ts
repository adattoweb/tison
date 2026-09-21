export interface PermissionRead {
   id: number
   description: string | null
   resource: string
   action: string
}

export interface Permission {
   resource: string
   action: string
}
