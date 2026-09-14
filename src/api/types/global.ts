export interface ApiErrorResponse {
   detail: string | { code: string; reason: string }
}
export interface LoginCredentials {
   email: string
   password: string
}
