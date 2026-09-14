import axiosInstance from "../axiosInstance"
import type { AxiosResponse } from "axios"
import type { UserRead } from "../types/user"

export const login = (email: string, password: string): Promise<AxiosResponse<void>> => {
   const formData = new URLSearchParams()
   formData.append("username", email)
   formData.append("password", password)

   return axiosInstance.post("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
   })
}

export const logout = (): Promise<AxiosResponse<void>> => axiosInstance.post("/auth/logout")

export const getCurrentUser = (): Promise<AxiosResponse<UserRead>> => axiosInstance.get("/users/me")

export const forgotPassword = (email: string): Promise<AxiosResponse<void>> =>
   axiosInstance.post("/auth/forgot-password", { email })

export const resetPassword = (token: string, password: string): Promise<AxiosResponse<void>> =>
   axiosInstance.post("/auth/reset-password", { token, password })
