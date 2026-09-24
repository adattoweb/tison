export interface OperationTypeRead {
   id: number
   name: string
   description: string | null
   points: number
   color: string
   is_active: boolean
}

export interface OperationTypeCreatePayload {
   name: string
   description?: string | null
   points: number
   color: string
}

export interface OperationTypeUpdatePayload extends OperationTypeCreatePayload {
   is_active: boolean
}
