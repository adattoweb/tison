import { api } from "@/api/api"
import type { StationsOverview, StationSummary, StationWorkloadPage } from "@/api/types/stationAnalytics"
import type { StationWorkSessionListRead } from "@/api/types/workSession"
import type { ProductListRead } from "@/api/types/product"

export interface GetStationWorkloadParams {
   days?: number
   page?: number
}

export const getStationWorkload = async (
   stationId: number,
   params: GetStationWorkloadParams = {},
): Promise<StationWorkloadPage> => {
   const { data } = await api.get<StationWorkloadPage>(`/analytics/stations/${stationId}/workload`, {
      params: { days: params.days, page: params.page },
   })
   return data
}

export interface GetStationRecentParams {
   limit?: number
}

export const getStationRecentWorkSessions = async (
   stationId: number,
   params: GetStationRecentParams = {},
): Promise<StationWorkSessionListRead[]> => {
   const { data } = await api.get<StationWorkSessionListRead[]>(`/analytics/stations/${stationId}/work-sessions`, {
      params: { limit: params.limit },
   })
   return data
}

export const getStationWorkedProducts = async (
   stationId: number,
   params: GetStationRecentParams = {},
): Promise<ProductListRead[]> => {
   const { data } = await api.get<ProductListRead[]>(`/analytics/stations/${stationId}/worked-products`, {
      params: { limit: params.limit },
   })
   return data
}

export const getStationsOverview = async (): Promise<StationsOverview> => {
   const { data } = await api.get<StationsOverview>("/analytics/stations/overview")
   return data
}

export const getStationSummary = async (stationId: number): Promise<StationSummary> => {
   const { data } = await api.get<StationSummary>(`/analytics/stations/${stationId}/summary`)
   return data
}
