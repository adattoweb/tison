import { api } from "@/api/api"
import type { PaginatedResponse } from "../types/pagination"
import type { StationListRead, StationCreatePayload } from "../types/station"
import type { StatusType } from "@/types/status"

export interface GetStationsParams {
   page: number
   pageSize: number
   departmentId?: number
   status?: StatusType
   search?: string
}

export const getAllStations = async (params: GetStationsParams): Promise<PaginatedResponse<StationListRead>> => {
   const { data } = await api.get<PaginatedResponse<StationListRead>>("/stations/", {
      params: {
         page: params.page,
         page_size: params.pageSize,
         department_id: params.departmentId,
         status: params.status,
         search: params.search,
      },
   })
   return data
}

export const createStation = async (payload: StationCreatePayload): Promise<StationCreatePayload> => {
   const { data } = await api.post<StationCreatePayload>("/stations/", payload)
   return data
}

export const editStation = async (payload: StationCreatePayload): Promise<StationCreatePayload> => {
   const { data } = await api.post<StationCreatePayload>("/stations/", payload)
   return data
}

export const getStationById = async (id: number): Promise<StationListRead> => {
   const { data } = await api.get<StationListRead>(`/stations/${id}`)
   return data
}
