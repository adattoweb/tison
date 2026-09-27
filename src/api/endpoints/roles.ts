import { api } from "@/api/api"
import type { RoleRead } from "@/api/types/role"
import type { RoleFormInput } from "@/api/schemas/role"

export const getRoles = async (): Promise<RoleRead[]> => {
   const { data } = await api.get<RoleRead[]>("/roles")
   return data
}

export const createRole = async (payload: RoleFormInput): Promise<RoleRead> => {
   const { data } = await api.post<RoleRead>("/roles", payload)
   return data
}

export const updateRole = async (id: number, payload: RoleFormInput): Promise<RoleRead> => {
   const { data } = await api.put<RoleRead>(`/roles/${id}`, payload)
   return data
}

export const deleteRole = async (id: number): Promise<void> => {
   await api.delete(`/roles/${id}`)
}
