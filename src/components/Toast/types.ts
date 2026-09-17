export type ToastType = "info" | "success" | "error" | "warning"

export interface ToastData {
   id: string
   message: string
   type?: ToastType
   duration?: number
}
