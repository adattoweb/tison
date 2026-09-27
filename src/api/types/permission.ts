export interface Permission {
   resource: string
   action: string
}

export interface PermissionListRead {
   id: number
   resource: string
   action: string
   description: string | null
}

export type PermissionRead = PermissionListRead
