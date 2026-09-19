export interface PaginationParams {
   page: number
   pageSize: number
   search?: string
}

export interface ParamsWithShift extends PaginationParams {
   shiftId?: number
}

export interface ParamsWithActive extends PaginationParams {
   isActive: boolean
}
