export type action = "create" | "update" | "read" | "delete"

export interface Permission {
   resource: string
   action: action
}

export interface PermissionListRead {
   id: number
   resource: string
   action: string
   description: string | null
}

export type PermissionRead = PermissionListRead
