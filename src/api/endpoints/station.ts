import { api } from "@/api/api"
import type { StationListRead } from "../types/station"

export const getAllStations = async (): Promise<StationListRead> => {
   const { data } = await api.get<StationListRead>("/stations/")
   return data
}
