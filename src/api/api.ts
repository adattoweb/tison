import axios from "axios"

export const api = axios.create({
   baseURL: "http://localhost:8000/api/v1",
   withCredentials: true,
   headers: {
      "Content-Type": "application/json",
   },
})

// api.interceptors.response.use(
//    response => response,
//    error => {
//       const status = error.response?.status
//       const isLoginPage = window.location.pathname === "/login"

//       if (status === 401 && !isLoginPage) {
//          window.location.href = "/login"
//       }

//       return Promise.reject(error)
//    },
// )
