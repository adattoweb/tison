import { createContext } from "react"
import type { ToastType } from "./types"

export interface ToastOptions {
   type?: ToastType
   duration?: number
}

interface ToastContextValue {
   addToast: (message: string, options?: ToastOptions) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
