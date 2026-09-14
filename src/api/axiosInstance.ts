import axios from "axios"
import { redirect } from "react-router"

const axiosInstance = axios.create({
   baseURL: "http://localhost:8000/api/v1",
   withCredentials: true,
   headers: {
      "Content-Type": "application/json",
   },
})

axiosInstance.interceptors.response.use(
   response => response,
   error => {
      if (error.response?.status === 401) {
         redirect("/login")
      }
      return Promise.reject(error)
   },
)

export default axiosInstance
