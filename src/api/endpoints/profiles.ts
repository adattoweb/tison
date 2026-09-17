import { api } from "@/api/api"
import type { ProfileRead } from "../types/profile"

export const getCurrentProfile = async (): Promise<ProfileRead> => {
   const { data } = await api.get<ProfileRead>("/profile/")
   return data
}

export const getAllProfiles = async (): Promise<ProfileRead[]> => {
   const { data } = await api.get<ProfileRead[]>("/profiles/")
   return data
}
