export interface PaginationParams {
   page: number
   pageSize: number
   search?: string
}

export interface ProfileParams extends PaginationParams {
   shiftId?: number
}
