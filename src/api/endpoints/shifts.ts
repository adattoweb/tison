import { api } from "@/api/api"
import type { ShiftRead } from "@/api/types/shift"

export const getShifts = async (): Promise<ShiftRead[]> => {
   const { data } = await api.get<ShiftRead[]>("/shifts/")
   return data
}
