import { api } from "@/api/api"
import type { MeRead, UserRead } from "@/api/types/auth"

export const login = async (email: string, password: string): Promise<void> => {
   const formData = new URLSearchParams()
   formData.append("username", email)
   formData.append("password", password)

   await api.post("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
   })
}

export const logout = async (): Promise<void> => {
   await api.post("/auth/logout")
}

export const getCurrentUser = async (): Promise<UserRead> => {
   const { data } = await api.get<UserRead>("/users/me")
   return data
}

export const getMe = async (): Promise<MeRead> => {
   const { data } = await api.get<MeRead>("/auth/me")
   return data
}
