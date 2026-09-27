import type { PermissionListRead } from "./permission"

export interface RoleListRead {
   id: number
   name: string
}

export interface RolePermissionListRead {
   role_id: number
   permission_id: number
}

export interface RolePermissionRead extends RolePermissionListRead {
   permission: PermissionListRead
}

export interface RoleRead extends RoleListRead {
   role_permissions: RolePermissionRead[]
}
