import type { InstructionListRead } from "./instruction"

export interface ProductModelListRead {
   id: number
   title: string
   description: string | null
   images: string[]
   is_active: boolean
   type: string
   steps: InstructionListRead[]
   details_ids: number[]
   is_detail: boolean
}

export interface ProductModelRead extends ProductModelListRead {}

export interface ProductModelUpdatePayload {
   title: string
   description: string | null
   images: string[]
   type: string
   details_ids: number[]
   is_detail: boolean
}
