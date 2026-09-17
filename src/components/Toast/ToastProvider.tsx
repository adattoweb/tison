import { useCallback, useRef, useState } from "react"
import type { ReactNode } from "react"
import type { ToastData } from "./types"
import { ToastContainer } from "./ToastContainer"
import { ToastContext, type ToastOptions } from "./ToastContext"

interface ToastProviderProps {
   children: ReactNode
   maxVisible?: number
}

export function ToastProvider({ children, maxVisible = 3 }: ToastProviderProps) {
   const [queue, setQueue] = useState<ToastData[]>([])
   const idRef = useRef(0)

   const addToast = useCallback((message: string, options?: ToastOptions) => {
      idRef.current += 1
      setQueue(prev => [
         ...prev,
         {
            id: `toast-${idRef.current}`,
            message,
            type: options?.type ?? "info",
            duration: options?.duration,
         },
      ])
   }, [])

   const removeToast = useCallback((id: string) => {
      setQueue(prev => prev.filter(t => t.id !== id))
   }, [])

   const visibleToasts = queue.slice(0, maxVisible)

   return (
      <ToastContext.Provider value={{ addToast }}>
         {children}
         <ToastContainer toasts={visibleToasts} onRemove={removeToast} />
      </ToastContext.Provider>
   )
}
