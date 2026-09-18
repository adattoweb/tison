export interface DepartmentRead {
   id: number
   name: string
   description: string | null
}
export interface DepartmentUpdatePayload {
   name: string
   description: string | null
}
