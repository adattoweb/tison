export interface ProductModelListRead {
   id: number
   title: string
   description: string | null
   images: string[]
   is_active: boolean
   type: string
}
export interface ProductModelUpdatePayload {
   title: string
   description: string | null
   images: string[]
   type: string
}
